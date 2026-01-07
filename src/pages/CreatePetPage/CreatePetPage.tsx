import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Input, Slider, DatePicker, Select, message } from 'antd';
import {
  ArrowLeftOutlined,
  ManOutlined,
  WomanOutlined,
  UserOutlined,
  CameraOutlined,
} from '@ant-design/icons';
import { StepIndicator, ProgressBar, WizardActions } from '../../components';
import { useCreatePetWorkflow } from '../../hooks';
import { mapSpeciesToOptions, mapBreedsToOptions, mapCreatePetRequestToData } from '../../mappers/pet.mapper';
import { CreatePetRequest } from '../../domain/pet';
import styles from './CreatePetPage.module.css';
import dayjs, { Dayjs } from 'dayjs';

interface PetFormData {
  speciesId: number | null;
  breedId: number | null;
  name: string;
  photo: string | null;
  dateOfBirth: Dayjs | null;
  gender: 'male' | 'female' | null;
  weight: number;
  height: number;
  description: string;
}

const TOTAL_STEPS = 7;

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
};

export const CreatePetPage: React.FC = () => {
  const navigate = useNavigate();

  // API integration hooks
  const {
    // Create Pet
    isCreating,
    createError,
    createPet,
    // Species
    species,
    isLoadingSpecies,
    speciesError,
    loadSpecies,
    // Breeds
    breeds,
    isLoadingBreeds,
    breedsError,
    loadBreeds,
    clearBreeds,
    // Note: clearAllErrors available but not used in this component
  } = useCreatePetWorkflow();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PetFormData>({
    speciesId: null,
    breedId: null,
    name: '',
    photo: null,
    dateOfBirth: null,
    gender: null,
    weight: 22.2,
    height: 45.0,
    description: '',
  });

  // Load species on component mount
  useEffect(() => {
    loadSpecies();
  }, []);

  // Load breeds when species changes
  useEffect(() => {
    if (formData.speciesId) {
      loadBreeds(formData.speciesId);
    } else {
      clearBreeds();
    }
  }, [formData.speciesId]);

  // Show error messages
  useEffect(() => {
    if (createError) {
      message.error(createError);
    }
    if (speciesError) {
      message.error(speciesError);
    }
    if (breedsError) {
      message.error(breedsError);
    }
  }, [createError, speciesError, breedsError]);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step - submit the form
      handleSubmit();
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/my-pets'); // Navigate back to pets page
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        message.error('Pet name is required');
        return;
      }

      if (!formData.speciesId) {
        message.error('Please select a species');
        return;
      }

      // Create the pet request
      const createRequest: CreatePetRequest = {
        name: formData.name.trim(),
        speciesId: formData.speciesId,
        breedId: formData.breedId || undefined,
        birthDate: formData.dateOfBirth?.format('YYYY-MM-DD'),
        gender: formData.gender || undefined,
        description: formData.description.trim() || undefined,
        weight: formData.weight > 0 ? formData.weight : undefined,
        height: formData.height > 0 ? formData.height : undefined,
      };

      // Convert to service data format
      const petData = mapCreatePetRequestToData(createRequest);

      // Create the pet
      const newPet = await createPet(petData);

      if (newPet) {
        message.success(`${formData.name} has been created successfully!`);
        navigate('/my-pets'); // Redirect to pets list
      }
    } catch (error) {
      console.error('Failed to create pet:', error);
      // Error message is handled by useEffect
    }
  };

  const updateFormData = <K extends keyof PetFormData>(field: K, value: PetFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getStepTitle = () => {
    const titles: Record<number, { title: string; subtitle: string }> = {
      1: { title: 'Add Pet Profile', subtitle: 'Species' },
      2: { title: 'Add Pet Profile', subtitle: 'Breed' },
      3: { title: 'Add Pet Profile', subtitle: 'Name' },
      4: { title: 'Add Pet Profile', subtitle: 'Photo' },
      5: { title: 'Add Pet Profile', subtitle: 'Date of Birth' },
      6: { title: 'Add Pet Profile', subtitle: 'Gender' },
      7: { title: 'Add Pet Profile', subtitle: 'Physical Details' },
    };
    return titles[currentStep];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <SpeciesStep
            value={formData.speciesId}
            onChange={(v) => updateFormData('speciesId', v)}
            species={species}
            loading={isLoadingSpecies}
          />
        );
      case 2:
        return (
          <BreedStep
            value={formData.breedId}
            onChange={(v) => updateFormData('breedId', v)}
            breeds={breeds}
            loading={isLoadingBreeds}
            disabled={!formData.speciesId}
          />
        );
      case 3:
        return <NameStep value={formData.name} onChange={(v) => updateFormData('name', v)} />;
      case 4:
        return <PhotoStep value={formData.photo} onChange={(v) => updateFormData('photo', v)} />;
      case 5:
        return <DateOfBirthStep value={formData.dateOfBirth} onChange={(v) => updateFormData('dateOfBirth', v)} />;
      case 6:
        return <GenderStep value={formData.gender} onChange={(v) => updateFormData('gender', v)} />;
      case 7:
        return (
          <PhysicalDetailsStep
            weight={formData.weight}
            height={formData.height}
            description={formData.description}
            onWeightChange={(v) => updateFormData('weight', v)}
            onHeightChange={(v) => updateFormData('height', v)}
            onDescriptionChange={(v) => updateFormData('description', v)}
          />
        );
      default:
        return (
          <SpeciesStep
            value={formData.speciesId}
            onChange={(v) => updateFormData('speciesId', v)}
            species={species}
            loading={isLoadingSpecies}
          />
        );
    }
  };

  const stepInfo = getStepTitle();
  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className={styles.pageContainer}>
      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.formCard}>
          <button className={styles.backButton} onClick={handleBack}>
            <ArrowLeftOutlined />
          </button>

          <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>{stepInfo.title}</h1>
            <p className={styles.formSubtitle}>{stepInfo.subtitle}</p>
            <ProgressBar progress={progress} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.formContent}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          <WizardActions
            onSkip={handleSkip}
            onConfirm={handleNext}
            isLastStep={currentStep === TOTAL_STEPS}
            confirmLabel={currentStep === TOTAL_STEPS ? (isCreating ? 'Creating...' : 'Create Pet') : 'Next'}
            skipLabel={currentStep === TOTAL_STEPS ? 'Create without details' : 'Skip for now'}
          />
        </div>
      </main>
    </div>
  );
};

