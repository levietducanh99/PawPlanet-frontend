import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Card,
  Button,
  Form,
  message,
  Typography,
  Row,
  Col
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Loading, ErrorMessage } from '../../components';
import { PetPhotoUpload } from '../../components/PetPhotoUpload';
import { PetBasicForm } from '../../components/PetBasicForm';
import { PetImportantDates } from '../../components/PetImportantDates';
import { PetProfileSettings } from '../../components/PetProfileSettings';
import { usePetDetail, useUpdatePet } from '../../hooks';
import { uploadMediaForPet } from '../../services/media.service';
import styles from './EditPetPage.module.css';
import { pageVariants } from '../../animations/variants';

const { Title } = Typography;

export const EditPetPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const petId = parseInt(id || '0');

  const { pet: profile, pageLoading: profileLoading, error } = usePetDetail(petId);
  const { updatePetData, loading: updating, error: updateError } = useUpdatePet();

  const [basicForm] = Form.useForm();
  const [datesForm] = Form.useForm();
  const [settingsForm] = Form.useForm();

  const [saving, setSaving] = useState(false);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);

  const isSubmitting = saving || updating;

  // Set initial form values when profile loads
  useEffect(() => {
    if (profile) {
      // Basic info - using domain Pet fields
      basicForm.setFieldsValue({
        petName: profile.name,
        species: profile.speciesName || '',
        breed: profile.breedName || '',
        gender: profile.gender,
        weight: profile.weight,
        height: profile.height,
      });

      // Dates - Convert string dates to dayjs objects with robust parsing
      const parseDateSafely = (dateString: string | undefined) => {
        if (!dateString) return undefined;

        // Try multiple common date formats
        const formats = ['DD MMMM YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY'];

        for (const format of formats) {
          const parsed = dayjs(dateString, format);
          if (parsed.isValid()) {
            return parsed;
          }
        }

        // If all specific formats fail, try default parsing
        const defaultParsed = dayjs(dateString);
        return defaultParsed.isValid() ? defaultParsed : undefined;
      };

      const dateValues = {
        birthDate: parseDateSafely(profile.birthDate),
        // Other date fields not available in Pet domain model
        adoptionDate: undefined,
        microchipDate: undefined,
        vaccinationDate: undefined,
      };

      datesForm.setFieldsValue(dateValues);

      // Settings - map from Pet domain to form values
      settingsForm.setFieldsValue({
        profileVisibility: profile.status === 'Public',
        lookingForAdoption: profile.status === 'For Adoption',
      });
    }
  }, [profile, basicForm, datesForm, settingsForm]);

  const handleAvatarChange = (file: File | null) => {
    console.log('🖼️ Avatar changed:', file?.name);
    setNewAvatarFile(file);
  };

  const handleSettingsChange = (field: string, value: boolean) => {
    console.log(`Settings changed: ${field} = ${value}`);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validate all forms
      const [basicValues, datesValues, settingsValues] = await Promise.all([
        basicForm.validateFields(),
        datesForm.validateFields(),
        settingsForm.validateFields(),
      ]);

      let avatarUploadSuccess = false;

      // Step 1: Upload new avatar if changed (using uploadMediaForPet with role='avatar')
      if (newAvatarFile) {
        console.log('🖼️ EditPet: Uploading new avatar...');
        console.log('📁 Avatar file:', newAvatarFile.name, 'Type:', newAvatarFile.type, 'Size:', newAvatarFile.size);
        console.log('🐾 Pet ID:', petId);

        try {
          // This will: 1) Upload to Cloudinary (PET_AVATAR context)
          //            2) Update pet via PUT /api/v1/pets/{id} with avatarPublicId
          const uploadResult = await uploadMediaForPet(petId, newAvatarFile, 'avatar');
          console.log('✅ Avatar uploaded and linked successfully:', uploadResult);
          avatarUploadSuccess = true;
          message.success('Avatar uploaded successfully! 📸');
        } catch (uploadError) {
          console.error('❌ Avatar upload failed:', uploadError);
          message.error('Failed to upload avatar. Continuing with other updates...');
          // Continue with update even if avatar upload fails
        }
      }

      // Step 2: Prepare update data for other pet profile fields
      const updateData = {
        name: basicValues.petName,
        gender: basicValues.gender,
        birthDate: datesValues.birthDate ? datesValues.birthDate.format('YYYY-MM-DD') : undefined,
        description: profile?.description || '', // Keep existing description since we removed appearance form
        status: settingsValues.profileVisibility ? 'PUBLIC' : 'HIDDEN',
        weight: basicValues.weight ? parseFloat(basicValues.weight) : undefined,
        height: basicValues.height ? parseFloat(basicValues.height) : undefined,
        // Note: Avatar is handled separately via uploadMediaForPet above
        // It updates avatarPublicId through PUT /api/v1/pets/{id}
      };

      console.log('🔄 Pet data to update:', updateData);

      // Step 3: Call API to update pet profile (other fields)
      const success = await updatePetData(petId, updateData);

      if (success) {
        const successMessage = avatarUploadSuccess
          ? 'Pet profile and avatar updated successfully! 🎉'
          : 'Pet profile updated successfully! 🎉';
        message.success(successMessage);
        navigate(`/pet/${petId}`);
      } else {
        message.error(updateError || 'Failed to update pet profile');
      }

    } catch (error) {
      console.error('❌ Validation or update failed:', error);
      message.error('Please check all required fields');
    } finally {
      setSaving(false);
      console.log('🏁 EditPet: Save process finished');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (profileLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!profile) {
    return <ErrorMessage message="Pet not found" />;
  }

  return (
    <motion.div
      className={styles.pageContainer}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className={styles.contentWrapper}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
              <Button
                icon={<ArrowLeftOutlined />}
                type="text"
                onClick={handleCancel}
                className={styles.backButton}
              >
                Back
              </Button>

              <Title level={2} className={styles.pageTitle}>
                Edit Pet Profile
              </Title>

              <Typography.Paragraph className={styles.pageSubtitle}>
                Update your pet's information and keep their profile current.
              </Typography.Paragraph>
            </div>

            {/* Main Form Content */}
            <Row gutter={[32, 32]}>
              <Col xs={24}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card bordered={false} className={styles.formCard}>
                    {/* Pet Photo Section */}
                    <div className={styles.photoSection}>
                      <Title level={4} className={styles.sectionTitle}>
                        Pet Photo
                      </Title>
                      <PetPhotoUpload
                        currentPhoto={profile?.avatarUrl}
                        onPhotoChange={handleAvatarChange}
                      />
                    </div>

                    {/* Basic Information */}
                    <PetBasicForm
                      form={basicForm}
                    />

                    {/* Important Dates */}
                    <PetImportantDates
                      form={datesForm}
                    />


                    {/* Profile Settings */}
                    <PetProfileSettings
                      form={settingsForm}
                      onChange={handleSettingsChange}
                    />

                    {/* Action Buttons at Bottom */}
                    <div className={styles.bottomActions}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={styles.actionButtonsContainer}
                      >
                        <div className={styles.actionButtons}>
                          <Button
                            size="large"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className={styles.cancelButton}
                          >
                            Cancel
                          </Button>

                          <Button
                            type="primary"
                            size="large"
                            loading={isSubmitting}
                            onClick={handleSave}
                            className={styles.saveButton}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </div>
    </motion.div>
  );
};
