import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { BackgroundId, BackgroundPreference } from '@/constants/backgrounds';

interface BackgroundContextType {
  feedBackground: BackgroundId;
  profileBackground: BackgroundId;
  setFeedBackground: (bg: BackgroundId) => void;
  setProfileBackground: (bg: BackgroundId) => void;
  resetBackgrounds: () => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

const STORAGE_KEY = 'pawplanet_background_preferences';

const defaultPreferences: BackgroundPreference = {
  feedBackground: 'default',
  profileBackground: 'default',
};

export const BackgroundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<BackgroundPreference>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const setFeedBackground = (bg: BackgroundId) => {
    // Set both feed and profile to the same background
    setPreferences({ feedBackground: bg, profileBackground: bg });
  };

  const setProfileBackground = (bg: BackgroundId) => {
    // Also update both when profile is changed (though UI won't expose this)
    setPreferences({ feedBackground: bg, profileBackground: bg });
  };

  const resetBackgrounds = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <BackgroundContext.Provider
      value={{
        feedBackground: preferences.feedBackground,
        profileBackground: preferences.profileBackground,
        setFeedBackground,
        setProfileBackground,
        resetBackgrounds,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within BackgroundProvider');
  }
  return context;
};

