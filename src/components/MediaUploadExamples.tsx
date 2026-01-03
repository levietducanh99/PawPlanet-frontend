/**
 * Media Upload Examples
 *
 * This file contains complete examples of using the media upload service
 * in various scenarios following PawPlanet design guidelines.
 */

import React, { useState } from 'react';
import { Upload, Button, message, Progress, Card, Space } from 'antd';
import {
  UploadOutlined,
  PictureOutlined,
  CameraOutlined,
  FileImageOutlined
} from '@ant-design/icons';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { motion } from 'motion/react';

// ============================================================================
// Example 1: Simple Avatar Upload with Preview
// ============================================================================

interface SimpleAvatarUploadProps {
  userId: number;
  currentUrl?: string;
}

export const SimpleAvatarUpload: React.FC<SimpleAvatarUploadProps> = ({
  userId,
  currentUrl,
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(currentUrl);

  const { upload, uploading, progress, error } = useMediaUpload({
    onSuccess: (result) => {
      setAvatarUrl(result.secureUrl);
      message.success('Avatar uploaded successfully!');
    },
    onError: (err) => {
      message.error(`Upload failed: ${err.message}`);
    },
  });

  const handleUpload = (file: File) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      message.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      message.error('Image must be smaller than 5MB');
      return;
    }

    upload(file, 'USER_AVATAR', userId);
  };

  return (
    <div>
      <Upload
        name="avatar"
        showUploadList={false}
        beforeUpload={(file) => {
          handleUpload(file);
          return false; // Prevent default upload
        }}
        disabled={uploading}
      >
        <Button
          icon={<CameraOutlined />}
          loading={uploading}
          size="large"
          style={{ borderRadius: 8 }}
        >
          {uploading ? 'Uploading...' : 'Change Avatar'}
        </Button>
      </Upload>

      {progress && uploading && (
        <Progress percent={Math.round(progress.percentage)} style={{ marginTop: 16 }} />
      )}

      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="Avatar preview"
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            marginTop: 16,
            objectFit: 'cover',
          }}
        />
      )}

      {error && <p style={{ color: '#EB5757', marginTop: 8 }}>{error.message}</p>}
    </div>
  );
};

// ============================================================================
// Example 2: Pet Gallery Upload (Multiple Images)
// ============================================================================

interface PetGalleryUploadProps {
  petId: number;
  onImageAdded?: (url: string) => void;
}

