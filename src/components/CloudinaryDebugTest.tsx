/**
 * Cloudinary Upload Debug Component
 *
 * Temporary component to test and debug Cloudinary upload issues
 * Use this to isolate upload problems without going through full create-pet flow
 */

import React, { useState } from 'react';
import { Card, Upload, Button, message, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useMediaUpload } from '@/hooks/useMediaUpload';

export const CloudinaryDebugTest: React.FC = () => {
  const [testFile, setTestFile] = useState<File | null>(null);
  const [testPetId] = useState<number>(1); // Mock pet ID for testing

  const { upload, uploading, progress, error, result } = useMediaUpload({
    onSuccess: (response) => {
      console.log('✅ Upload success:', response);
      message.success(`Upload successful! URL: ${response.secureUrl}`);
    },
    onError: (err) => {
      console.error('❌ Upload failed:', err);
      message.error(`Upload failed: ${err.message}`);
    },
    onProgress: (prog) => {
      console.log('📊 Upload progress:', prog);
    }
  });

  const handleFileSelect = (file: File) => {
    console.log('📁 File selected:', file.name, file.size, file.type);
    setTestFile(file);
    return false; // Prevent default upload
  };

  const handleTestUpload = async () => {
    if (!testFile) {
      message.error('Please select a file first');
      return;
    }

    console.log('🚀 Starting upload test...');
    await upload(testFile, 'PET_AVATAR', testPetId);
  };

  return (
    <Card
      title="🔧 Cloudinary Upload Debug Test"
      style={{
        margin: '20px',
        maxWidth: '600px',
        border: '2px solid #ff6b6b',
        borderRadius: '12px'
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <h4>Step 1: Select Test Image</h4>
        <Upload
          beforeUpload={handleFileSelect}
          accept="image/*"
          showUploadList={false}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>
            Select Image File
          </Button>
        </Upload>

        {testFile && (
          <div style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0', borderRadius: '8px' }}>
            <strong>Selected file:</strong> {testFile.name}<br/>
            <strong>Size:</strong> {(testFile.size / 1024 / 1024).toFixed(2)} MB<br/>
            <strong>Type:</strong> {testFile.type}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Step 2: Test Upload</h4>
        <Button
          type="primary"
          onClick={handleTestUpload}
          loading={uploading}
          disabled={!testFile}
          style={{ marginRight: '10px' }}
        >
          {uploading ? 'Uploading...' : 'Test Cloudinary Upload'}
        </Button>

        <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
          Context: PET_AVATAR | Owner ID: {testPetId}
        </div>
      </div>

      {uploading && progress && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Upload Progress</h4>
          <Progress percent={Math.round(progress.percentage)} />
        </div>
      )}

      {error && (
        <div style={{ marginBottom: '20px', padding: '10px', background: '#fee', borderRadius: '8px' }}>
          <h4 style={{ color: '#c00' }}>❌ Error</h4>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>{error.message}</pre>
        </div>
      )}

      {result && (
        <div style={{ marginBottom: '20px', padding: '10px', background: '#efe', borderRadius: '8px' }}>
          <h4 style={{ color: '#080' }}>✅ Success</h4>
          <div><strong>URL:</strong> <a href={result.secureUrl} target="_blank" rel="noreferrer">{result.secureUrl}</a></div>
          <div><strong>Public ID:</strong> {result.publicId}</div>
          <div><strong>Size:</strong> {result.width} x {result.height}</div>

          <div style={{ marginTop: '10px' }}>
            <img
              src={result.secureUrl}
              alt="Uploaded"
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                borderRadius: '8px',
                border: '2px solid #ddd'
              }}
            />
          </div>
        </div>
      )}

      <div style={{ fontSize: '12px', color: '#888', borderTop: '1px solid #eee', paddingTop: '10px' }}>
        <strong>Debug Instructions:</strong>
        <ol>
          <li>Open browser DevTools → Console</li>
          <li>Select an image file</li>
          <li>Click "Test Cloudinary Upload"</li>
          <li>Check console logs for detailed debug info</li>
          <li>Look for 🔵 Backend sign request/response</li>
          <li>Look for 🔴 Cloudinary error details</li>
        </ol>
      </div>
    </Card>
  );
};
