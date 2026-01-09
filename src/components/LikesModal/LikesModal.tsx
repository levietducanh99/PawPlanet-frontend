import React, { useEffect, useState } from 'react';
import { Modal, List, Avatar, Spin, Empty } from 'antd';
import { getAllLikes } from '@/services/like.service';

interface LikesModalProps {
  postId: number | null;
  open: boolean;
  onClose: () => void;
}

export const LikesModal: React.FC<LikesModalProps> = ({ postId, open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState<Array<{ userId: number; username: string; avatarUrl?: string }>>([]);

  useEffect(() => {
    if (!open || !postId) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAllLikes(postId);
        if (mounted) setLikes(data);
      } catch (err) {
        console.error('Failed to load likes:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [open, postId]);

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Likes" width={520}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 24 }}><Spin /></div>
      ) : likes.length === 0 ? (
        <Empty description="No likes yet" />
      ) : (
        <List
          dataSource={likes}
          renderItem={(l) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={l.avatarUrl} />}
                title={l.username}
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

export default LikesModal;