export const PetGalleryUpload: React.FC<PetGalleryUploadProps> = ({
  petId,
  onImageAdded,
}) => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const { upload, uploading, progress } = useMediaUpload({
    onSuccess: (result) => {
      setUploadedUrls((prev) => [...prev, result.secureUrl]);
      onImageAdded?.(result.secureUrl);
      message.success('Image added to gallery!');
    },
  });

  const handleUpload = (file: File) => {
    upload(file, 'PET_GALLERY', petId);
  };

  return (
    <Card
      title="Pet Gallery"
      style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
      bordered={false}
    >
      <Upload
        beforeUpload={(file) => {
          handleUpload(file);
          return false;
        }}
        accept="image/*"
        disabled={uploading}
        showUploadList={false}
      >
        <Button
          type="primary"
          icon={<PictureOutlined />}
          loading={uploading}
          size="large"
          block
          style={{ marginBottom: 16 }}
        >
          Add Photo to Gallery
        </Button>
      </Upload>

      {uploading && progress && (
        <Progress
          percent={Math.round(progress.percentage)}
          status="active"
          style={{ marginBottom: 16 }}
        />
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 12,
        }}
      >
        {uploadedUrls.map((url, index) => (
          <motion.img
            key={url}
            src={url}
            alt={`Gallery ${index + 1}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              width: '100%',
              aspectRatio: '1',
              objectFit: 'cover',
              borderRadius: 12,
            }}
          />
        ))}
      </div>
    </Card>
  );
};

// ============================================================================
// Example 3: Post Media Upload with Preview
// ============================================================================

interface PostMediaUploadProps {
  postId: number;
  onMediaUploaded?: (url: string) => void;
}

export const PostMediaUpload: React.FC<PostMediaUploadProps> = ({
  postId,
  onMediaUploaded,
}) => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  const { upload, uploading, progress, reset } = useMediaUpload({
    onSuccess: (result) => {
      setMediaUrl(result.secureUrl);
      onMediaUploaded?.(result.secureUrl);
      message.success('Media uploaded!');
    },
  });

  const handleRemove = () => {
    setMediaUrl(null);
    reset();
  };

  return (
    <div>
      {!mediaUrl ? (
        <Upload.Dragger
          beforeUpload={(file) => {
            upload(file, 'POST_MEDIA', postId);
            return false;
          }}
          accept="image/*,video/*"
          disabled={uploading}
          showUploadList={false}
          style={{ borderRadius: 12 }}
        >
          <p className="ant-upload-drag-icon">
            <FileImageOutlined style={{ fontSize: 48, color: '#1890FF' }} />
          </p>
          <p className="ant-upload-text">
            Click or drag file to upload
          </p>
          <p className="ant-upload-hint">
            Support for images and videos up to 10MB
          </p>
        </Upload.Dragger>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ position: 'relative' }}
        >
          <img
            src={mediaUrl}
            alt="Post media"
            style={{
              width: '100%',
              maxHeight: 400,
              objectFit: 'cover',
              borderRadius: 16,
            }}
          />
          <Button
            danger
            onClick={handleRemove}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              borderRadius: 8,
            }}
          >
            Remove
          </Button>
        </motion.div>
      )}

      {uploading && progress && (
        <div style={{ marginTop: 16 }}>
          <Progress
            percent={Math.round(progress.percentage)}
            status="active"
          />
          <p style={{ textAlign: 'center', color: '#6B7280', marginTop: 8 }}>
            Uploading... {progress.loaded} / {progress.total} bytes
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Example 4: Encyclopedia Image Upload (Generic for Class/Species/Breed)
// ============================================================================

interface EncyclopediaImageUploadProps {
  context: 'ENCYCLOPEDIA_CLASS' | 'ENCYCLOPEDIA_SPECIES' | 'ENCYCLOPEDIA_BREED';
  slug: string;
  title: string;
  currentImageUrl?: string;
  onImageUpdated?: (url: string) => void;
}

export const EncyclopediaImageUpload: React.FC<EncyclopediaImageUploadProps> = ({
  context,
  slug,
  title,
  currentImageUrl,
  onImageUpdated,
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(currentImageUrl);

  const { upload, uploading } = useMediaUpload({
    onSuccess: (result) => {
      setImageUrl(result.secureUrl);
      onImageUpdated?.(result.secureUrl);
      message.success('Encyclopedia image updated!');
    },
  });

  return (
    <Card
      title={title}
      style={{ borderRadius: 16 }}
      bordered={false}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={slug}
            style={{
              width: '100%',
              maxHeight: 300,
              objectFit: 'cover',
              borderRadius: 12,
            }}
          />
        )}

        <Upload
          beforeUpload={(file) => {
            upload(file, context, slug);
            return false;
          }}
          accept="image/*"
          disabled={uploading}
          showUploadList={false}
        >
          <Button
            type={imageUrl ? 'default' : 'primary'}
            icon={<UploadOutlined />}
            loading={uploading}
            size="large"
            block
          >
            {imageUrl ? 'Replace Image' : 'Upload Image'}
          </Button>
        </Upload>
      </Space>
    </Card>
  );
};

// ============================================================================
// Example 5: Encyclopedia Class Image Upload
// ============================================================================

interface EncyclopediaClassUploadProps {
  classSlug: string;
  currentImageUrl?: string;
  onImageUpdated?: (url: string) => void;
}

export const EncyclopediaClassUpload: React.FC<EncyclopediaClassUploadProps> = ({
  classSlug,
  currentImageUrl,
  onImageUpdated,
}) => {
  return (
    <EncyclopediaImageUpload
      context="ENCYCLOPEDIA_CLASS"
      slug={classSlug}
      title={`Class: ${classSlug}`}
      currentImageUrl={currentImageUrl}
      onImageUpdated={onImageUpdated}
    />
  );
};

// ============================================================================
// Example 6: Encyclopedia Species Image Upload
// ============================================================================

interface EncyclopediaSpeciesUploadProps {
  speciesSlug: string;
  currentImageUrl?: string;
  onImageUpdated?: (url: string) => void;
}

export const EncyclopediaSpeciesUpload: React.FC<EncyclopediaSpeciesUploadProps> = ({
  speciesSlug,
  currentImageUrl,
  onImageUpdated,
}) => {
  return (
    <EncyclopediaImageUpload
      context="ENCYCLOPEDIA_SPECIES"
      slug={speciesSlug}
      title={`Species: ${speciesSlug}`}
      currentImageUrl={currentImageUrl}
      onImageUpdated={onImageUpdated}
    />
  );
};

// ============================================================================
// Example 7: Encyclopedia Breed Image Upload
// ============================================================================

interface EncyclopediaBreedUploadProps {
  breedSlug: string;
  currentImageUrl?: string;
  onImageUpdated?: (url: string) => void;
}

export const EncyclopediaBreedUpload: React.FC<EncyclopediaBreedUploadProps> = ({
  breedSlug,
  currentImageUrl,
  onImageUpdated,
}) => {
  return (
    <EncyclopediaImageUpload
      context="ENCYCLOPEDIA_BREED"
      slug={breedSlug}
      title={`Breed: ${breedSlug}`}
      currentImageUrl={currentImageUrl}
      onImageUpdated={onImageUpdated}
    />
  );
};

// ============================================================================
// Example 8: All-in-One Demo Page
// ============================================================================

export const MediaUploadDemo: React.FC = () => {
  const demoUserId = 123;
  const demoPetId = 456;
  const demoPostId = 789;
  const demoClassSlug = 'mammalia';
  const demoSpeciesSlug = 'canis-lupus';
  const demoBreedSlug = 'golden-retriever';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>
        Media Upload Examples
      </h1>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="User Avatar Upload" bordered={false} style={{ borderRadius: 16 }}>
          <SimpleAvatarUpload userId={demoUserId} />
        </Card>

        <Card title="Pet Gallery Upload" bordered={false} style={{ borderRadius: 16 }}>
          <PetGalleryUpload petId={demoPetId} />
        </Card>

        <Card title="Post Media Upload" bordered={false} style={{ borderRadius: 16 }}>
          <PostMediaUpload postId={demoPostId} />
        </Card>

        <Card title="Encyclopedia - Class Image" bordered={false} style={{ borderRadius: 16 }}>
          <EncyclopediaClassUpload classSlug={demoClassSlug} />
        </Card>

        <Card title="Encyclopedia - Species Image" bordered={false} style={{ borderRadius: 16 }}>
          <EncyclopediaSpeciesUpload speciesSlug={demoSpeciesSlug} />
        </Card>

        <Card title="Encyclopedia - Breed Image" bordered={false} style={{ borderRadius: 16 }}>
          <EncyclopediaBreedUpload breedSlug={demoBreedSlug} />
        </Card>
      </Space>
    </div>
  );
};

export default MediaUploadDemo;

