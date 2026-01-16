// Available background images for user customization
export const AVAILABLE_BACKGROUNDS = [
  {
    id: 'default',
    name: 'Default',
    thumbnail: null,
    path: null,
  },
  {
    id: 'bg-1',
    name: 'Soft Gradient',
    thumbnail: '/background/6.jpg',
    path: '/background/6.jpg',
  },
  {
    id: 'bg-2',
    name: 'Pastel Clouds',
    thumbnail: '/background/012375e9-b3bd-4383-87b3-cb07b14ee766.jpg',
    path: '/background/012375e9-b3bd-4383-87b3-cb07b14ee766.jpg',
  },
  {
    id: 'bg-3',
    name: 'Dreamy Sky',
    thumbnail: '/background/a9ca7608-f4c6-4567-84bd-c36a3fe19916.jpg',
    path: '/background/a9ca7608-f4c6-4567-84bd-c36a3fe19916.jpg',
  },
  {
    id: 'bg-4',
    name: 'Purple Gradient',
    thumbnail: '/background/Gradient_builder_2.avif',
    path: '/background/Gradient_builder_2.avif',
  },
  {
    id: 'bg-5',
    name: 'Ocean Wave',
    thumbnail: '/background/360_F_595736900_mS56oAm9N7IaFDwBPKsRIMIlwPDETSYa.jpg',
    path: '/background/360_F_595736900_mS56oAm9N7IaFDwBPKsRIMIlwPDETSYa.jpg',
  },
  {
    id: 'bg-6',
    name: 'Sunset Glow',
    thumbnail: '/background/360_F_266975387_CVK7jWI9dSoL4owOzrw9wSElynS7bgRe.jpg',
    path: '/background/360_F_266975387_CVK7jWI9dSoL4owOzrw9wSElynS7bgRe.jpg',
  },
  {
    id: 'bg-7',
    name: 'Abstract Art',
    thumbnail: '/background/3293c8139d836a5b0307aefc8c74955984ffda39-3240x2160.avif',
    path: '/background/3293c8139d836a5b0307aefc8c74955984ffda39-3240x2160.avif',
  },
] as const;

export type BackgroundId = typeof AVAILABLE_BACKGROUNDS[number]['id'];

export interface BackgroundPreference {
  feedBackground: BackgroundId;
  profileBackground: BackgroundId;
}

