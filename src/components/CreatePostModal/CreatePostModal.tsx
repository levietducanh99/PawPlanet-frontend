import React, { useState } from 'react';
import { Modal, Input, Select, Button, Avatar, Upload, message, Switch } from 'antd';
import { motion } from 'framer-motion';
import { UploadOutlined, CloseOutlined, AlertOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useCreatePost } from '@/hooks/useCreatePost';
import { useUserProfile } from '@/hooks/useUser';
import { useUserPets } from '@/hooks/useUserPets';
import { useNavigate } from 'react-router-dom';
import { uploadMedia } from '@/services/media.service';
import type { CloudinaryUploadResponse } from '@/domain/media';
import type { AllPetsResponseDTO, MediaUrlRequest } from '@/services/api';
import styles from './CreatePostModal.module.css';


const privacyOptions = [
  { label: 'Public', value: 'public', icon: '🌐' },
  { label: 'Friends', value: 'friends', icon: '👥' },
  { label: 'Only Me', value: 'private', icon: '🔒' },
];

const typeOptions = [
  { label: 'Daily Moment', value: 'general' },
  { label: 'Rescue', value: 'rescue' },
  { label: 'Lost & Found', value: 'lost' },
];

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ open, onClose }) => {
  const [privacy, setPrivacy] = useState('public');
  const [type, setType] = useState('general');
  const [content, setContent] = useState('');
  const [selectedPets, setSelectedPets] = useState<number[]>([]);
  const [mediaList, setMediaList] = useState<UploadFile[]>([]);
  const [posting, setPosting] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const { submit, loading: apiLoading, error } = useCreatePost();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUserProfile();
  const { pets, loading: petsLoading } = useUserPets();

  // Nếu chưa login, điều hướng sang /login
  React.useEffect(() => {
    if (!userLoading && !user) {
      onClose();
      navigate('/login');
    }
  }, [user, userLoading, navigate, onClose]);

  const handlePetTag = (id: number) => {
    setSelectedPets((prev) => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  const handleUpload = ({ fileList }: { fileList: UploadFile[] }) => {
    // Validate file size (max 50MB cho video, 10MB cho ảnh)
    const validFiles = fileList.filter(file => {
      const isVideo = file.type?.startsWith('video/');
      const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for video, 10MB for image

      if (file.size && file.size > maxSize) {
        message.error(`${file.name}: File size exceeds ${isVideo ? '50MB' : '10MB'} limit`);
        return false;
      }
      return true;
    });

    setMediaList(validFiles);
  };

  const handlePost = async () => {
    setPosting(true);
    try {
      // Upload media lên Cloudinary nếu có file local (chưa có url)
      const uploadedMedia: CloudinaryUploadResponse[] = [];
      for (const file of mediaList) {
        if (!file.url && file.originFileObj) {
          // context POST_MEDIA, ownerId là user?.id
          const res = await uploadMedia(file.originFileObj, { context: 'POST_MEDIA', ownerId: user?.id });
          uploadedMedia.push(res);
        } else if (file.url) {
          // Đã có url (có thể là ảnh đã upload trước đó)
          uploadedMedia.push({ url: file.url, secureUrl: file.url, resourceType: 'image' } as CloudinaryUploadResponse);
        }
      }

      // Chuẩn hóa dữ liệu gửi API - Backend chỉ cần publicId và type
      const hashtags = '';
      const mediaUrls: MediaUrlRequest[] = uploadedMedia.map(f => {
        // Detect media type từ resourceType của Cloudinary
        const mediaType = f.resourceType === 'video' ? 'video' : 'image';

        return {
          publicId: f.publicId, // Backend nhận publicId thay vì url
          type: mediaType
        };
      });

      const data = {
        content,
        hashtags,
        type: isUrgent ? 'urgent' : type,
        petIds: selectedPets,
        mediaUrls, // No need to cast - already correct type
      };


      const result = await submit(data);
      if (result) {
        message.success('Post created successfully!');
        setContent('');
        setMediaList([]);
        setSelectedPets([]);
        setIsUrgent(false);
        onClose();
      } else if (error) {
        message.error(error);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload media';
      message.error(errorMessage);
    } finally {
      setPosting(false);
    }
  };

  const handleClose = () => {
    if (!posting) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={560}
      className={styles.modalRoot}
      maskClosable={!posting}
      closeIcon={<CloseOutlined style={{ fontSize: 16, color: '#6B7280' }} />}
      title={null}
      modalRender={modal => (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          {modal}
        </motion.div>
      )}
    >
      {/* Header with User Info and Controls */}
      <div className={styles.header}>
        <Avatar src={user?.avatarUrl} size={48} className={styles.avatar} />
        <div className={styles.userInfo}>
          <span className={styles.displayName}>{user?.username || user?.email}</span>
          <Select
            className={styles.privacySelect}
            value={privacy}
            onChange={setPrivacy}
            options={privacyOptions.map(opt => ({
              value: opt.value,
              label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </div>
              ),
            }))}
            variant="borderless"
            size="small"
          />
        </div>
        <Select
          className={styles.typeSelect}
          value={type}
          onChange={setType}
          options={typeOptions}
          variant="borderless"
          size="small"
        />
      </div>

      {/* Urgent Toggle Section */}
      <div className={`${styles.urgentSection} ${isUrgent ? styles.urgentActive : ''}`}>
        <div className={styles.urgentToggleContainer}>
          <div className={styles.urgentLabel}>
            <AlertOutlined className={styles.urgentIcon} />
            <div>
              <span className={styles.urgentTitle}>Mark as Urgent</span>
              <span className={styles.urgentSubtitle}>This post requires immediate attention</span>
            </div>
          </div>
          <Switch
            checked={isUrgent}
            onChange={setIsUrgent}
            className={styles.urgentSwitch}
          />
        </div>
        {isUrgent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={styles.urgentPreview}
          >
            <div className={styles.urgentBadge}>
              <AlertOutlined /> URGENT
            </div>
            <span className={styles.urgentPreviewText}>Your post will be highlighted to get faster responses</span>
          </motion.div>
        )}
      </div>

      {/* Content Input */}
      <Input.TextArea
        className={`${styles.textArea} ${isUrgent ? styles.textAreaUrgent : ''}`}
        placeholder="What's on your furry friend's mind today?"
        autoSize={{ minRows: 4, maxRows: 8 }}
        value={content}
        onChange={e => setContent(e.target.value)}
        maxLength={2000}
        showCount
        variant="borderless"
      />

      {/* Media Preview Gallery */}
      {mediaList.length > 0 && (
        <div className={styles.mediaGallery}>
          {mediaList.map((file) => {
            const isVideo = file.type?.startsWith('video/');
            const previewUrl = file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : '');

            return (
              <motion.div
                key={file.uid}
                className={styles.galleryItem}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {isVideo ? (
                  <>
                    <video
                      src={previewUrl}
                      className={styles.galleryMedia}
                      muted
                      loop
                      playsInline
                    />
                    <div className={styles.videoIndicator}>
                      <PlayCircleOutlined />
                    </div>
                  </>
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className={styles.galleryMedia}
                  />
                )}
                <Button
                  type="text"
                  danger
                  icon={<CloseOutlined />}
                  className={styles.galleryRemoveBtn}
                  onClick={() => {
                    const newList = mediaList.filter(item => item.uid !== file.uid);
                    setMediaList(newList);
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Media Upload */}
      <Upload.Dragger
        className={styles.mediaUpload}
        fileList={mediaList}
        onChange={handleUpload}
        beforeUpload={() => false}
        multiple
        accept="image/*,video/*"
        showUploadList={false}
      >
        <UploadOutlined style={{ fontSize: 24, color: '#1890FF', marginBottom: 8 }} />
        <div style={{ color: '#6B7280', fontSize: 16, fontWeight: 500 }}>
          Add Photos & Videos
        </div>
        <div style={{ color: '#9CA3AF', fontSize: 14, marginTop: 4 }}>
          Drag & drop or click to upload multiple files
        </div>
        <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>
          Images (max 10MB) • Videos (max 50MB)
        </div>
      </Upload.Dragger>

      {/* Pet Tags Section */}
      <div className={styles.petSection}>
        <span className={styles.petLabel}>Tag Your Pets:</span>
        <div className={styles.petTagList}>
          {petsLoading ? (
            <span>Loading pets...</span>
          ) : pets.length === 0 ? (
            <span>No pets found</span>
          ) : pets.map((pet: AllPetsResponseDTO) => {
            const petId = pet.id ?? 0;
            const petName = pet.name ?? 'Unknown Pet';
            const avatarUrl = pet.avatar; // AllPetsResponseDTO has direct avatar field

            return (
              <div
                key={petId}
                className={`${styles.petTag} ${selectedPets.includes(petId) ? styles.selected : ''}`}
                onClick={() => handlePetTag(petId)}
              >
                <Avatar
                  src={avatarUrl}
                  size={44}
                  className={styles.petAvatar}
                  style={{
                    backgroundColor: avatarUrl ? undefined : '#1890FF',
                  }}
                >
                  {!avatarUrl && petName.charAt(0).toUpperCase()}
                </Avatar>
                <span className={styles.petName}>{petName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer with Action Buttons */}
      <div className={styles.footer}>
        <Button
          className={styles.cancelBtn}
          onClick={handleClose}
          disabled={posting}
          size="large"
        >
          Cancel
        </Button>
        <Button
          type="primary"
          className={styles.postBtn}
          loading={posting || apiLoading}
          disabled={!content.trim() && mediaList.length === 0}
          onClick={handlePost}
          size="large"
        >
          Post
        </Button>
      </div>
    </Modal>
  );
};
