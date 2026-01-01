# PawPlanet Frontend - GitHub Copilot Instructions

## Project Overview
PawPlanet là một ứng dụng web về thú cưng và động vật. Frontend được xây dựng với React, TypeScript, Ant Design v5+, và Motion for React.

## Tech Stack
- **Framework**: React 18+ với TypeScript
- **UI Library**: Ant Design v5+
- **Animation**: Motion for React (Framer Motion)
- **Styling**: CSS Modules/SCSS
- **Build Tool**: Vite

---

## Design Principles

### 1. Friendly & Trustworthy
- Sử dụng bo góc tròn `borderRadius >= 12px`
- Màu sắc tươi sáng nhưng dịu mắt
- Tránh các góc cạnh sắc nhọn

### 2. Clean & Airy
- Ưu tiên whitespace (khoảng trắng)
- Thay thế borders bằng shadows mềm mại
- Sử dụng `boxShadow` để tạo chiều sâu thay vì border cứng

### 3. Content-First
- Hình ảnh động vật và thông tin quan trọng được làm nổi bật
- Typography rõ ràng, dễ đọc

---

## Color Palette

### Primary Colors
```tsx
const colors = {
  primary: '#1890FF',        // Brand Blue - Button chính, Icon active
  primaryHover: '#40A9FF',   // Hover state
  primaryBg: '#E6F7FF',      // Background nhạt cho selected state
}
```

### Secondary & Accents
```tsx
const accentColors = {
  warning: '#F2994A',   // Tag "For Adoption", Rating Stars
  success: '#27AE60',   // Tag "Public", Success notifications
  error: '#EB5757',     // Tag "Venomous", Delete buttons
  infoPastel: '#E3F2FD', // Background cho info cards
}
```

### Neutrals
```tsx
const neutrals = {
  textPrimary: '#1F2937',    // Tiêu đề chính
  textSecondary: '#6B7280',  // Subtitle, placeholder
  border: '#E5E7EB',         // Borders, dividers
  bgBody: '#F3F4F6',         // Background tổng thể
  bgWhite: '#FFFFFF',        // Cards, Modal, Input
}
```

---

## Typography

**Font Family**: Inter (primary), Nunito (fallback), sans-serif

### Size & Weight Guidelines
```tsx
// Heading 1 - Tiêu đề trang chính
fontSize: '32px', fontWeight: 700, lineHeight: 1.3

// Heading 2 - Tiêu đề Section
fontSize: '24px', fontWeight: 600, lineHeight: 1.3

// Heading 3 - Tên Card, tên User
fontSize: '18px', fontWeight: 600, lineHeight: 1.4

// Body - Nội dung chính
fontSize: '16px', fontWeight: 400, lineHeight: 1.5

// Small - Metadata, Labels
fontSize: '14px', fontWeight: 400/500, lineHeight: 1.5
```

---

## Ant Design Theme Configuration

**IMPORTANT**: Luôn sử dụng ConfigProvider với theme sau:

```tsx
// src/theme/antdConfig.ts
export const theme = {
  token: {
    colorPrimary: '#1890FF',
    fontFamily: 'Inter, sans-serif',
    borderRadius: 12,
    colorBgLayout: '#F3F4F6',
    colorTextHeading: '#1F2937',
    fontSize: 16,
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 44,
      fontWeight: 600,
      contentFontSize: 16,
      boxShadow: '0 2px 5px rgba(24, 144, 255, 0.2)',
    },
    Input: {
      controlHeight: 48,
      borderRadius: 12,
      colorBgContainer: '#FFFFFF',
      activeBorderColor: '#1890FF',
    },
    Card: {
      borderRadius: 16,
      boxShadowTertiary: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    Modal: {
      borderRadiusLG: 20,
    },
    Tag: {
      borderRadius: 20, // Pill shape
    }
  },
};
```

---

## Component Guidelines

### Cards
```tsx
// Luôn sử dụng:
// - Nền trắng, bo góc 16px
// - Shadow mềm, KHÔNG dùng border
// - Hover effect: translateY(-5px) + shadow đậm hơn

<motion.div
  whileHover={{ y: -8, boxShadow: "0px 10px 30px rgba(0,0,0,0.1)" }}
  transition={{ type: "spring", stiffness: 300 }}
>
  <Card bordered={false} style={{ borderRadius: 16 }}>
    {/* Content */}
  </Card>
</motion.div>
```

### Navigation Tabs
```tsx
// Kiểu Pill (viên thuốc)
// Active: nền #1890FF, chữ trắng
// Inactive: nền trong suốt, chữ #6B7280
```

### Buttons
```tsx
// Primary: height 44px, borderRadius 8px, fontWeight 600
// Luôn có box-shadow nhẹ
<Button type="primary" size="large">Action</Button>
```

### Images
```tsx
// Encyclopedia Cards: ratio 4:3 hoặc 3:2
// Gallery/Social: ratio 1:1 (Square) hoặc Masonry
// Avatars: borderRadius 50%
```

---

## Animation with Motion for React

### Page Transitions
```tsx
// src/animations/variants.ts
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: "easeOut" } 
  },
  exit: { opacity: 0, y: -20 }
};

// Usage:
<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
  {/* Page content */}
</motion.div>
```

