import React from 'react';
import { cn } from '../../lib/utils';
import { IoClose } from 'react-icons/io5';

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity duration-300">
      <div className="fixed inset-0" onClick={() => onOpenChange?.(false)} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-gray-850 bg-gray-900 text-gray-100 shadow-2xl z-10 p-6 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded-md hover:bg-gray-800"
        >
          <IoClose className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ className, children, ...props }) => (
  <div className={cn("mt-2", className)} {...props}>
    {children}
  </div>
);

export const DialogHeader = ({ className, children, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)} {...props}>
    {children}
  </div>
);

export const DialogTitle = ({ className, children, ...props }) => (
  <h2 className={cn("text-lg font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent", className)} {...props}>
    {children}
  </h2>
);

export const DialogDescription = ({ className, children, ...props }) => (
  <p className={cn("text-sm text-gray-400", className)} {...props}>
    {children}
  </p>
);

export const DialogFooter = ({ className, children, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6 gap-2", className)} {...props}>
    {children}
  </div>
);
