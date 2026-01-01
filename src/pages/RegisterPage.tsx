import React, { useState } from 'react';
import { AuthLayout } from '@/components';
import { SimpleAvatar } from '@/components';
import { InputField } from '@/components';
import { Button } from '@/components';
import { Divider } from '@/components';
import { SocialButton } from '@/components';
import './auth.css';
import './register.css';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!agree) {
      alert('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      alert('Registration successful! Welcome to PawPlanet!');
      setLoading(false);
      console.log('Register values:', { fullName, email, password });
    }, 1000);
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join PawPlanet and start managing your pets' health">
      <div className="register-page">
        <SimpleAvatar />

        <form onSubmit={handleSubmit} className="register-form">
          <InputField
            id="fullName"
            label="Full Name"
            type="text"
            value={fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
            placeholder="John Doe"
            icon={(
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="3" fill="#6B7280" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="#6B7280" />
              </svg>
            )}
            required
          />

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
            placeholder="At least 8 characters"
            icon={(
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="18" height="10" rx="2" stroke="#6B7280" strokeWidth="1.5" />
                <path d="M7 11V8a5 5 0 0110 0v3" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            minLength={8}
            required
          />

          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            icon={(
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="18" height="10" rx="2" stroke="#6B7280" strokeWidth="1.5" />
                <path d="M7 11V8a5 5 0 0110 0v3" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            required
          />

          <div className="register-form__agree">
            <label className="checkbox">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span className="checkbox__label">I agree to the <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a></span>
            </label>
          </div>

          <Button type="submit" className="register-form__submit" disabled={loading}>
            {loading ? 'Creating account...' : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" fill="#FFFFFF"/><path d="M3 20c0-3.866 3.582-7 9-7s9 3.134 9 7v1H3v-1z" fill="#FFFFFF"/></svg>
                <span>Create Account</span>
              </>
            )}
          </Button>

          <Divider />

          <div className="register-form__socials">
            <SocialButton label="Google" onClick={() => console.log('Google')}>
              <svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#4285F4" /></svg>
            </SocialButton>
            <SocialButton label="Facebook" onClick={() => console.log('Facebook')}>
              <svg width="20" height="20" viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="#1877F2" /></svg>
            </SocialButton>
          </div>

          <div className="register-form__signin">
            <span className="muted">Already have an account?</span>
            <button type="button" className="link" onClick={onSwitchToLogin}>Sign in</button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

