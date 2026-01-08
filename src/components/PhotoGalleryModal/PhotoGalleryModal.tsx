import React from 'react';
import { Modal, Image, Typography, Empty, Row, Col, Tag } from 'antd';
import { CrownOutlined } from '@ant-design/icons';
import { PetMedia } from '@/domain/pet';

const { Text } = Typography;

interface PhotoGalleryModalProps {
  visible: boolean;
  onClose: () => void;
  petName: string;
  media: PetMedia[];
}

export const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({
  visible,
  onClose,
  petName,
  media
}) => {
  if (!media || media.length === 0) {
    return (
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        width={800}
        title={`${petName}'s Photo Gallery`}
        centered
      >
        <Empty description="No photos available" />
      </Modal>
    );
  }

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      title={`${petName}'s Photo Gallery (${media.length} photos)`}
      centered
      bodyStyle={{ padding: '24px' }}
    >
      <Row gutter={[16, 16]}>
        {media.map((item, index) => (
          <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
            <div style={{ position: 'relative' }}>
              {/* Check if it's a video */}
              {item.type?.toLowerCase() === 'video' || item.url?.includes('.mp4') || item.url?.includes('.mov') ? (
                <video
                  src={item.url}
                  controls
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    backgroundColor: '#000'
                  }}
                />
              ) : (
                <Image
                  src={item.url}
                  alt={`${petName} photo ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  preview={{
                    mask: 'View',
                  }}
                />
              )}

              {/* Tags below image */}
              <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                {item.role === 'avatar' && (
                  <Tag color="gold" icon={<CrownOutlined />}>
                    Avatar
                  </Tag>
                )}
                {item.role === 'primary' && (
                  <Tag color="blue">
                    Primary
                  </Tag>
                )}
                <Text
                  type="secondary"
                  style={{
                    fontSize: '12px'
                  }}
                >
                  Photo {index + 1}
                </Text>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

