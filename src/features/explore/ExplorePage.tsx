import React, { useEffect } from 'react';
import { Typography, Alert, Button, Empty } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ExploreGrid } from './components/ExploreGrid';
import { useExploreFeed } from './hooks/useExploreFeed';
import styles from './ExplorePage.module.css';

const { Title } = Typography;

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const { items, loading, error, hasMore, loadMore, refresh } = useExploreFeed(30);

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
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Title level={2} className={styles.title}>
            Explore
          </Title>
          <p className={styles.subtitle}>
            Discover amazing pets, posts, and pet lovers from around the world
          </p>
        </div>

        <Button
          icon={<ReloadOutlined />}
          onClick={refresh}
          loading={loading && items.length === 0}
          className={styles.refreshButton}
        >
          Refresh
        </Button>
      </div>

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

