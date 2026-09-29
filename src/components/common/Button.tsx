import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer select-none rounded-xs';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2 sm:py-2.5 gap-2',
    lg: 'text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-emerald-800 text-white hover:bg-emerald-900 active:bg-emerald-950 shadow-xs hover:shadow-sm',
    secondary: 'bg-stone-100 text-slate-900 hover:bg-stone-200 active:bg-stone-300',
    outline: 'border border-stone-300 bg-white text-slate-900 hover:bg-stone-50 hover:border-emerald-700 active:bg-stone-100',
    ghost: 'text-slate-700 hover:text-emerald-900 hover:bg-stone-100 active:bg-stone-200',
    danger: 'bg-rose-700 text-white hover:bg-rose-800 active:bg-rose-900',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4 mr-1 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
