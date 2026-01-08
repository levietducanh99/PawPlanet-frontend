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
import { PetAppearanceForm } from '../../components/PetAppearanceForm';
import { PetProfileSettings } from '../../components/PetProfileSettings';
import { usePetDetail, useUpdatePet } from '../../hooks';
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
  const [appearanceForm] = Form.useForm();
  const [settingsForm] = Form.useForm();

  const [saving, setSaving] = useState(false);

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

      // Appearance
      appearanceForm.setFieldsValue({
        appearance: '', // Color not in Pet domain
        additionalNotes: profile.description || '',
      });

      // Settings - map from Pet domain to form values
      settingsForm.setFieldsValue({
        profileVisibility: profile.status === 'Public',
        lookingForAdoption: profile.status === 'For Adoption',
      });
    }
  }, [profile, basicForm, datesForm, appearanceForm, settingsForm]);

  const handleSettingsChange = (field: string, value: boolean) => {
    console.log(`Settings changed: ${field} = ${value}`);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validate all forms
      const [basicValues, datesValues, appearanceValues, settingsValues] = await Promise.all([
        basicForm.validateFields(),
        datesForm.validateFields(),
        appearanceForm.validateFields(),
        settingsForm.validateFields(),
      ]);

      // Prepare update data for API
      const updateData = {
        name: basicValues.petName,
        gender: basicValues.gender,
        birthDate: datesValues.birthDate ? datesValues.birthDate.format('YYYY-MM-DD') : undefined,
        description: appearanceValues.additionalNotes,
        status: settingsValues.profileVisibility ? 'PUBLIC' : 'HIDDEN',
        weight: basicValues.weight ? parseFloat(basicValues.weight) : undefined,
        height: basicValues.height ? parseFloat(basicValues.height) : undefined,
        // Note: Species and breed updates might require separate API calls
        // or be handled differently based on backend design
      };

      console.log('🔄 Pet data to update:', updateData);

      // Call API to update pet
      const success = await updatePetData(petId, updateData);

      if (success) {
        message.success('Pet profile updated successfully! 🎉');
        navigate(`/pets/${petId}`);
      } else {
        message.error(updateError || 'Failed to update pet profile');
      }

    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Please check all required fields');
    } finally {
      setSaving(false);
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

                    {/* Appearance */}
                    <PetAppearanceForm
                      form={appearanceForm}
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
