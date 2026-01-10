import React, { useEffect, useState } from 'react';
import { Popover, Avatar, Spin, Empty, Button } from 'antd';
import { getAllLikes } from '@/services/like.service';

interface LikesPopoverProps {
  postId: number | null;
  children: React.ReactNode;
  onViewAll?: (postId: number) => void; // call to open original LikesModal if needed
}

export const LikesPopover: React.FC<LikesPopoverProps> = ({ postId, children, onViewAll }) => {
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState<Array<{ userId: number; username: string; avatarUrl?: string }>>([]);

  useEffect(() => {
    let mounted = true;
    if (!postId) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAllLikes(postId);
        if (mounted) setLikes(data);
      } catch (err) {
        console.error('Failed to load likes for popover:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [postId]);

  const content = (
    <div style={{ minWidth: 200 }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 12 }}><Spin /></div>
      ) : likes.length === 0 ? (
        <Empty description="No likes yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {likes.slice(0, 3).map(l => (
              <Avatar key={l.userId} src={l.avatarUrl} />
            ))}
            <div style={{ marginLeft: 8 }}>
              <div style={{ fontWeight: 600 }}>{likes.length} {likes.length === 1 ? 'like' : 'likes'}</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>{likes.slice(0,3).map(l => l.username).join(', ')}{likes.length > 3 ? ' ...' : ''}</div>
            </div>
          </div>

          {likes.length > 3 && (
            <div style={{ textAlign: 'right' }}>
              <Button type="link" onClick={() => onViewAll && postId && onViewAll(postId)}>View all</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Popover content={content} trigger="hover">
      {children}
    </Popover>
  );
};

export default LikesPopover;

