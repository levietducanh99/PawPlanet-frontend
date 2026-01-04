import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusOutlined, HomeOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import styles from './Sidebar.module.css';

interface Pet {
  id: number;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'other';
  avatarUrl?: string;
}

interface SidebarProps {
  pets?: Pet[];
  notificationCount?: number;
  bannerImage?: string; // URL ảnh banner do user tùy chỉnh
}

const menuItems = [
  {
    id: 'news-feed',
    label: 'News Feed',
    icon: '🐾',
    path: '/',
    emoji: '🦴'
  },
  {
    id: 'explore',
    label: 'Explore',
    icon: '🔍',
    path: '/explore'
  },
  {
    id: 'encyclopedia',
    label: 'Encyclopedia',
    icon: '📚',
    path: '/encyclopedia'
  },
  {
    id: 'care-support',
    label: 'Care & Support',
    icon: '❤️',
    path: '/care-support',
    hasBadge: true
  },
  {
    id: 'my-pets-menu',
    label: 'My Pets',
    icon: '🐾',
    path: '/my-pets'
  },
];

const getPetEmoji = (type: string) => {
  const emojiMap: Record<string, string> = {
    dog: '🐕',
    cat: '🐱',
    bird: '🐦',
    other: '🐾'
  };
  return emojiMap[type] || '🐾';
};

export const Sidebar: React.FC<SidebarProps> = ({
  pets = [],
  notificationCount = 3,
  bannerImage
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const handleAddPet = () => {
    navigate('/create-pet');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className={styles.sidebar}>
      {/* Banner Image */}
      {bannerImage && (
        <div className={styles.bannerContainer}>
          <img src={bannerImage} alt="Banner" className={styles.bannerImage} />
        </div>
      )}

      {/* Menu Items */}
      <nav className={styles.menu}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.menuItem} ${isActive(item.path) ? styles.menuItemActive : ''}`}
            onClick={() => handleMenuClick(item.path)}
          >
            <div className={styles.menuIcon}>
              <span className={styles.iconEmoji}>{item.icon}</span>
              {item.emoji && (
                <span className={styles.iconEmojiSmall}>{item.emoji}</span>
              )}
            </div>
            <span className={styles.menuLabel}>{item.label}</span>
            {item.hasBadge && notificationCount > 0 && (
              <Badge count={notificationCount} className={styles.badge} />
            )}
          </div>
        ))}
      </nav>

      {/* My Pets Section */}
      {pets.length > 0 && (
        <div className={styles.myPetsSection}>
          <div className={styles.myPetsHeader}>
            <HomeOutlined className={styles.homeIcon} />
            <span className={styles.myPetsTitle}>My Pets</span>
          </div>

          <div className={styles.petsList}>
            {pets.map((pet) => (
              <div key={pet.id} className={styles.petItem}>
                <div className={styles.petAvatar}>
                  {pet.avatarUrl ? (
                    <img src={pet.avatarUrl} alt={pet.name} />
                  ) : (
                    <div className={styles.petAvatarPlaceholder}>
                      {pet.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className={styles.petInfo}>
                  <div className={styles.petName}>{pet.name}</div>
                  <div className={styles.petType}>{pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}</div>
                </div>
                <span className={styles.petEmoji}>{getPetEmoji(pet.type)}</span>
              </div>
            ))}
          </div>

          <button className={styles.addPetButton} onClick={handleAddPet}>
            <PlusOutlined className={styles.plusIcon} />
            <span>Add Pet</span>
          </button>
        </div>
      )}
    </aside>
  );
};

