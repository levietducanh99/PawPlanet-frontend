import React from 'react';
import styles from './PillTabs.module.css';

export interface TabItem {
  key: string;
  label: string;
}

interface PillTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (key: string) => void;
  sticky?: boolean;
}

export const PillTabs: React.FC<PillTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  sticky = false,
}) => {
  return (
    <div className={`${styles.tabNavigation} ${sticky ? styles.sticky : ''}`}>
      <div className={styles.tabContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
