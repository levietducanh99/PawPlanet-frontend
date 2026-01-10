/**
 * GlobalSearchInput - Search component with dropdown results for users and pets
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Input, Spin, Empty } from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { motion, AnimatePresence } from 'motion/react';
import styles from './GlobalSearchInput.module.css';

export const GlobalSearchInput: React.FC<{ onSearch?: (value: string) => void }> = ({ onSearch }) => {
  const navigate = useNavigate();
  const { loading, results, search, clearResults } = useGlobalSearch();
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value.length < 2) {
      clearResults();
      setShowDropdown(false);
      return;
    }

    // Debounce search
    timeoutRef.current = setTimeout(() => {
      search(value);
      if (onSearch) onSearch(value);
      setShowDropdown(true);
    }, 300);
  }, [search, clearResults, onSearch]);

  const handleUserClick = (userId: number) => {
    // Navigate to user profile route
    navigate(`/user/${userId}`);
    setShowDropdown(false);
    setQuery('');
    clearResults();
  };

  const handlePetClick = (petId: number) => {
    // Navigate to pet route
    navigate(`/pet/${petId}`);
    setShowDropdown(false);
    setQuery('');
    clearResults();
  };

  const hasResults = results.users.length > 0 || results.pets.length > 0;

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <Input
        className={styles.searchInput}
        prefix={<SearchOutlined className={styles.searchIcon} />}
        placeholder="Search for pets, users..."
        size="large"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => query.length >= 2 && setShowDropdown(true)}
        suffix={loading ? <Spin size="small" /> : null}
      />

      <AnimatePresence>
        {showDropdown && query.length >= 2 && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {loading && (
              <div className={styles.loadingContainer}>
                <Spin size="small" />
                <span className={styles.loadingText}>Searching...</span>
              </div>
            )}

            {!loading && !hasResults && (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No results found"
                className={styles.empty}
              />
            )}

            {!loading && hasResults && (
              <>
                {/* Users Section */}
                {results.users.length > 0 && (
                  <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                      <UserOutlined /> Users
                    </div>
                    {results.users.map((user) => (
                      <motion.div
                        key={user.id}
                        className={styles.resultItem}
                        onClick={() => handleUserClick(user.id)}
                        whileHover={{ backgroundColor: '#f5f5f5' }}
                      >
                        <div className={styles.avatar}>
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.username} />
                          ) : (
                            <div className={styles.avatarPlaceholder}>
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className={styles.info}>
                          <div className={styles.name}>{user.username}</div>
                          {user.fullName && (
                            <div className={styles.subtitle}>{user.fullName}</div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Pets Section */}
                {results.pets.length > 0 && (
                  <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                      🐾 Pets
                    </div>
                    {results.pets.map((pet) => (
                      <motion.div
                        key={pet.id}
                        className={styles.resultItem}
                        onClick={() => handlePetClick(pet.id)}
                        whileHover={{ backgroundColor: '#f5f5f5' }}
                      >
                        <div className={styles.avatar}>
                          {pet.avatarUrl ? (
                            <img src={pet.avatarUrl} alt={pet.name} />
                          ) : (
                            <div className={styles.avatarPlaceholder}>
                              🐾
                            </div>
                          )}
                        </div>
                        <div className={styles.info}>
                          <div className={styles.name}>{pet.name}</div>
                          <div className={styles.subtitle}>
                            {pet.species || 'Pet'}
                            {pet.breed && ` • ${pet.breed}`}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
