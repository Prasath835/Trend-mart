import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium uppercase tracking-wider text-neutral-600 mb-1.5">
            {label}
            {props.required && <span className="text-neutral-400 ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-3.5 py-2 text-sm bg-white border ${
            error ? 'border-rose-400 focus:border-rose-600 focus:ring-rose-500/20' : 'border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900/10'
          } rounded-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 disabled:bg-neutral-100 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-rose-600 font-normal">{error}</p>}
        {!error && helperText && <p className="mt-1.5 text-xs text-neutral-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
