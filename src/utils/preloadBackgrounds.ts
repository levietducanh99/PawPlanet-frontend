/**
 * Preload background images to improve modal open performance
 */

import { AVAILABLE_BACKGROUNDS } from '@/constants/backgrounds';

let preloaded = false;

export const preloadBackgroundImages = () => {
  if (preloaded) return;

  // Use requestIdleCallback for non-blocking preload
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      preloadImages();
    });
  } else {
    // Fallback to setTimeout for browsers without requestIdleCallback
    setTimeout(() => {
      preloadImages();
    }, 1000);
  }
};

const preloadImages = () => {
  AVAILABLE_BACKGROUNDS.forEach(bg => {
    if (bg.path) {
      const img = new Image();
      img.src = bg.path;
      // Let browser cache the image
    }
  });
  preloaded = true;
};

