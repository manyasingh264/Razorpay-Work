import React from 'react';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-98';
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/10 font-semibold',
    destructive: 'bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-500/10',
    outline: 'border border-gray-750 text-gray-200 hover:bg-gray-800 hover:text-white',
    secondary: 'bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-750',
    ghost: 'hover:bg-gray-800 hover:text-white text-gray-300',
    link: 'text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';
