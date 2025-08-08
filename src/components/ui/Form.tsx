import type { FormHTMLAttributes, ReactNode } from 'react';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export function Form({ children, className = '', ...props }: FormProps) {
  return (
    <form className={`space-y-4 ${className}`} {...props}>
      {children}
    </form>
  );
}

interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

export function FormGroup({ children, className = '' }: FormGroupProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

interface FormErrorProps {
  message?: string;
  className?: string;
}

export function FormError({ message, className = '' }: FormErrorProps) {
  if (!message) return null;
  
  return (
    <div className={`rounded-md bg-red-50 p-4 ${className}`}>
      <div className="text-sm text-red-800">{message}</div>
    </div>
  );
}