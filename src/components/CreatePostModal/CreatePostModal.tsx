import React, { useState } from 'react';
import { Modal, Input, Select, Button, Avatar, Upload, message } from 'antd';
import { motion } from 'framer-motion';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useCreatePost } from '@/hooks/useCreatePost';
import styles from './CreatePostModal.module.css';

// Fake data for demo (replace with real data from hooks)
const user = {
  name: 'Sarah Johnson',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
};
const pets = [
  { id: 1, name: 'Charlie', avatar: 'https://images.unsplash.com/photo-1502672023488-70e25813f145?w=80&h=80&fit=crop' },
  { id: 2, name: 'Luna', avatar: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=80&h=80&fit=crop' },
  { id: 3, name: 'Max', avatar: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=80&h=80&fit=crop' },
];

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

  const handlePetTag = (id: number) => {
    setSelectedPets((prev) => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  const handleUpload = ({ fileList }: { fileList: UploadFile[] }) => {
    setMediaList(fileList);
  };

  const handlePost = async () => {
    setPosting(true);
    // Chuẩn hóa dữ liệu gửi API
    const hashtags = '';
    const mediaUrls = mediaList.map(f => ({ url: f.url || f.thumbUrl || '', type: f.type || 'image' }));
    const data = {
      content,
      hashtags,
      type,
      petIds: selectedPets,
      mediaUrls,
      // Thêm các trường khác nếu cần
    };
    const result = await submit(data);
    setPosting(false);
    if (result) {
      message.success('Post created successfully!');
      setContent('');
      setMediaList([]);
      setSelectedPets([]);
      onClose();
    } else if (error) {
      message.error(error);
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
        <Avatar src={user.avatar} size={48} className={styles.avatar} />
        <div className={styles.userInfo}>
          <span className={styles.displayName}>{user.name}</span>
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
          Add Photos/Videos
        </div>
        <div style={{ color: '#9CA3AF', fontSize: 14, marginTop: 4 }}>
          Drag & drop or click to upload
        </div>
      </Upload.Dragger>

      {/* Pet Tags Section */}
      <div className={styles.petSection}>
        <span className={styles.petLabel}>Tag Your Pets:</span>
        <div className={styles.petTagList}>
          {pets.map(pet => (
            <div
              key={pet.id}
              className={`${styles.petTag} ${selectedPets.includes(pet.id) ? styles.selected : ''}`}
              onClick={() => handlePetTag(pet.id)}
            >
              <Avatar src={pet.avatar} size={44} className={styles.petAvatar} />
              <span className={styles.petName}>{pet.name}</span>
            </div>
          ))}
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
