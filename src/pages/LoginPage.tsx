import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined, FacebookOutlined, LoginOutlined } from '@ant-design/icons';
import { AuthLayout } from '@/components';
import { SimpleAvatar } from '@/components';
import { fadeInUp } from '@/animations/variants';
import './auth.css';
import './login.css';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      message.success('Login successful!');
      console.log('Login values:', values);
    } catch (error) {
      message.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    message.info(`${provider} login coming soon!`);
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to manage your pets' health records">
      <div className="login-page">
        <SimpleAvatar />

        <motion.div {...fadeInUp}>
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="login-form"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#6B7280' }} />}
                placeholder="your.email@example.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#6B7280' }} />}
                placeholder="Enter your password"
                size="large"
              />
            </Form.Item>

            <div className="login-form__row">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a href="#" className="login-form__forgot">Forgot password?</a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                icon={<LoginOutlined />}
                className="login-form__submit-btn"
              >
                Sign In
              </Button>
            </Form.Item>

            <Divider plain className="login-form__divider">OR CONTINUE WITH</Divider>

            <div className="login-form__socials">
              <Button
                icon={<GoogleOutlined />}
                onClick={() => handleSocialLogin('Google')}
                size="large"
                className="social-btn"
              >
                Google
              </Button>
              <Button
                icon={<FacebookOutlined />}
                onClick={() => handleSocialLogin('Facebook')}
                size="large"
                className="social-btn"
              >
                Facebook
              </Button>
            </div>

            <div className="login-form__signup">
              <span className="muted">Don't have an account?</span>
              <button type="button" className="link" onClick={onSwitchToRegister}>
                Sign up
              </button>
            </div>
          </Form>
        </motion.div>
      </div>
    </AuthLayout>
  );
};
