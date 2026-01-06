import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  Upload,
  Space,
  Avatar,
  Tag,
  Divider,
  message
} from 'antd';
import {
  PlusOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { motion } from 'motion/react';
import type { UploadFile } from 'antd';
import styles from './CreatePostModal.module.css';

const { TextArea } = Input;
const { Option } = Select;

interface CreatePostModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (postData: {
    content: string;
    type: 'general' | 'adoption' | 'lost' | 'found' | 'story';
    petIds?: number[];
    mediaUrls?: string[];
    location?: string;
    contactInfo?: string;
    tags?: string[];
  }) => Promise<void>;
  currentUserAvatar?: string;
  currentUserName?: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  currentUserAvatar,
  currentUserName = "You"
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [postType, setPostType] = useState<'general' | 'adoption' | 'lost' | 'found' | 'story'>('general');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState('');

  const mockPets = [
    { id: 1, name: 'Maxi', avatar: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=50&h=50&fit=crop' },
    { id: 2, name: 'Luna', avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=50&h=50&fit=crop' },
    { id: 3, name: 'Bella', avatar: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=50&h=50&fit=crop' }
  ];

  const postTypeOptions = [
    { value: 'general', label: 'General Post', color: '#6B7280' },
    { value: 'story', label: 'Pet Story', color: '#1890FF' },
    { value: 'adoption', label: 'For Adoption', color: '#F2994A' },
    { value: 'lost', label: 'Lost Pet', color: '#EB5757' },
    { value: 'found', label: 'Found Pet', color: '#27AE60' }
  ];

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const mediaUrls = fileList.map(file => file.url || file.response?.url).filter(Boolean);

      await onSubmit({
        content: values.content,
        type: postType,
        petIds: values.petIds,
        mediaUrls,
        location: values.location,
        contactInfo: values.contactInfo,
        tags: tags
      });

      // Reset form
      form.resetFields();
      setFileList([]);
      setTags([]);
      setPostType('general');
      message.success('Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      message.error('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const customRequest = ({ onSuccess }: any) => {
    // Mock upload - in real app, upload to Cloudinary
    setTimeout(() => {
      onSuccess({
        url: `https://images.unsplash.com/photo-1${Math.random().toString().slice(2, 15)}?w=400&h=300&fit=crop`
      });
    }, 1000);
  };

  const addTag = () => {
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag]);
      setInputTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const uploadButton = (
    <div className={styles.uploadButton}>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const needsContactInfo = postType === 'lost' || postType === 'found' || postType === 'adoption';

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
      className={styles.createPostModal}
      destroyOnClose
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 500 }}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Create a new Post</h2>
        </div>

        <div className={styles.postTypeSelector}>
          <Space wrap>
            {postTypeOptions.map((option) => (
              <Tag
                key={option.value}
                className={`${styles.typeTag} ${postType === option.value ? styles.typeTagActive : ''}`}
                onClick={() => setPostType(option.value as any)}
                style={{
                  borderColor: postType === option.value ? option.color : '#D1D5DB',
                  backgroundColor: postType === option.value ? option.color : 'transparent',
                  color: postType === option.value ? '#fff' : option.color
                }}
              >
                {option.label}
              </Tag>
            ))}
          </Space>
        </div>

        <Form form={form} layout="vertical" className={styles.postForm}>
          {/* User info */}
          <div className={styles.userInfo}>
            <Avatar
              src={currentUserAvatar}
              size={48}
              style={{ border: '2px solid #E6F7FF' }}
            />
            <div className={styles.userDetails}>
              <div className={styles.userName}>{currentUserName}</div>
              <div className={styles.postVisibility}>Public post</div>
            </div>
          </div>

          {/* Content */}
          <Form.Item
            name="content"
            rules={[{ required: true, message: 'Please write something!' }]}
          >
            <TextArea
              placeholder={
                postType === 'lost' ? "Describe your lost pet and when/where you last saw them..." :
                postType === 'found' ? "Describe the pet you found and where you found them..." :
                postType === 'adoption' ? "Tell us about the pet looking for a home..." :
                "What's on your mind?"
              }
              autoSize={{ minRows: 4, maxRows: 8 }}
              className={styles.contentInput}
            />
          </Form.Item>

          {/* Pet selection */}
          <Form.Item name="petIds" label="Tag your pets (optional)">
            <Select
              mode="multiple"
              placeholder="Select your pets"
              style={{ width: '100%' }}
            >
              {mockPets.map(pet => (
                <Option key={pet.id} value={pet.id}>
                  <Space>
                    <Avatar src={pet.avatar} size={24} />
                    {pet.name}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Media upload */}
          <div className={styles.mediaSection}>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              customRequest={customRequest}
              multiple
              accept="image/*,video/*"
              className={styles.uploader}
            >
              {fileList.length >= 4 ? null : uploadButton}
            </Upload>
          </div>

          {/* Location */}
          <Form.Item name="location">
            <Input
              placeholder="Add location (optional)"
              prefix={<EnvironmentOutlined style={{ color: '#1890FF' }} />}
              className={styles.locationInput}
            />
          </Form.Item>

          {/* Contact info for special post types */}
          {needsContactInfo && (
            <Form.Item
              name="contactInfo"
              rules={[{ required: true, message: 'Contact information is required for this post type' }]}
            >
              <Input
                placeholder="Contact phone number or email"
                prefix={<PhoneOutlined style={{ color: '#1890FF' }} />}
                className={styles.contactInput}
              />
            </Form.Item>
          )}

          {/* Tags */}
          <div className={styles.tagsSection}>
            <div className={styles.tagsInput}>
              <Input
                placeholder="Add tags (press Enter)"
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
                onPressEnter={addTag}
                suffix={
                  <Button
                    type="text"
                    size="small"
                    onClick={addTag}
                    disabled={!inputTag}
                  >
                    Add
                  </Button>
                }
              />
            </div>

            {tags.length > 0 && (
              <div className={styles.tagsList}>
                {tags.map((tag) => (
                  <Tag
                    key={tag}
                    closable
                    closeIcon={<CloseOutlined />}
                    onClose={() => removeTag(tag)}
                    className={styles.tag}
                  >
                    #{tag}
                  </Tag>
                ))}
              </div>
            )}
          </div>

          <Divider className={styles.formDivider} />

          {/* Actions */}
          <div className={styles.modalActions}>
            <Button onClick={onCancel} className={styles.cancelButton}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              className={styles.submitButton}
            >
              Share Post
            </Button>
          </div>
        </Form>
      </motion.div>
    </Modal>
  );
};

export default CreatePostModal;
