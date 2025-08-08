import { forwardRef, type InputHTMLAttributes } from 'react';
import { type FieldError } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError | string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = true, className = '', id, ...props }, ref) => {
    const errorMessage = typeof error === 'string' ? error : error?.message;
    
    const inputClasses = `
      ${fullWidth ? 'w-full' : ''}
      px-3 py-2 
      border border-gray-300 
      rounded-md 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
      ${errorMessage ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
      ${className}
    `.trim();

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label 
            htmlFor={id} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={inputClasses}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        />
        {errorMessage && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
            {errorMessage}
          </p>
        )}
        {helperText && !errorMessage && (
          <p id={`${id}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';