// Step Components

interface StepProps<T> {
  value: T;
  onChange: (value: T) => void;
}

const SpeciesStep: React.FC<{
  value: number | null;
  onChange: (value: number) => void;
  species: any[];
  loading: boolean;
}> = ({ value, onChange, species, loading }) => {
  const speciesOptions = mapSpeciesToOptions(species);

  return (
    <div className={styles.avatarSection}>
      <div className={styles.avatarUpload}>
        <UserOutlined style={{ fontSize: 48, color: '#D1D5DB' }} />
      </div>
      <h3 className={styles.questionText}>What type of animal is your pet?</h3>
      <p className={styles.hintText}>Choose the species that best describes your pet</p>

      <Select
        placeholder="Select species"
        size="large"
        value={value}
        onChange={onChange}
        className={styles.inputField}
        style={{ borderRadius: 12, height: 48 }}
        loading={loading}
        showSearch
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={speciesOptions.map(s => ({
          value: s.id,
          label: s.name,
          key: s.id
        }))}
      />

      {speciesOptions.length === 0 && !loading && (
        <p style={{ color: '#999', textAlign: 'center', marginTop: 16 }}>
          No species available. Please try again later.
        </p>
      )}
    </div>
  );
};

const BreedStep: React.FC<{
  value: number | null;
  onChange: (value: number | null) => void;
  breeds: any[];
  loading: boolean;
  disabled: boolean;
}> = ({ value, onChange, breeds, loading, disabled }) => {
  const breedOptions = mapBreedsToOptions(breeds);

  return (
    <div className={styles.avatarSection}>
      <div className={styles.avatarUpload}>
        <UserOutlined style={{ fontSize: 48, color: '#D1D5DB' }} />
      </div>
      <h3 className={styles.questionText}>What's your pet's breed?</h3>
      <p className={styles.hintText}>
        {disabled
          ? 'Please select a species first'
          : 'Choose your pet\'s specific breed (optional)'
        }
      </p>

      <Select
        placeholder={disabled ? "Select species first" : "Select breed (optional)"}
        size="large"
        value={value}
        onChange={onChange}
        className={styles.inputField}
        style={{ borderRadius: 12, height: 48 }}
        loading={loading}
        disabled={disabled}
        allowClear
        showSearch
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={breedOptions.map(b => ({
          value: b.id,
          label: b.name,
          key: b.id
        }))}
      />

      {!disabled && breedOptions.length === 0 && !loading && (
        <p style={{ color: '#999', textAlign: 'center', marginTop: 16 }}>
          No breeds available for selected species.
        </p>
      )}
    </div>
  );
};

const NameStep: React.FC<StepProps<string>> = ({ value, onChange }) => {
  return (
    <div className={styles.avatarSection}>
      <div className={styles.avatarUpload}>
        <UserOutlined style={{ fontSize: 48, color: '#D1D5DB' }} />
      </div>
      <h3 className={styles.questionText}>What's your pet's name?</h3>
      <Input
        placeholder="Your pet's name"
        size="large"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.inputField}
        style={{ borderRadius: 12, height: 48 }}
      />
    </div>
  );
};

