import React, { useState } from 'react';
import { Modal, Input, Select, Button, Avatar, Upload, message } from 'antd';
import { motion } from 'framer-motion';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useCreatePost } from '@/hooks/useCreatePost';
import { useUserProfile } from '@/hooks/useUser';
import { useUserPets } from '@/hooks/useUserPets';
import { useNavigate } from 'react-router-dom';
import { uploadMedia } from '@/services/media.service';
import type { CloudinaryUploadResponse } from '@/domain/media';
import type { PetProfileDTO } from '@/services/api';
import type { PostMediaRequest } from '@/domain/post';
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
      const mediaUrls: PostMediaRequest[] = uploadedMedia.map(f => {
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
        type,
        petIds: selectedPets,
        mediaUrls: mediaUrls as any, // Cast to any vì API type chưa được regenerate
      };

      console.log('📤 Create Post Request:', data);

      const result = await submit(data);
      if (result) {
        message.success('Post created successfully!');
        setContent('');
        setMediaList([]);
        setSelectedPets([]);
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

      {/* Content Input */}
      <Input.TextArea
        className={styles.textArea}
        placeholder="What's on your furry friend's mind today?"
        autoSize={{ minRows: 4, maxRows: 8 }}
        value={content}
        onChange={e => setContent(e.target.value)}
        maxLength={500}
        showCount
        variant="borderless"
      />

      {/* Media Upload */}
      <Upload.Dragger
        className={styles.mediaUpload}
        fileList={mediaList}
        onChange={handleUpload}
        beforeUpload={() => false}
        multiple
        accept="image/*,video/*"
        showUploadList={{ showRemoveIcon: true, showPreviewIcon: false }}
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
          ) : pets.map((pet: PetProfileDTO) => {
            const petId = pet.id ?? 0;
            const petName = pet.name ?? 'Unknown Pet';
            const avatarUrl = pet.media?.find(m => m.role === 'avatar')?.url;

            return (
              <div
                key={petId}
                className={`${styles.petTag} ${selectedPets.includes(petId) ? styles.selected : ''}`}
                onClick={() => handlePetTag(petId)}
              >
                <Avatar src={avatarUrl} size={44} className={styles.petAvatar} />
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
