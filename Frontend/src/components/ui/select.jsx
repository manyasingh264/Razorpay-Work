import React from 'react';
import { cn } from '../../lib/utils';
import { IoChevronDown } from 'react-icons/io5';

export const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          'flex h-10 w-full appearance-none rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 pr-10 text-sm text-gray-200 placeholder-gray-500 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
        <IoChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
});
Select.displayName = 'Select';
