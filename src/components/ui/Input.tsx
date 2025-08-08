import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError | string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'glass';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = true, variant = 'default', className = '', id, ...props }, ref) => {
    const errorMessage = typeof error === 'string' ? error : error?.message;
    
    const baseInputClasses = `
      ${fullWidth ? 'w-full' : ''}
      px-4 py-3
      rounded-lg
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg
      disabled:opacity-50 disabled:cursor-not-allowed
      placeholder:text-dark-muted
    `;

    const variantClasses = {
      default: `
        bg-dark-surface border border-dark-border
        text-dark-text
        hover:border-accent-primary/50
        focus:border-accent-primary focus:ring-accent-primary/50
        ${errorMessage ? 'border-red-500 focus:ring-red-500/50' : ''}
      `,
      glass: `
        bg-white/5 backdrop-blur-sm border border-white/10
        text-dark-text
        hover:bg-white/10 hover:border-white/20
        focus:bg-white/10 focus:border-accent-light focus:ring-accent-light/50
        ${errorMessage ? 'border-red-500/50 focus:ring-red-500/50' : ''}
      `
    };

    const inputClasses = `
      ${baseInputClasses}
      ${variantClasses[variant]}
      ${className}
    `.trim();

    return (
      <div className={`${fullWidth ? 'w-full' : ''} animate-fade-in`}>
        {label && (
          <label 
            htmlFor={id} 
            className="block text-sm font-medium text-dark-text mb-2"
          >
            {label}
            {props.required && <span className="text-accent-primary ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={inputClasses}
            aria-invalid={!!errorMessage}
            aria-describedby={errorMessage ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            {...props}
          />
          {variant === 'glass' && (
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent-primary/10 to-neon-purple/10 pointer-events-none" />
          )}
        </div>
        {errorMessage && (
          <p id={`${id}-error`} className="mt-2 text-sm text-red-400 animate-slide-up">
            {errorMessage}
          </p>
        )}
        {helperText && !errorMessage && (
          <p id={`${id}-helper`} className="mt-2 text-sm text-dark-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';