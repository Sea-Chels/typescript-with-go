import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  glow?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  loadingText = 'Loading...',
  leftIcon,
  rightIcon,
  glow = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200 transform
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    hover:scale-105 active:scale-95
    ${fullWidth ? 'w-full' : ''}
    ${glow ? 'animate-glow' : ''}
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-accent-primary to-neon-purple
      text-white shadow-lg shadow-accent-primary/25
      hover:shadow-xl hover:shadow-accent-primary/30
      focus:ring-accent-primary
    `,
    secondary: `
      bg-dark-surface border border-dark-border
      text-dark-text hover:bg-dark-hover
      hover:border-accent-primary/50
      focus:ring-accent-primary
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-pink-600
      text-white shadow-lg shadow-red-600/25
      hover:shadow-xl hover:shadow-red-600/30
      focus:ring-red-500
    `,
    success: `
      bg-gradient-to-r from-green-600 to-emerald-600
      text-white shadow-lg shadow-green-600/25
      hover:shadow-xl hover:shadow-green-600/30
      focus:ring-green-500
    `,
    ghost: `
      bg-transparent text-dark-text
      hover:bg-dark-surface/50 hover:text-accent-light
      focus:ring-accent-primary
    `,
    neon: `
      bg-transparent border-2 border-neon-blue
      text-neon-blue shadow-lg shadow-neon-blue/25
      hover:bg-neon-blue/10 hover:shadow-xl hover:shadow-neon-blue/30
      hover:text-white focus:ring-neon-blue
      animate-pulse
    `,
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          {loadingText}
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}