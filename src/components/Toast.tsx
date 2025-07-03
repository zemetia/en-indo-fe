import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  BsCheckCircleFill,
  BsExclamationTriangleFill,
  BsX,
  BsXCircleFill,
} from 'react-icons/bs';

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
  duration = 3000,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 100 / (duration / 100);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <BsCheckCircleFill className='w-5 h-5' />;
      case 'warning':
        return <BsExclamationTriangleFill className='w-5 h-5' />;
      case 'error':
        return <BsXCircleFill className='w-5 h-5' />;
      default:
        return null;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          background: 'bg-green-50',
          border: 'border-green-500',
          text: 'text-green-700',
          icon: 'text-green-500',
          progress: 'bg-green-500',
        };
      case 'warning':
        return {
          background: 'bg-yellow-50',
          border: 'border-yellow-500',
          text: 'text-yellow-700',
          icon: 'text-yellow-500',
          progress: 'bg-yellow-500',
        };
      case 'error':
        return {
          background: 'bg-red-50',
          border: 'border-red-500',
          text: 'text-red-700',
          icon: 'text-red-500',
          progress: 'bg-red-500',
        };
      default:
        return {
          background: 'bg-blue-50',
          border: 'border-blue-500',
          text: 'text-blue-700',
          icon: 'text-blue-500',
          progress: 'bg-blue-500',
        };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className={`${colors.background} border-l-4 ${colors.border} rounded-md shadow-md p-4 mb-3 max-w-xs relative overflow-hidden`}
    >
      <div className='flex items-start'>
        <div className={`${colors.icon} flex-shrink-0 mr-3`}>{getIcon()}</div>
        <div className='flex-1'>
          <p className={`text-sm ${colors.text} font-medium`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`${colors.text} hover:bg-gray-100 rounded-full p-1 transition-colors`}
        >
          <BsX className='w-4 h-4' />
        </button>
      </div>
      <div className='h-1 w-full bg-gray-200 absolute bottom-0 left-0'>
        <div
          className={`h-1 ${colors.progress}`}
          style={{ width: `${progress}%`, transition: 'width 100ms linear' }}
        />
      </div>
    </motion.div>
  );
};

export default Toast;
