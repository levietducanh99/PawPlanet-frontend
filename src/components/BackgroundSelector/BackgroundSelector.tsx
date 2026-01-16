import React, { useState, useCallback, useMemo } from 'react';
import { Modal, Button, Radio, message } from 'antd';
import { BgColorsOutlined, CheckCircleFilled } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { AVAILABLE_BACKGROUNDS, type BackgroundId } from '@/constants/backgrounds';
import { useBackground } from '@/context/BackgroundContext';
import styles from './BackgroundSelector.module.css';

interface BackgroundSelectorProps {
  mode: 'feed' | 'profile';
  trigger?: React.ReactNode;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  mode,
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const { feedBackground, profileBackground, setFeedBackground, setProfileBackground } = useBackground();
  const [selectedBg, setSelectedBg] = useState<BackgroundId>(
    mode === 'feed' ? feedBackground : profileBackground
  );
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  const currentBackground = mode === 'feed' ? feedBackground : profileBackground;

  const handleOpen = useCallback(() => {
    setSelectedBg(currentBackground);
    setOpen(true);
  }, [currentBackground]);

  const handleSave = useCallback(() => {
    if (mode === 'feed') {
      setFeedBackground(selectedBg);
      message.success('Feed background updated!');
    } else {
      setProfileBackground(selectedBg);
      message.success('Profile background updated!');
    }
    setOpen(false);
  }, [mode, selectedBg, setFeedBackground, setProfileBackground]);

  const handleCancel = useCallback(() => {
    setSelectedBg(currentBackground);
    setOpen(false);
  }, [currentBackground]);

  const handleImageLoad = useCallback((bgId: string) => {
    setImagesLoaded(prev => ({ ...prev, [bgId]: true }));
  }, []);

  // Memoize modal content để tránh re-render không cần thiết
  const modalContent = useMemo(() => (
    <div className={styles.backgroundGrid}>
      {AVAILABLE_BACKGROUNDS.map((bg) => {
        const isSelected = selectedBg === bg.id;
        const isLoaded = imagesLoaded[bg.id] || !bg.path;

        return (
          <div
            key={bg.id}
            className={`${styles.backgroundCard} ${isSelected ? styles.selected : ''}`}
            onClick={() => setSelectedBg(bg.id)}
          >
            <div className={styles.previewWrapper}>
              {bg.path ? (
                <>
                  {/* Loading placeholder */}
                  {!isLoaded && (
                    <div className={styles.imagePlaceholder}>
                      <span>Loading...</span>
                    </div>
                  )}
                  <img
                    src={bg.path}
                    alt={bg.name}
                    className={`${styles.previewImage} ${isLoaded ? styles.loaded : ''}`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(bg.id)}
                    style={{ opacity: isLoaded ? 1 : 0 }}
                  />
                </>
              ) : (
                <div className={styles.defaultPreview}>
                  <span>Default</span>
                </div>
              )}

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    className={styles.selectedOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <CheckCircleFilled className={styles.checkIcon} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className={styles.backgroundName}>
              <Radio checked={isSelected} />
              <span>{bg.name}</span>
            </div>
          </div>
        );
      })}
    </div>
  ), [selectedBg, imagesLoaded, handleImageLoad]);

  return (
    <>
      {trigger ? (
        <div onClick={handleOpen}>{trigger}</div>
      ) : (
        <Button
          icon={<BgColorsOutlined />}
          onClick={handleOpen}
          type="default"
          className={styles.triggerButton}
        >
          Change Background
        </Button>
      )}

      <Modal
        title={
          <div className={styles.modalTitle}>
            <BgColorsOutlined className={styles.titleIcon} />
            <span>Choose {mode === 'feed' ? 'Feed' : 'Profile'} Background</span>
          </div>
        }
        open={open}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Apply Background
          </Button>,
        ]}
        width={720}
        centered
        className={styles.modal}
        destroyOnClose={false}
        maskClosable={true}
        transitionName="" // Disable default transition for better performance
        maskTransitionName="" // Disable mask transition
      >
        {modalContent}

        <div className={styles.hint}>
          <BgColorsOutlined />
          <span>Select a background to customize your {mode === 'feed' ? 'news feed' : 'profile page'}</span>
        </div>
      </Modal>
    </>
  );
};

