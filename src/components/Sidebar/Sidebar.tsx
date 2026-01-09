import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import styles from './Sidebar.module.css';
import { useUserPets } from '@/hooks/useUserPets';

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
];

export const Sidebar: React.FC<SidebarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const { pets, loading: petsLoading, error: petsError } = useUserPets();

 const { pets = [], loading: petsLoading, error: petsError } = useUserPets();

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const handleAddPet = () => {
    navigate('/create-pet');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Notifications count - this would come from a notifications API
  const notificationCount = 3;

  console.log(pets);

  return (
    <aside className={styles.sidebar}>
      {/* Banner Image */}

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

      {/* List Pet Section */}
      <div className={styles.myPetsSection}>
        <div className={styles.myPetsHeader}>
          <span className={styles.petIcon}>🐾</span>
          <span className={styles.myPetsTitle}>List Pet</span>
          <span className={styles.petCount}>({pets?.length || 0})</span>
        </div>

        {petsLoading ? (
          <div className={styles.petsLoading}>
            <span className={styles.loadingText}>Loading pets...</span>
          </div>
        ) : petsError ? (
          <div className={styles.petsError}>
            <span className={styles.errorText}>Failed to load pets</span>
            <button onClick={() => window.location.reload()} style={{fontSize: '12px', padding: '4px 8px', margin: '4px 0'}}>
              Retry
            </button>
          </div>
        ) : pets.length === 0 ? (
          <div className={styles.noPets}>
            <span className={styles.noPetsIcon}>🏠</span>
            <span className={styles.noPetsText}>No pets yet</span>
            <span className={styles.noPetsSubtext}>Add your first furry friend!</span>
          </div>
        ) : (
          <div className={styles.petsList}>
            {pets.map((pet) => (
              <div key={pet.id} className={styles.petItem} onClick={() => navigate(`/pet/${pet.id}`)}>
                <div className={styles.petAvatar}>
                  {pet.avatar ? (
                    <img src={pet.avatar} alt={pet.name} />
                  ) : (
                    <div className={styles.petAvatarPlaceholder}>
                      {pet.name ? pet.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                </div>
                <div className={styles.petInfo}>
                  <div className={styles.petName}>{pet.name}</div>
                  <div className={styles.petSpecies}>{pet.speciesName || 'Pet'}</div>
                </div>
                <span className={styles.petEmoji}>
                  {pet.speciesName?.toLowerCase().includes('cat') ? '🐱' :
                   pet.speciesName?.toLowerCase().includes('dog') ? '🐕' :
                   pet.speciesName?.toLowerCase().includes('bird') || pet.speciesName?.toLowerCase().includes('eagle') ? '🦅' : '🐾'}
                </span>
              </div>
            ))}
          </div>
        )}

        <button className={styles.addPetButton} onClick={handleAddPet}>
          <PlusOutlined className={styles.plusIcon} />
          <span>Add Pet</span>
        </button>
      </div>
    </aside>
  );
};
