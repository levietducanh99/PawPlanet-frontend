# Media Upload Service Documentation

## Overview

The Media Service handles file uploads to Cloudinary using a signed upload approach. This ensures secure uploads with proper folder organization and access control.

## Architecture

The service follows the PawPlanet architecture rules:

```
┌─────────────────────────────────────────────────────────┐
│                     UI Components                        │
│              (AvatarUpload, ImageGallery)               │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                   useMediaUpload Hook                    │
│              (manages state & lifecycle)                 │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                  media.service.ts                        │
│     (uploadMedia, uploadUserAvatar, etc.)               │
└─────────┬──────────────────────────────┬────────────────┘
          │                              │
          │ Step 1: Sign                 │ Step 2: Upload
          ▼                              ▼
┌──────────────────────┐      ┌──────────────────────────┐
│  Backend API         │      │   Cloudinary API         │
│  /api/v1/media/sign  │      │  Direct Upload           │
└──────────────────────┘      └──────────────────────────┘
```

## Files Structure

```
src/
├── domain/
│   └── media.ts                    # Domain models (types)
├── services/
│   └── media.service.ts            # Service layer
├── hooks/
│   └── useMediaUpload.ts           # React hook
└── components/
    └── AvatarUpload/
        └── AvatarUpload.tsx        # Example component
```

## Usage Examples

### 1. Upload User Avatar

```typescript
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { Button, message } from 'antd';

function ProfilePage() {
  const { upload, uploading } = useMediaUpload({
    onSuccess: (result) => {
      message.success('Avatar updated!');
      console.log('New avatar URL:', result.secureUrl);
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      upload(file, 'USER_AVATAR', currentUserId);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} accept="image/*" />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
```

### 2. Upload Pet Gallery Images

```typescript
import { useMediaUpload } from '@/hooks/useMediaUpload';

function PetGallery({ petId }: { petId: number }) {
  const { upload, uploading, progress } = useMediaUpload({
    onSuccess: (result) => {
      // Add to gallery
      addImageToGallery(result.secureUrl);
    }
  });

  const handleUpload = (file: File) => {
    upload(file, 'PET_GALLERY', petId);
  };

  return (
    <Upload
      beforeUpload={(file) => {
        handleUpload(file);
        return false; // Prevent default upload
      }}
    >
      <Button loading={uploading}>
        Upload Gallery Image {uploading && `${progress?.percentage}%`}
      </Button>
    </Upload>
  );
}
```

### 3. Upload Encyclopedia Image

```typescript
import { useMediaUpload } from '@/hooks/useMediaUpload';

function EncyclopediaEditor({ breedSlug }: { breedSlug: string }) {
  const { upload, uploading } = useMediaUpload();

  const handleImageUpload = async (file: File) => {
    await upload(file, 'ENCYCLOPEDIA_BREED', breedSlug);
  };

  return (
    <Upload beforeUpload={(file) => { 
      handleImageUpload(file); 
      return false; 
    }}>
      <Button loading={uploading}>Upload Breed Image</Button>
    </Upload>
  );
}
```

### 4. Direct Service Usage (Advanced)

```typescript
import { uploadMedia, uploadUserAvatar } from '@/services/media.service';

// Option 1: Use helper function
const result = await uploadUserAvatar(file, userId, (progress) => {
  console.log(`Uploaded: ${progress.percentage}%`);
});

// Option 2: Use generic uploadMedia
const result = await uploadMedia(
  file,
  { context: 'POST_MEDIA', ownerId: postId },
  (progress) => {
    console.log(`Progress: ${progress.loaded} / ${progress.total}`);
  }
);

console.log('Uploaded to:', result.secureUrl);
```

## Media Contexts

| Context | Required Params | Use Case | Example |
|---------|----------------|----------|---------|
| `USER_AVATAR` | `ownerId` (userId) | User profile picture | Avatar upload |
| `PET_AVATAR` | `ownerId` (petId) | Pet profile picture | Pet avatar |
| `PET_GALLERY` | `ownerId` (petId) | Pet gallery images | Multiple pet photos |
| `POST_MEDIA` | `ownerId` (postId) | Social post media | Post images/videos |
| `ENCYCLOPEDIA_BREED` | `slug` | Encyclopedia images | Breed documentation |

## API Response Structure

### Sign Response

