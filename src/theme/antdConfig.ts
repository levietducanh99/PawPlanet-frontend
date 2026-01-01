import { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
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
      borderRadius: 20,
    },
    Checkbox: {
      borderRadius: 4,
    },
  },
};

