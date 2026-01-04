import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Input, Slider, DatePicker } from 'antd';
import {
  ArrowLeftOutlined,
  ManOutlined,
  WomanOutlined,
  UserOutlined,
  CameraOutlined,
} from '@ant-design/icons';
import { Sidebar, StepIndicator, ProgressBar, WizardActions } from '../../components';
import styles from './CreatePetPage.module.css';
import dayjs, { Dayjs } from 'dayjs';

interface PetFormData {
  petType: 'dog' | 'cat' | 'bird' | 'other' | null;
  breed: string;
  name: string;
  photo: string | null;
  dateOfBirth: Dayjs | null;
  gender: 'male' | 'female' | null;
  weight: number;
  height: number;
  color: string[];
}

const TOTAL_STEPS = 7;

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
};

export const CreatePetPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PetFormData>({
    petType: null,
    breed: '',
    name: '',
    photo: null,
    dateOfBirth: null,
    gender: null,
    weight: 22.2,
    height: 45.0,
    color: [],
  });

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = <K extends keyof PetFormData>(field: K, value: PetFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getStepTitle = () => {
    const titles: Record<number, { title: string; subtitle: string }> = {
      1: { title: 'Add Pet Profile', subtitle: 'Type' },
      2: { title: 'Add Pet Profile', subtitle: 'Breed' },
      3: { title: 'Add Pet Profile', subtitle: 'Name' },
      4: { title: 'Add Pet Profile', subtitle: 'Photo' },
      5: { title: 'Add Pet Profile', subtitle: 'Date of Birth' },
      6: { title: 'Add Pet Profile', subtitle: 'Gender' },
      7: { title: 'Add Pet Profile', subtitle: 'Weight' },
    };
    return titles[currentStep];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PetTypeStep value={formData.petType} onChange={(v) => updateFormData('petType', v)} />;
      case 2:
        return <BreedStep value={formData.breed} onChange={(v) => updateFormData('breed', v)} />;
      case 3:
        return <NameStep value={formData.name} onChange={(v) => updateFormData('name', v)} />;
      case 4:
        return <PhotoStep value={formData.photo} onChange={(v) => updateFormData('photo', v)} />;
      case 5:
        return <DateOfBirthStep value={formData.dateOfBirth} onChange={(v) => updateFormData('dateOfBirth', v)} />;
      case 6:
        return <GenderStep value={formData.gender} onChange={(v) => updateFormData('gender', v)} />;
      case 7:
        return <WeightStep weight={formData.weight} height={formData.height} onWeightChange={(v) => updateFormData('weight', v)} onHeightChange={(v) => updateFormData('height', v)} />;
      default:
        return <PetTypeStep value={formData.petType} onChange={(v) => updateFormData('petType', v)} />;
    }
  };

  const stepInfo = getStepTitle();
  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className={styles.pageContainer}>
      {/* Sidebar */}
      <Sidebar userName="Esther" userGreeting="Hello," />

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

const PetTypeStep: React.FC<StepProps<'dog' | 'cat' | 'bird' | 'other' | null>> = ({ value, onChange }) => {
  const petTypes = [
    { id: 'dog' as const, label: 'Dog', icon: '🐕' },
    { id: 'cat' as const, label: 'Cat', icon: '🐱' },
    { id: 'bird' as const, label: 'Bird', icon: '🐦' },
    { id: 'other' as const, label: 'Other', icon: '🐾' },
  ];

  return (
    <div className={styles.avatarSection}>
      <div className={styles.avatarUpload}>
        <UserOutlined style={{ fontSize: 48, color: '#D1D5DB' }} />
      </div>
      <h3 className={styles.questionText}>What type of pet do you have?</h3>
      <p className={styles.hintText}>Choose the category that best describes your pet</p>
      <div className={styles.genderOptions} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 520 }}>
        {petTypes.map((type) => (
          <motion.div
            key={type.id}
            className={`${styles.genderOption} ${value === type.id ? styles.genderOptionSelected : ''}`}
            onClick={() => onChange(type.id)}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            style={{ width: '100%' }}
          >
            <div style={{ fontSize: 36 }}>{type.icon}</div>
            <span className={styles.genderLabel}>{type.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const BreedStep: React.FC<StepProps<string>> = ({ value, onChange }) => {
  return (
    <div className={styles.avatarSection}>
      <div className={styles.avatarUpload}>
        <UserOutlined style={{ fontSize: 48, color: '#D1D5DB' }} />
      </div>
      <h3 className={styles.questionText}>What's your pet's breed?</h3>
      <p className={styles.hintText}>Let us know what kind of dog your pet is</p>
      <Input
        placeholder="Search by animal species"
        size="large"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.inputField}
        style={{ borderRadius: 12, height: 48 }}
      />
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

const WeightStep: React.FC<{
  weight: number;
  height: number;
  onWeightChange: (value: number) => void;
  onHeightChange: (value: number) => void;
}> = ({ weight, height, onWeightChange, onHeightChange }) => {
  return (
    <div className={styles.weightSection}>
      <h3 className={styles.questionText}>What's your pet's weight and height?</h3>
      <p className={styles.hintText}>Adjust the sliders or enter values directly</p>

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
    </div>
  );
};

