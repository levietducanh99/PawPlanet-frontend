import React, { useEffect } from 'react';
import { Alert, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ExploreGrid } from './components/ExploreGrid';
import { useExploreFeed } from './hooks/useExploreFeed';
import styles from './ExplorePage.module.css';


export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const { items, loading, error, hasMore, loadMore} = useExploreFeed(30);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
      console.warn('⚠️ No auth token found, redirecting to login');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className={styles.explorePage}>


      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          className={styles.alert}
        />
      )}

      {!loading && items.length === 0 && !error && (
        <Empty
          description="No content to explore yet"
          className={styles.empty}
        />
      )}

      {(items.length > 0 || loading) && (
        <ExploreGrid
          items={items}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      )}
    </div>
  );
};

