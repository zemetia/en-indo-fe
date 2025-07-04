'use client';

import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle, X, XCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

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
      barColor: 'bg-green-500',
      iconColor: 'text-green-500',
    },
    warning: {
      Icon: AlertTriangle,
      barColor: 'bg-yellow-500',
      iconColor: 'text-yellow-500',
    },
    error: {
      Icon: XCircle,
      barColor: 'bg-red-500',
      iconColor: 'text-red-500',
    },
    info: {
      Icon: Info,
      barColor: 'bg-blue-500',
      iconColor: 'text-blue-500',
    },
  }[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="relative flex w-full max-w-sm items-center space-x-4 rounded-md bg-white p-4 shadow-lg overflow-hidden"
    >
      <div className={`absolute left-0 top-0 h-full w-1.5 ${config.barColor}`} />
      <div className="pl-2">
        <config.Icon className={`h-6 w-6 flex-shrink-0 ${config.iconColor}`} />
      </div>
      <div className='flex-1'>
        <p className='block font-medium text-gray-800'>{message}</p>
      </div>
      <button
        onClick={onClose}
        className='inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800'
      >
        <span className='sr-only'>Close</span>
        <X className='h-4 w-4' />
      </button>
    </motion.div>
  );
};

export default Toast;
