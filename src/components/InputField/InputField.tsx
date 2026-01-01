import React from 'react';
import './InputField.css';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  id: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, icon, id, ...rest }) => {
  return (
    <div className="input-field">
        <div className="input-field__container">
            {icon && <span className="input-field__icon">{icon}</span>}
            <label htmlFor={id} className="input-field__label">{label}</label>
        </div>
      <div className="input-field__control">
        <input id={id} className="input-field__input" {...rest} />
      </div>
    </div>
  );
};

