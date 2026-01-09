/**
 * User Profile Page
 * Displays user profile information with tabs for Posts, Photos, Likes, Followers, and Following
 * Integrated with real backend APIs
 */

import React, { useEffect, useState } from 'react';
import { Card, Typography, Avatar, Spin, Button, Tabs, Empty, List, Modal, message } from 'antd';
import { UserOutlined, EditOutlined, MailOutlined, CheckCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useProfileData, useMyPosts, useFollowers, useFollowing, useUserPets, useFollowingPets, usePostActions } from '@/hooks';
import PostCard from '@/components/PostCard/PostCard';
import { CommentModal } from '@/components/CommentDrawer';
import { EditPostModal } from '@/components/EditPostModal';
import { PetPhotoGroup } from '@/components/PetPhotoGroup';
import type { PetPhoto } from '@/components/PetPhotoGroup';
import type { Post } from '@/domain/post';
import type { UpdatePostRequest } from '@/services/api';
import styles from './ProfilePage.module.css';

const { Title, Text, Paragraph } = Typography;

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, error, refreshProfile } = useProfileData();
  const { posts, loading: postsLoading, refetch: refetchPosts } = useMyPosts();
  const { followers, loading: followersLoading } = useFollowers(user?.id || null);
  const { following, loading: followingLoading } = useFollowing(user?.id || null);
  const { loading: petsLoading } = useUserPets();
  const { pets: followingPets, loading: followingPetsLoading } = useFollowingPets(user?.id || null);
  const { likePost, deletePost, updatePost } = usePostActions();
  const [activeTab, setActiveTab] = useState('posts');
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refreshProfile();
  }, []);

  // Sync localPosts with posts from API
  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  // Handlers for post actions
  const handleLike = async (postId: number) => {
    try {
      const result = await likePost(postId);

      // Update local state immediately for optimistic UI
      setLocalPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, isLiked: result.liked, likeCount: result.likeCount }
            : post
        )
      );
    } catch (err) {
      message.error('Failed to like post');
      console.error('Like error:', err);
    }
  };

  const handleComment = (postId: number) => {
    setSelectedPostId(postId);
    setCommentDrawerOpen(true);
  };

  const handleCommentClose = (updatedCommentCount?: number) => {
    // Update comment count optimistically without refetching
    if (selectedPostId && updatedCommentCount !== undefined) {
      setLocalPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === selectedPostId
            ? { ...post, commentCount: updatedCommentCount }
            : post
        )
      );
    }

    setCommentDrawerOpen(false);
    setSelectedPostId(null);
  };

  const handleEdit = (postId: number) => {
    const post = localPosts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setEditModalOpen(true);
    }
  };

  const handleEditSave = async (postId: number, data: UpdatePostRequest) => {
    try {
      const updatedPost = await updatePost(postId, data);
      // Update local posts with edited post
      setLocalPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? updatedPost : post
        )
      );
      message.success('Post updated successfully');
    } catch (error) {
      message.error('Failed to update post');
      throw error; // Let EditPostModal handle error display
    }
  };

  const handleShare = (postId: number) => {
    console.log('Share post:', postId);
  };

  const handleDelete = async (postId: number) => {
    Modal.confirm({
      title: 'Delete Post',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this post? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deletePost(postId);
          message.success('Post deleted successfully');
          // Refresh posts to reflect deletion
          refetchPosts();
        } catch (err) {
          message.error('Failed to delete post');
          console.error('Delete error:', err);
        }
      },
    });
  };

  console.log(followers)

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <Text style={{ marginTop: 16 }}>Loading profile...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Card>
          <Text type="danger">{error}</Text>
          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={refreshProfile}>
              Retry
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate('/')}>
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.errorContainer}>
        <Card>
          <Text>No user data found</Text>
          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Tab content renderers
  const renderPostsTab = () => {
    if (postsLoading) {
      return (
        <div className={styles.loadingTab}>
          <Spin size="large" />
        </div>
      );
    }

    if (localPosts.length === 0) {
      return (
        <div className={styles.emptyState}>
          <Empty description="No posts yet" />
        </div>
      );
    }

    return (
      <div className={styles.postsContainer}>
        {localPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    );
  };

  const renderPhotosTab = () => {
    if (postsLoading || petsLoading) {
      return (
        <div className={styles.loadingTab}>
          <Spin size="large" />
        </div>
      );
    }

    // Group photos by pet
    const photosByPet = new Map<number | string, {
      petId?: number;
      petName: string;
      petAvatar?: string;
      photos: PetPhoto[];
    }>();

    // Process all posts with media
    localPosts.forEach(post => {
      const images = (post.media || []).filter(m => m.type === 'image');

      if (images.length > 0) {
        const key = post.petId || 'no-pet';
        const petName = post.petName || 'General Posts';
        const petAvatar = post.petAvatar;

        if (!photosByPet.has(key)) {
          photosByPet.set(key, {
            petId: post.petId,
            petName,
            petAvatar,
            photos: []
          });
        }

        const group = photosByPet.get(key)!;
        images.forEach(media => {
          group.photos.push({
            postId: post.id,
            url: media.url,
          });
        });
      }
    });

    // Convert to array and sort (pets first, then general posts)
    const petGroups = Array.from(photosByPet.values()).sort((a, b) => {
      if (a.petId && !b.petId) return -1;
      if (!a.petId && b.petId) return 1;
      return a.petName.localeCompare(b.petName);
    });

    if (petGroups.length === 0) {
      return (
        <div className={styles.emptyState}>
          <Empty description="No photos yet" />
        </div>
      );
    }

    return (
      <div className={styles.photosContainer}>
        {petGroups.map((group, index) => (
          <PetPhotoGroup
            key={group.petId || `no-pet-${index}`}
            petId={group.petId}
            petName={group.petName}
            petAvatar={group.petAvatar}
            photos={group.photos}
            onPhotoClick={(photo) => {
              console.log('Open photo:', photo.url);
            }}
            onPetClick={(petId) => {
              if (petId) {
                navigate(`/pet/${petId}`);
              }
            }}
          />
        ))}
      </div>
    );
  };

  const renderFollowersTab = () => {
    if (followersLoading) {
      return (
        <div className={styles.loadingTab}>
          <Spin size="large" />
        </div>
      );
    }

    if (followers.length === 0) {
      return (
        <div className={styles.emptyState}>
          <Empty description="No followers yet" />
        </div>
      );
    }

    return (
      <div className={styles.followList}>
        <List
          dataSource={followers}
          renderItem={(follower) => (
            <List.Item
              className={styles.followListItem}
              actions={[
                <Button
                  key="view"
                  type="link"
                  onClick={() => navigate(`/user/${follower.id}`)}
                >
                  View Profile
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    size={48}
                    src={follower.avatarUrl}
                    icon={<UserOutlined />}
                  />
                }
                title={follower.fullName || follower.username}
                description={follower.bio || `@${follower.username}`}
              />
            </List.Item>
          )}
        />
      </div>
    );
  };

  const renderFollowingTab = () => {
    if (followingLoading) {
      return (
        <div className={styles.loadingTab}>
          <Spin size="large" />
        </div>
      );
    }

    if (following.length === 0) {
      return (
        <div className={styles.emptyState}>
          <Empty description="Not following anyone yet" />
        </div>
      );
    }

    return (
      <div className={styles.followList}>
        <List
          dataSource={following}
          renderItem={(user) => (
            <List.Item
              className={styles.followListItem}
              actions={[
                <Button
                  key="view"
                  type="link"
                  onClick={() => navigate(`/user/${user.id}`)}
                >
                  View Profile
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    size={48}
                    src={user.avatarUrl}
                    icon={<UserOutlined />}
                  />
                }
                title={user.fullName || user.username}
                description={user.bio || `@${user.username}`}
              />
            </List.Item>
          )}
        />
      </div>
    );
  };

  const renderFollowingPetsTab = () => {
    if (followingPetsLoading) {
      return (
        <div className={styles.loadingTab}>
          <Spin size="large" />
        </div>
      );
    }

    if (followingPets.length === 0) {
      return (
        <div className={styles.emptyState}>
          <Empty description="Not following any pets yet" />
        </div>
      );
    }

    return (
      <div className={styles.petList}>
        <List
          dataSource={followingPets}
          renderItem={(pet) => (
            <List.Item
              className={styles.petListItem}
              actions={[
                <Button
                  key="view"
                  type="link"
                  onClick={() => navigate(`/pet/${pet.id}`)}
                >
                  View Profile
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    size={56}
                    src={pet.avatarUrl}
                    className={styles.petAvatar}
                  >
                    {!pet.avatarUrl && pet.name.charAt(0).toUpperCase()}
                  </Avatar>
                }
                title={<span className={styles.petName}>{pet.name}</span>}
              />
            </List.Item>
          )}
        />
      </div>
    );
  };

  // Calculate counts
  const postsCount = localPosts.length;
  const photosCount = localPosts.reduce((acc, post) =>
    acc + (post.media?.filter(m => m.type === 'image').length || 0), 0
  );
  const likesCount = localPosts.reduce((acc, post) => acc + (post.likeCount || 0), 0);
  const followersCount = user.followersCount || followers.length;
  const followingCount = user.followingCount || following.length;
  const followingPetsCount = followingPets.length;

  const tabItems = [
    {
      key: 'posts',
      label: (
        <div className={styles.tabLabel}>
          <span>Posts</span>
          <span className={styles.tabCount}>{postsCount}</span>
        </div>
      ),
      children: renderPostsTab(),
    },
    {
      key: 'photos',
      label: (
        <div className={styles.tabLabel}>
          <span>Photos</span>
          <span className={styles.tabCount}>{photosCount}</span>
        </div>
      ),
      children: renderPhotosTab(),
    },
    {
      key: 'followers',
      label: (
        <div className={styles.tabLabel}>
          <span>Followers</span>
          <span className={styles.tabCount}>{followersCount > 1000 ? `${(followersCount / 1000).toFixed(1)}k` : followersCount}</span>
        </div>
      ),
      children: renderFollowersTab(),
    },
    {
      key: 'following',
      label: (
        <div className={styles.tabLabel}>
          <span>Following</span>
          <span className={styles.tabCount}>{followingCount}</span>
        </div>
      ),
      children: renderFollowingTab(),
    },
    {
      key: 'followingPets',
      label: (
        <div className={styles.tabLabel}>
          <span>Following Pets</span>
          <span className={styles.tabCount}>{followingPetsCount}</span>
        </div>
      ),
      children: renderFollowingPetsTab(),
    },
  ];

  return (
    <motion.div
      className={styles.profilePage}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.container}>
        <div className={styles.profileContent}>
          {/* Left Sidebar - Profile Info */}
          <div className={styles.sidebar}>
            <Card className={styles.profileCard}>
              <div className={styles.avatarSection}>
                <div className={styles.avatarWrapper}>
                  <Avatar
                    size={120}
                    src={user.avatarUrl}
                    icon={<UserOutlined />}
                    className={styles.avatar}
                  />
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<EditOutlined />}
                    className={styles.editAvatarButton}
                    onClick={() => navigate('/profile/edit')}
                  />
                </div>
              </div>

              <div className={styles.userInfo}>
                <div className={styles.nameWrapper}>
                  <Title level={3} className={styles.username}>
                    {user.fullName || user.username}
                  </Title>
                  {user.isVerified && (
                    <CheckCircleFilled className={styles.verifiedBadge} />
                  )}
                </div>
                <Text type="secondary" className={styles.handle}>
                  @{user.username}
                </Text>
              </div>

              {user.bio && (
                <Paragraph className={styles.bio}>
                  {user.bio}
                </Paragraph>
              )}

              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>
                    {followersCount > 1000 ? `${(followersCount / 1000).toFixed(1)}k` : followersCount}
                  </div>
                  <div className={styles.statLabel}>Followers</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>{postsCount}</div>
                  <div className={styles.statLabel}>Posts</div>
                </div>
              </div>

              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>{followingCount}</div>
                  <div className={styles.statLabel}>Following</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>
                    {likesCount > 1000 ? `${(likesCount / 1000).toFixed(1)}k` : likesCount}
                  </div>
                  <div className={styles.statLabel}>Likes</div>
                </div>
              </div>

              {user.email && (
                <div className={styles.emailSection}>
                  <MailOutlined className={styles.emailIcon} />
                  <Text className={styles.email}>{user.email}</Text>
                </div>
              )}
            </Card>
          </div>

          {/* Right Content - Tabs */}
          <div className={styles.mainContent}>
            <Card className={styles.contentCard}>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
                className={styles.tabs}
              />
            </Card>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      <CommentModal
        postId={selectedPostId}
        open={commentDrawerOpen}
        onClose={handleCommentClose}
        title="Comments"
      />

      {/* Edit Post Modal */}
      {selectedPost && (
        <EditPostModal
          open={editModalOpen}
          post={selectedPost}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedPost(null);
          }}
          onSave={handleEditSave}
        />
      )}
    </motion.div>
  );
};

