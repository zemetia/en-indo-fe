'use client';

import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle, X, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  const config = {
    success: {
      Icon: CheckCircle,
      className: 'bg-green-50 border-green-500 text-green-700',
      iconColor: 'text-green-500',
    },
    warning: {
      Icon: AlertTriangle,
      className: 'bg-yellow-50 border-yellow-500 text-yellow-700',
      iconColor: 'text-yellow-500',
    },
    error: {
      Icon: XCircle,
      className: 'bg-red-50 border-red-500 text-red-700',
      iconColor: 'text-red-500',
    },
  }[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`relative flex w-full max-w-sm items-start space-x-4 rounded-xl border p-4 shadow-lg ${config.className}`}
    >
      <config.Icon className={`h-6 w-6 flex-shrink-0 ${config.iconColor}`} />
      <div className='flex-1'>
        <p className='block font-medium'>{message}</p>
      </div>
      <button
        onClick={onClose}
        className='inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-current/70 transition-colors hover:bg-black/10'
      >
        <span className='sr-only'>Close</span>
        <X className='h-4 w-4' />
      </button>
    </motion.div>
  );
};

export default Toast;
