import React from 'react';
import './AuthLayout.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
      <div className="auth-layout">
        <div className="auth-layout__left">
          <div className="auth-layout__branding">
            <div className="auth-layout__logo" aria-hidden>
              {/* Placeholder logo - simplified */}
              <svg width="172" height="37" viewBox="0 0 172 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="172" height="37" rx="8" fill="#F0F6FA"/>
              </svg>
            </div>

            <div className="auth-layout__hero">
              <h1 className="auth-layout__title">Kết nối cộng đồng<br/>yêu thú cưng</h1>
              <p className="auth-layout__subtitle">Chia sẻ khoảnh khắc đáng yêu, kết bạn với những người cùng đam mê, và
                khám phá thế giới thú cưng đầy màu sắc.</p>
            </div>
          </div>

          <div className="auth-layout__illustration">
            <img src="https://i.pinimg.com/736x/40/8b/8b/408b8be30984bdd7579416a6cb114275.jpg"
                 alt="Cute Golden Retriever Puppies"/>
          </div>

          <div className="auth-layout__decor">
            <svg width="48" height="36" viewBox="0 0 47 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10 H 30 V 20 H 10 Z" fill="#1782FF"/>
            </svg>
            <svg width="48" height="36" viewBox="0 0 47 36" fill="#1782FF" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10 H 30 V 20 H 10 Z"/>
            </svg>
            <svg width="48" height="36" viewBox="0 0 47 36" fill="#1782FF" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10 H 30 V 20 H 10 Z"/>
            </svg>
          </div>
        </div>

        <div className="auth-layout__right">
          <div className="auth-layout__form-wrap">
            <div className="auth-layout__mobile-logo">
              <svg width="140" height="30" viewBox="0 0 172 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="172" height="37" rx="8" fill="#FFFFFF"/>
              </svg>
            </div>

            <div className="auth-layout__heading">
              <h2>{title}</h2>
              {subtitle && <p className="auth-layout__subtitle--muted">{subtitle}</p>}
            </div>

            {children}
          </div>
        </div>
      </div>
  );
};
