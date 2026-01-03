import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { AuthLayout } from '@/components';
import { SimpleAvatar } from '@/components';
import { fadeInUp } from '@/animations/variants.ts';
import '../LoginPage/auth.css';
import './register.css';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success('Registration successful! Welcome to PawPlanet!');
      console.log('Register values:', values);
    } catch (error) {
      message.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    message.info(`${provider} signup coming soon!`);
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join PawPlanet and start managing your pets' health">
      <div className="register-page">
        <SimpleAvatar />

        <motion.div {...fadeInUp}>
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="register-form"
            requiredMark={false}
          >
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true, message: 'Please input your full name!' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#6B7280' }} />}
                placeholder="John Doe"
                size="large"
              />
            </Form.Item>

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
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 8, message: 'Password must be at least 8 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#6B7280' }} />}
                placeholder="At least 8 characters"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#6B7280' }} />}
                placeholder="Re-enter your password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="agree"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Please accept the terms and conditions')),
                },
              ]}
            >
              <Checkbox>
                I agree to the <a href="#" className="link">Terms of Service</a> and{' '}
                <a href="#" className="link">Privacy Policy</a>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                icon={<UserOutlined />}
                className="register-form__submit-btn"
              >
                Create Account
              </Button>
            </Form.Item>

            <Divider plain className="register-form__divider">OR CONTINUE WITH</Divider>

            <div className="register-form__socials">
              <Button
                icon={<GoogleOutlined />}
                onClick={() => handleSocialSignup('Google')}
                size="large"
                className="social-btn"
              >
                Google
              </Button>
              <Button
                icon={<FacebookOutlined />}
                onClick={() => handleSocialSignup('Facebook')}
                size="large"
                className="social-btn"
              >
                Facebook
              </Button>
            </div>

            <div className="register-form__signin">
              <span className="muted">Already have an account?</span>
              <button type="button" className="link" onClick={onSwitchToLogin}>
                Sign in
              </button>
            </div>
          </Form>
        </motion.div>
      </div>
    </AuthLayout>
  );
};

