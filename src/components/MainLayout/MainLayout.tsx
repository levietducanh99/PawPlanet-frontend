import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header/Header';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  onSearch?: (value: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  onSearch,
}) => {
  return (
    <div className={styles.mainLayout}>
      {/* Header - Fixed top, uses useUserProfile hook for user data */}
      <Header onSearch={onSearch} />

      <div className={styles.layoutBody}>
        {/* Sidebar - Below header, fixed left, uses useUserProfile and useUserSidebarPets hooks */}
        <Sidebar />

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          <div className={styles.contentWrapper}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