const PhotoStep: React.FC<StepProps<string | null>> = ({ value, onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.avatarSection}>
      <h3 className={styles.questionText}>Upload a photo of your pet</h3>
      <p className={styles.hintText}>Choose a clear photo that shows your pet's personality</p>
      <label htmlFor="photo-upload">
        <div className={`${styles.avatarUpload} ${value ? styles.avatarUploadActive : ''}`}>
          {value ? (
            <img src={value} alt="Pet" className={styles.avatarImage} />
          ) : (
            <CameraOutlined style={{ fontSize: 48, color: '#1890FF' }} />
          )}
        </div>
      </label>
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

const DateOfBirthStep: React.FC<StepProps<Dayjs | null>> = ({ value, onChange }) => {
  return (
    <div className={styles.avatarSection}>
      <div className={styles.avatarUpload}>
        <UserOutlined style={{ fontSize: 48, color: '#D1D5DB' }} />
      </div>
      <h3 className={styles.questionText}>When was your pet born?</h3>
      <p className={styles.hintText}>Select your pet's date of birth</p>
      <DatePicker
        value={value}
        onChange={onChange}
        size="large"
        className={styles.inputField}
        style={{ borderRadius: 12, height: 48, width: '100%', maxWidth: 420 }}
        format="DD/MM/YYYY"
        placeholder="Select date of birth"
        disabledDate={(current) => current && current > dayjs().endOf('day')}
      />
    </div>
  );
};

const GenderStep: React.FC<StepProps<'male' | 'female' | null>> = ({ value, onChange }) => {
  return (
    <div className={styles.avatarSection}>
      <h3 className={styles.questionText}>What's your pet's gender?</h3>
      <div className={styles.genderOptions}>
        <motion.div
          className={`${styles.genderOption} ${value === 'male' ? styles.genderOptionSelected : ''}`}
          onClick={() => onChange('male')}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <ManOutlined className={styles.genderIcon} />
          <span className={styles.genderLabel}>Male</span>
        </motion.div>
        <motion.div
          className={`${styles.genderOption} ${value === 'female' ? styles.genderOptionSelected : ''}`}
          onClick={() => onChange('female')}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <WomanOutlined className={styles.genderIcon} />
          <span className={styles.genderLabel}>Female</span>
        </motion.div>
      </div>
    </div>
  );
};

const PhysicalDetailsStep: React.FC<{
  weight: number;
  height: number;
  description: string;
  onWeightChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onDescriptionChange: (value: string) => void;
}> = ({ weight, height, description, onWeightChange, onHeightChange, onDescriptionChange }) => {
  return (
    <div className={styles.weightSection}>
      <h3 className={styles.questionText}>Physical Details & Description</h3>
      <p className={styles.hintText}>Add your pet's measurements and a brief description</p>

      <div className={styles.measurementGrid}>
        {/* Weight Section */}
        <div className={styles.measurementItem}>
          <div className={styles.measurementLabel}>Weight</div>
          <div className={styles.weightDisplay}>{weight.toFixed(1)} kg</div>
          <div className={styles.weightSlider}>
            <Slider
              min={0}
              max={100}
              step={0.1}
              value={weight}
              onChange={onWeightChange}
              tooltip={{ formatter: (val) => `${val} kg` }}
            />
          </div>
          <div className={styles.weightInputGroup}>
            <Input
              type="number"
              value={weight}
              onChange={(e) => onWeightChange(parseFloat(e.target.value) || 0)}
              className={styles.weightInput}
              size="large"
              style={{ borderRadius: 12 }}
            />
            <span>kg</span>
          </div>
        </div>

        {/* Height Section */}
        <div className={styles.measurementItem}>
          <div className={styles.measurementLabel}>Height</div>
          <div className={styles.weightDisplay}>{height.toFixed(1)} cm</div>
          <div className={styles.weightSlider}>
            <Slider
              min={0}
              max={150}
              step={0.1}
              value={height}
              onChange={onHeightChange}
              tooltip={{ formatter: (val) => `${val} cm` }}
            />
          </div>
          <div className={styles.weightInputGroup}>
            <Input
              type="number"
              value={height}
              onChange={(e) => onHeightChange(parseFloat(e.target.value) || 0)}
              className={styles.weightInput}
              size="large"
              style={{ borderRadius: 12 }}
            />
            <span>cm</span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <div className={styles.measurementLabel} style={{ marginBottom: 16 }}>Description (Optional)</div>
        <Input.TextArea
          placeholder="Tell us about your pet's personality, habits, or special traits..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
          maxLength={500}
          showCount
          style={{
            borderRadius: 12,
            maxWidth: 600,
            margin: '0 auto',
            display: 'block'
          }}
        />
      </div>
    </div>
  );
};

