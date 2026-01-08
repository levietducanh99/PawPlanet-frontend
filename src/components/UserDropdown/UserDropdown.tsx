/**
 * User Dropdown Component
 * Displays user logo and dropdown with profile/logout options
 */

import React from 'react';
import { Dropdown, Avatar, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useLogout, useViewProfile } from '@/hooks';
import type { User } from '@/domain/auth';
import './UserDropdown.css';

const { Text } = Typography;

interface UserDropdownProps {
  user: User;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
  const { logout, loading: logoutLoading } = useLogout();
  const { viewProfile, loading: profileLoading } = useViewProfile();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'profile':
        viewProfile();
        break;
      case 'logout':
        logout();
        break;
      default:
        break;
    }
  };

  const items: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div className="user-dropdown__info">
          <Text strong>{user.username}</Text>
          <Text type="secondary" className="user-dropdown__email">
            {user.email}
          </Text>
        </div>
      ),
      disabled: true,
      className: 'user-dropdown__info-item'
    },
    {
      type: 'divider'
    },
    {
      key: 'profile',
      label: profileLoading ? 'Loading...' : 'View Profile',
      icon: <UserOutlined />,
      className: 'user-dropdown__menu-item',
      disabled: profileLoading
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      className: 'user-dropdown__menu-item',
      disabled: true // Placeholder for future implementation
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      label: logoutLoading ? 'Logging out...' : 'Logout',
      icon: <LogoutOutlined />,
      className: 'user-dropdown__menu-item user-dropdown__logout',
      disabled: logoutLoading
    }
  ];

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
        className: 'user-dropdown__menu'
      }}
      placement="bottomRight"
      arrow
      trigger={['click']}
    >
      <div className="user-dropdown__trigger">
        <Space size={8}>
          <Avatar
            size={32}
            src={user.avatarUrl}
            icon={<UserOutlined />}
            className="user-dropdown__avatar"
          />
          <div className="user-dropdown__name">
            <Text className="user-dropdown__username">
              {user.username}
            </Text>
          </div>
        </Space>
      </div>
    </Dropdown>
  );
};
