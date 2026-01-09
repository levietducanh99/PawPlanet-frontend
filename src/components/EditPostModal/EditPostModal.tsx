import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, message, Avatar, Alert } from 'antd';
import { UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { Post } from '@/domain/post';
import type { UpdatePostRequest, PetProfileDTO, MediaUrlRequest } from '@/services/api';
import { useUserPets } from '@/hooks';
import styles from './EditPostModal.module.css';

const { TextArea } = Input;

interface EditPostModalProps {
  open: boolean;
  post: Post | null;
  loading?: boolean;
  onClose: () => void;
  onSave: (postId: number, data: UpdatePostRequest) => Promise<void>;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  open,
  post,
  loading = false,
  onClose,
  onSave,
}) => {
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [selectedPets, setSelectedPets] = useState<number[]>([]);
  const { pets, loading: petsLoading } = useUserPets();

  // Update form when post changes
  useEffect(() => {
    if (post) {
      setContent(post.content || '');
      setHashtags(post.tags?.join(' ') || '');
      // Load tagged pets from post
      const taggedPetIds = post.taggedPets?.map(p => p.id) || [];
      setSelectedPets(taggedPetIds);
    }
  }, [post]);

  const handlePetTag = (petId: number) => {
    setSelectedPets((prev) =>
      prev.includes(petId)
        ? prev.filter(id => id !== petId)
        : [...prev, petId]
    );
  };

  const handleSave = async () => {
    if (!post) return;

    if (!content.trim()) {
      message.error('Content cannot be empty');
      return;
    }

    try {
      // Preserve existing media by including mediaUrls in update request
      // Convert PostMedia[] to MediaUrlRequest[] format that backend expects
      const mediaUrls: MediaUrlRequest[] = post.media?.map(media => ({
        publicId: extractPublicIdFromUrl(media.url),
        type: media.type as 'image' | 'video'
      })) || [];

      const updateData: UpdatePostRequest = {
        content: content.trim(),
        hashtags: hashtags.trim(),
        petIds: selectedPets, // Include pet tags
        mediaUrls, // Include existing media to preserve it
      };

      await onSave(post.id, updateData);
      message.success('Post updated successfully');
      onClose();
    } catch (error) {
      message.error('Failed to update post');
      console.error('Update error:', error);
    }
  };

  // Helper function to extract publicId from Cloudinary URL
  const extractPublicIdFromUrl = (url: string): string => {
    try {
      // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{transformations}/{version}/{publicId}.{format}
      // We need to extract the publicId part
      const urlParts = url.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');

      if (uploadIndex !== -1 && uploadIndex < urlParts.length - 1) {
        // Get everything after 'upload/' and remove file extension
        const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
        // Remove version if present (v1234567890)
        const withoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
        // Remove file extension and return
        return withoutVersion.replace(/\.[^/.]+$/, '');
      }

      // Fallback: return the URL as-is if we can't parse it
      return url;
    } catch (error) {
      console.error('Error extracting publicId from URL:', error);
      return url;
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (post) {
      setContent(post.content || '');
      setHashtags(post.tags?.join(' ') || '');
      const taggedPetIds = post.taggedPets?.map(p => p.id) || [];
      setSelectedPets(taggedPetIds);
    }
    onClose();
  };

  return (
    <Modal
      title="Edit Post"
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={loading}
          onClick={handleSave}
          disabled={!content.trim()}
        >
          Save Changes
        </Button>,
      ]}
      width={600}
      centered
      destroyOnClose
    >
      <div className={styles.formContainer}>
        {/* Info about what can be edited */}
        <Alert
          message="You can edit the text content, hashtags, and pet tags. Photos/videos cannot be changed."
          type="info"
          icon={<InfoCircleOutlined />}
          showIcon
          className={styles.infoAlert}
        />

        <div className={styles.formGroup}>
          <label className={styles.label}>Content</label>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            autoSize={{ minRows: 4, maxRows: 10 }}
            className={styles.textarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Hashtags</label>
          <Input
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#tag1 #tag2 #tag3"
            className={styles.input}
          />
          <div className={styles.hint}>
            Separate hashtags with spaces
          </div>
        </div>

        {/* Pet Tags Section */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Tag Your Pets</label>
          {petsLoading ? (
            <div className={styles.hint}>Loading pets...</div>
          ) : pets.length === 0 ? (
            <div className={styles.hint}>No pets found</div>
          ) : (
            <div className={styles.petTagList}>
              {pets.map((pet: PetProfileDTO) => {
                const petId = pet.id ?? 0;
                const petName = pet.name ?? 'Unknown Pet';
                const avatarUrl = pet.media?.find(m => m.role === 'avatar')?.url;
                const isSelected = selectedPets.includes(petId);

                return (
                  <div
                    key={petId}
                    className={`${styles.petTag} ${isSelected ? styles.selected : ''}`}
                    onClick={() => handlePetTag(petId)}
                  >
                    <Avatar
                      src={avatarUrl}
                      icon={<UserOutlined />}
                      size={44}
                      className={styles.petAvatar}
                    />
                    <span className={styles.petName}>{petName}</span>
                  </div>
                );
              })}
            </div>
          )}
          <div className={styles.hint}>
            Click to tag/untag pets in this post
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditPostModal;

