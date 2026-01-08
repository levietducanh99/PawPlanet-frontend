import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusOutlined, HomeOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import { useUserProfile, useUserPets } from '../../hooks';
import styles from './Sidebar.module.css';

interface SidebarProps {
  // No longer accepting props - using hooks for data
}

const menuItems = [
  {
    id: 'news-feed',
    label: 'News Feed',
    icon: '🐾',
    path: '/feed',
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

export const Sidebar: React.FC<SidebarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useUserProfile();
  const { pets, loading: petsLoading } = useUserPets();

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const handleAddPet = () => {
    navigate('/create-pet');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Default banner image - this could come from user profile later
  const bannerImage = user?.avatarUrl || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=400&fit=crop';

  // Notifications count - this would come from a notifications API
  const notificationCount = 3;

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
      {(pets.length > 0 || petsLoading) && (
        <div className={styles.myPetsSection}>
          <div className={styles.myPetsHeader}>
            <HomeOutlined className={styles.homeIcon} />
            <span className={styles.myPetsTitle}>My Pets</span>
          </div>

          {petsLoading ? (
            <div className={styles.petsLoading}>Loading pets...</div>
          ) : (
            <div className={styles.petsList}>
              {pets.map((pet) => (
                <div key={pet.id} className={styles.petItem} onClick={() => navigate(`/pets/${pet.id}`)}>
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
          )}

          <button className={styles.addPetButton} onClick={handleAddPet}>
            <PlusOutlined className={styles.plusIcon} />
            <span>Add Pet</span>
          </button>
        </div>
      )}
    </aside>
  );
};
