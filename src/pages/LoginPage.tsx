import React, { useState } from 'react';
import { motion } from "framer-motion";
import { AuthLayout } from '../components/AuthLayout/AuthLayout';
import { SimpleAvatar } from '../components/SimpleAvatar/SimpleAvatar';
import { InputField } from '../components/InputField/InputField';
import { Button } from '../components/Button/Button';
import { Divider } from '../components/Divider/Divider';
import { SocialButton } from '../components/SocialButton/SocialButton';
import './auth.css';
import './login.css';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert('Login successful!');
      setLoading(false);
      console.log({ email, password, remember });
    }, 800);
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to manage your pets' health records">
      <div className="login-page">
        <SimpleAvatar />

        <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>
          <form onSubmit={handleSubmit} className="login-form">
            <InputField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              icon={(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6.5L12 13l9-6.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="#6B7280" strokeWidth="1.5" />
                </svg>
              )}
              required
            />

            <InputField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="Enter your password"
              icon={(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="10" rx="2" stroke="#6B7280" strokeWidth="1.5" />
                  <path d="M7 11V8a5 5 0 0110 0v3" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              required
            />

            <div className="login-form__row">
              <label className="login-form__remember">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span>Remember me</span>
              </label>

              <a href="#" className="login-form__forgot">Forgot password?</a>
            </div>

            <Button type="submit" className="btn--primary login-form__submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Divider />

            <div className="login-form__socials">
              <SocialButton label="Google" onClick={() => console.log('Google')}>
                <svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#4285F4" /></svg>
              </SocialButton>
              <SocialButton label="Facebook" onClick={() => console.log('Facebook')}>
                <svg width="20" height="20" viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="#1877F2" /></svg>
              </SocialButton>
            </div>

            <div className="login-form__signup">
              <span className="muted">Don't have an account?</span>
              <button type="button" className="link" onClick={onSwitchToRegister}>Sign up</button>
            </div>
          </form>
        </motion.div>
      </div>
    </AuthLayout>
  );
};
