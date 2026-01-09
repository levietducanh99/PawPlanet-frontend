import React, { useEffect, useRef } from 'react';
import { ExploreItemUnion } from '@/domain/explore';
import { ExplorePostCard } from './ExplorePostCard';
import { ExplorePetCard } from './ExplorePetCard';
import { ExploreUserCard } from './ExploreUserCard';
import { ExploreSkeletonCard } from './ExploreSkeletonCard';
import styles from './ExploreGrid.module.css';

interface ExploreGridProps {
  items: ExploreItemUnion[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export const ExploreGrid: React.FC<ExploreGridProps> = ({
  items,
  loading,
  hasMore,
  onLoadMore,
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, onLoadMore]);

  const renderCard = (item: ExploreItemUnion, index: number) => {
    const key = `${item.type}-${item.data.id}-${index}`;

    switch (item.type) {
      case 'post':
        return <ExplorePostCard key={key} item={item} />;
      case 'pet':
        return <ExplorePetCard key={key} item={item} />;
      case 'user':
        return <ExploreUserCard key={key} item={item} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.gridContainer}>
      {/* CSS Grid Masonry Layout */}
      <div className={styles.masonryGrid}>
        {items.map((item, index) => renderCard(item, index))}

        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <ExploreSkeletonCard key={`skeleton-${i}`} />
          ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className={styles.loadMoreTrigger} />
    </div>
  );
};