### Modal Animations
```tsx
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { type: "spring", damping: 25, stiffness: 500 } 
  }
};
```

### Micro-interactions
```tsx
// Card hover, Button clicks
<motion.div whileHover={{ y: -8 }} whileTap={{ scale: 0.98 }}>
```

---

## Icons & Assets

- **Icon Library**: @ant-design/icons (primary choice)
- **Style**: Outlined cho normal state, Filled cho active state
- **Container**: Icons trong hình tròn với nền #E6F7FF
- **Avatars**: Luôn borderRadius 50%

```tsx
import { HeartOutlined, HeartFilled, UserOutlined, HomeOutlined } from '@ant-design/icons';

// Usage:
// Normal state
<HeartOutlined style={{ fontSize: '24px', color: '#6B7280' }} />

// Active/Filled state
<HeartFilled style={{ fontSize: '24px', color: '#1890FF' }} />

// Icon với container tròn
<div style={{ 
  width: 40, 
  height: 40, 
  borderRadius: '50%', 
  background: '#E6F7FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
  <UserOutlined style={{ fontSize: '20px', color: '#1890FF' }} />
</div>
```

---

## Layout & Grid

```tsx
// Max width: 1200px, căn giữa
// Grid: 24 cột (Ant Design)
// Gutters: [16, 16] hoặc [24, 24]

<Row gutter={[24, 24]} style={{ maxWidth: 1200, margin: '0 auto' }}>
  <Col xs={24} md={12} lg={8}>{/* Content */}</Col>
</Row>

// Responsive:
// xs (mobile): 1 cột (100%)
// md (tablet): 2 cột (50%)
// lg (desktop): 3-4 cột
```

---

## Code Style Rules

### 1. NO Inline Styles
```tsx
// ❌ KHÔNG làm thế này:
<div style={{ color: '#1890FF', borderRadius: 12 }}>

// ✅ Làm thế này:
<div className={styles.container}> // CSS Modules
// hoặc sử dụng Ant Design theme tokens
```

### 2. Component Structure
```tsx
// Tạo Atomic Components trước:
// - RoundedButton
// - ShadowCard
// - PillTab

// Atoms > Molecules > Organisms > Pages
```

### 3. TypeScript
```tsx
// Luôn định nghĩa types/interfaces
interface AnimalCardProps {
  name: string;
  image: string;
  status: 'Public' | 'For Adoption' | 'Venomous';
}
```

### 4. CSS Variables
```scss
// styles/variables.scss
:root {
  --color-primary: #1890FF;
  --color-text-primary: #1F2937;
  --border-radius-card: 16px;
  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.05);
}
```

---

## Common Patterns

### Loading States
```tsx
import { Spin } from 'antd';
import { motion } from 'motion/react';

<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  <Spin size="large" />
</motion.div>
```

### Error Messages
```tsx
// Sử dụng color: #EB5757
import { Alert } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

// Với Ant Design Alert
<Alert 
  type="error" 
  message="Error message" 
  showIcon 
  style={{ borderRadius: 12 }}
/>

// Custom error với icon
<div style={{ color: '#EB5757', display: 'flex', alignItems: 'center', gap: 8 }}>
  <CloseCircleOutlined />
  <span>Error occurred</span>
</div>
```

### Success Tags
```tsx
import { Tag } from 'antd';
import { CheckCircleOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';

// Tags với màu sắc theo Design System
<Tag color="success" icon={<CheckCircleOutlined />} style={{ borderRadius: 20 }}>
  Public
</Tag>

<Tag color="warning" icon={<WarningOutlined />} style={{ borderRadius: 20 }}>
  For Adoption
</Tag>

<Tag color="error" icon={<InfoCircleOutlined />} style={{ borderRadius: 20 }}>
  Venomous
</Tag>

// Hoặc custom màu chính xác
<Tag style={{ borderRadius: 20, backgroundColor: '#27AE60', color: '#fff', border: 'none' }}>
  Public
</Tag>
<Tag style={{ borderRadius: 20, backgroundColor: '#F2994A', color: '#fff', border: 'none' }}>
  For Adoption
</Tag>
<Tag style={{ borderRadius: 20, backgroundColor: '#EB5757', color: '#fff', border: 'none' }}>
  Venomous
</Tag>
```

---

## Checklist for Every Component

- [ ] Sử dụng Motion for React cho animations
- [ ] Bo góc tròn >= 12px
- [ ] Shadow mềm thay vì border (khi có thể)
- [ ] Responsive với breakpoints xs/md/lg
- [ ] TypeScript interfaces đầy đủ
- [ ] Không dùng inline styles
- [ ] Hover states có animation mượt
- [ ] Accessibility (ARIA labels, keyboard navigation)

---

## Important Notes

1. **Luôn ưu tiên Ant Design components** trước khi tạo custom components
2. **Sử dụng Motion cho mọi transition/animation** để đảm bảo consistency
3. **Màu sắc phải tuân thủ Design System** - không tự ý thêm màu mới
4. **Mobile-first approach** - viết responsive từ đầu
5. **Performance**: Lazy load images, code splitting cho routes

---

**Version**: 1.0  
**Last Updated**: 02/01/2026  
**Maintained by**: PawPlanet Frontend Team
