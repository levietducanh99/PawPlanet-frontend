import React, { useMemo, useState } from 'react';
import { Modal, Avatar, Button, Input, List, Typography, Spin, Space } from 'antd';
import { CloseOutlined, SendOutlined, HeartOutlined } from '@ant-design/icons';
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
  const [replyingToId, setReplyingToId] = useState<number | null>(null);


  const commentCount = useMemo(() => comments?.length ?? 0, [comments]);

  const handleSend = async () => {
    if (!value.trim() || !postId) return;
    try {
      const newComment = await addComment(value.trim(), replyingToId ?? undefined);
      setValue('');
      // Notify parent immediately so UI (feed) can update comment count optimistically
      const newCount = (comments?.length ?? 0) + (newComment ? 1 : 0);
      if (onCommentAdded) onCommentAdded(newCount);
      // Refresh internal list to include server-sent data
      refetch();
      // Reset reply state
      setReplyingToId(null);
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const startReply = (id: number, name: string) => {
    setReplyingToId(id);
    setValue(`@${name} `);
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
      style={{ top: 20 }}
      className={styles.modal}
    >
      <div className={styles.header}>
        <div>
          <div className={styles.title}>{title || 'Comments'}</div>

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
                    <Button type="link" onClick={() => startReply(c.id, c.userName)}>Reply</Button>
                  </Space>
                </div>

                {/* Nested replies (if any) */}
                {c.replies && c.replies.length > 0 && (
                  <div className={styles.repliesContainer}>
                    {c.replies.map((r) => (
                      <div key={r.id} className={styles.replyItem}>
                        <Avatar src={r.userAvatar} size={20} />
                        <div className={styles.replyContent}>
                          <span className={styles.replyUserName}>{r.userName}</span>
                          <span className={styles.replyText}>{r.content}</span>
                          <Button
                            type="link"
                            size="small"
                            onClick={() => startReply(c.id, r.userName)}
                            className={styles.replyButtonInline}
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
