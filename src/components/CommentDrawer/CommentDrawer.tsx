import React, { useMemo, useState } from 'react';
import { Modal, Avatar, Button, Input, List, Typography, Space, Spin } from 'antd';
import { CloseOutlined, HeartOutlined, SendOutlined } from '@ant-design/icons';
import {usePostComments, useUserProfile} from '@/hooks';
import styles from './CommentDrawer.module.css';

const { Text } = Typography;

interface CommentModalProps {
  postId: number | null;
  open: boolean;
  onClose: (updatedCommentCount?: number) => void;
  onCommentAdded?: (newCount: number) => void;
  title?: string;
}

export const CommentModal: React.FC<CommentModalProps> = ({ postId, open, onClose, title, onCommentAdded }) => {
  const { comments, loading, creating, addComment, refetch } = usePostComments(postId);
  const { user } = useUserProfile();
  const [value, setValue] = useState('');

  const commentCount = useMemo(() => comments?.length ?? 0, [comments]);

  const handleSend = async () => {
    if (!value.trim() || !postId) return;
    try {
      const newComment = await addComment(value.trim());
      setValue('');
      // Notify parent immediately so UI (feed) can update comment count optimistically
      const newCount = (comments?.length ?? 0) + (newComment ? 1 : 0);
      if (onCommentAdded) onCommentAdded(newCount);
      // Refresh internal list to include server-sent data
      refetch();
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleClose = () => {
    // Pass the current comment count back to parent
    onClose(commentCount);
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={700}
      closeIcon={<CloseOutlined />}
      bodyStyle={{ padding: 0, borderRadius: 16, overflow: 'hidden', background: '#fff' }}
      className={styles.modal}
      destroyOnClose
    >
      <div className={styles.header}>
        <div>
          <div className={styles.title}>{title || 'Comments'}</div>
          <div className={styles.subtitle}>{commentCount} comment{commentCount !== 1 ? 's' : ''}</div>
        </div>
      </div>
      <div className={styles.content} style={{ minHeight: 220 }}>
        {loading ? (
          <div className={styles.loadingCenter}><Spin /></div>
        ) : (
          <List
            dataSource={comments}
            renderItem={(c) => (
              <List.Item className={styles.commentItem}>
                <List.Item.Meta
                  avatar={<Avatar src={c.userAvatar} />}
                  title={<div className={styles.commentTitle}><Text strong>{c.userName}</Text></div>}
                  description={<div className={styles.commentBody}>{c.content}</div>}
                />
                <div className={styles.commentMeta}>
                  <Space size="small">
                    <Text type="secondary">{ /* time */ }</Text>
                    <Space size={8}>
                      <HeartOutlined style={{ color: '#EB5757' }} />
                      <Text type="secondary">{c.likeCount ?? 0}</Text>
                    </Space>
                  </Space>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>
      <div className={styles.inputBar}>
        <Avatar src={user?.avatarUrl} />
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 4 }}
          placeholder="Write a comment..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onPressEnter={() => {}}
          className={styles.textarea}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={creating}
          disabled={!value.trim()}
        />
      </div>
    </Modal>
  );
};

export default CommentModal;
