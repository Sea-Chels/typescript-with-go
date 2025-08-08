import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdropClick?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdropClick = true,
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay with blur */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={closeOnBackdropClick ? onClose : undefined}
          aria-hidden="true"
        />

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal panel with glass effect */}
        <div className={`
          inline-block align-bottom 
          bg-dark-surface/95 backdrop-blur-md
          border border-dark-border
          rounded-xl text-left 
          overflow-hidden 
          shadow-2xl shadow-black/50
          transform transition-all animate-slide-up
          sm:my-8 sm:align-middle ${sizeClasses[size]} sm:w-full
        `}>
          {/* Gradient overlay for visual effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-neon-purple/5 pointer-events-none" />
          
          {/* Header */}
          {title && (
            <div className="relative bg-dark-surface/50 px-6 py-4 border-b border-dark-border">
              <h3 className="text-lg leading-6 font-semibold text-dark-text">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-dark-muted hover:text-dark-text transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Content */}
          <div className="relative bg-transparent px-6 py-6">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="relative bg-dark-surface/30 px-6 py-4 sm:flex sm:flex-row-reverse border-t border-dark-border">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}