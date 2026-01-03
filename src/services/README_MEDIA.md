# Media Service

Service layer for handling file uploads to Cloudinary with signed uploads.

## Files

- **media.service.ts** - Main service implementation
- **apiConfig.ts** - API client configuration

## Key Functions

### `uploadMedia(file, request)`
Main upload function that handles the complete flow:
1. Gets signature from backend
2. Uploads file to Cloudinary
3. Returns Cloudinary response

### Helper Functions

- `uploadUserAvatar(file, userId)` - Upload user avatar
- `uploadPetAvatar(file, petId)` - Upload pet avatar
- `uploadPetGallery(file, petId)` - Upload pet gallery image
- `uploadPostMedia(file, postId)` - Upload post media
- `uploadEncyclopediaBreed(file, slug)` - Upload encyclopedia image

## Usage

```typescript
import { uploadMedia } from '@/services/media.service';

const result = await uploadMedia(file, {
  context: 'USER_AVATAR',
  ownerId: 123
});

console.log('Uploaded URL:', result.secureUrl);
```

## Architecture Compliance

✅ This service follows PawPlanet architecture rules:

- **Backend-agnostic**: UI doesn't know about backend DTOs
- **Domain models**: Uses types from `@/domain/media`
- **Single responsibility**: Only handles media upload logic
- **Type-safe**: Full TypeScript support

## Documentation

See `docs/MEDIA_SERVICE.md` for complete documentation.