```typescript
{
  signature: string;        // Cloudinary signature
  timestamp: number;        // Upload timestamp
  apiKey: string;          // Cloudinary API key
  cloudName: string;       // Cloudinary cloud name
  assetFolder: string;     // Target folder (MUST use this)
  publicId?: string;       // Optional public ID (MUST use if provided)
  resourceType: string;    // 'image' or 'video'
}
```

### Upload Result

```typescript
{
  publicId: string;        // Cloudinary public ID
  version: number;         // Asset version
  width: number;           // Image width
  height: number;          // Image height
  format: string;          // File format (jpg, png, etc.)
  bytes: number;           // File size in bytes
  url: string;             // Public URL
  secureUrl: string;       // HTTPS URL (use this)
  // ... other Cloudinary metadata
}
```

## Best Practices

### ✅ DO

- Always use the `secureUrl` from the upload result
- Validate file size and type before upload
- Show progress indicator during upload
- Handle errors gracefully with user feedback
- Use the provided `assetFolder` from sign response
- Use `publicId` if provided by backend

### ❌ DON'T

- Don't modify the `assetFolder` or `publicId` from backend
- Don't skip validation (file type, size)
- Don't expose Cloudinary credentials in frontend
- Don't upload without getting signature first
- Don't import from `services/api/.openapi-generator/` in UI components

## Error Handling

```typescript
const { upload, error } = useMediaUpload({
  onError: (error) => {
    // Log to error tracking service
    console.error('Upload failed:', error);
    
    // Show user-friendly message
    if (error.message.includes('network')) {
      message.error('Network error. Please check your connection.');
    } else if (error.message.includes('timeout')) {
      message.error('Upload timed out. Please try again.');
    } else {
      message.error('Upload failed. Please try again.');
    }
  }
});

// Or check error state
if (error) {
  return <Alert type="error" message={error.message} />;
}
```

## File Validation

```typescript
const validateFile = (file: File): boolean => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    message.error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
    return false;
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    message.error('File too large. Maximum size is 5MB.');
    return false;
  }

  return true;
};

// Use in component
const beforeUpload = (file: File) => {
  if (!validateFile(file)) {
    return false;
  }
  upload(file, 'USER_AVATAR', userId);
  return false; // Prevent default upload
};
```

## TypeScript Types

All types are available from `@/domain/media`:

```typescript
import type {
  MediaContext,
  SignMediaRequest,
  SignMediaResponse,
  CloudinaryUploadResponse,
  UploadProgress,
} from '@/domain/media';
```

## Testing

### Unit Test Example

```typescript
import { describe, it, expect, vi } from 'vitest';
import { uploadMedia } from '@/services/media.service';

describe('Media Service', () => {
  it('should upload file successfully', async () => {
    const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    
    const result = await uploadMedia(mockFile, {
      context: 'USER_AVATAR',
      ownerId: 123,
    });

    expect(result.secureUrl).toBeDefined();
    expect(result.format).toBe('jpg');
  });
});
```

## Integration with Forms

### Ant Design Form Integration

```typescript
import { Form, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useMediaUpload } from '@/hooks/useMediaUpload';

function ProfileForm() {
  const [form] = Form.useForm();
  const { upload } = useMediaUpload({
    onSuccess: (result) => {
      form.setFieldsValue({ avatarUrl: result.secureUrl });
    }
  });

  return (
    <Form form={form}>
      <Form.Item name="avatarUrl" label="Avatar">
        <Upload
          beforeUpload={(file) => {
            upload(file, 'USER_AVATAR', currentUserId);
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>
    </Form>
  );
}
```

## Troubleshooting

### Issue: Upload fails with signature error
**Solution**: Ensure you're passing the correct `ownerId` or `slug` based on context.

### Issue: File uploads but wrong folder
**Solution**: Never modify `assetFolder` from backend response. Use it as-is.

### Issue: Progress not updating
**Solution**: The progress callback is currently a placeholder. For real progress, implement XMLHttpRequest with progress events.

### Issue: TypeScript errors in mapper
**Solution**: This is expected when backend changes. Update the mapper file to match new backend structure.

## Future Enhancements

- [ ] Add real upload progress tracking with XMLHttpRequest
- [ ] Support batch uploads
- [ ] Add image compression before upload
- [ ] Implement retry logic for failed uploads
- [ ] Add upload queue management
- [ ] Support drag-and-drop
- [ ] Add image cropping before upload

