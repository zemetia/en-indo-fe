'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import { QRScanCheckInResponse } from '@/lib/api/eventParticipants';

interface ScanResultProps {
  result: QRScanCheckInResponse | null;
  onDismiss?: () => void;
  autoDismissDelay?: number; // milliseconds
}

export default function ScanResult({
  result,
  onDismiss,
  autoDismissDelay = 5000,
}: ScanResultProps) {
  useEffect(() => {
    if (result && onDismiss && autoDismissDelay > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoDismissDelay);

      return () => clearTimeout(timer);
    }
  }, [result, onDismiss, autoDismissDelay]);

  if (!result) return null;

  const getStatusConfig = () => {
    switch (result.status) {
      case 'not_participant':
        return {
          icon: XCircle,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Tidak Terdaftar',
        };
      case 'already_checked_in':
        return {
          icon: Info,
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Sudah Presensi',
        };
      case 'success':
        return {
          icon: CheckCircle2,
          iconColor: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Berhasil Presensi',
        };
      default:
        return {
          icon: Info,
          iconColor: 'text-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Info',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.3 }}
        className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50'
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className={`max-w-md w-full ${config.bgColor} ${config.borderColor} border-2 rounded-2xl shadow-2xl p-8`}
        >
          <div className='flex flex-col items-center text-center space-y-4'>
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              <Icon className={`w-20 h-20 ${config.iconColor}`} />
            </motion.div>

            {/* Title */}
            <h2 className='text-2xl font-bold text-gray-900'>
              {config.title}
            </h2>

            {/* Message */}
            <p className='text-lg text-gray-700 leading-relaxed'>
              {result.message}
            </p>

            {/* Event Title */}
            {result.eventTitle && (
              <p className='text-sm text-gray-500'>
                Event: <span className='font-semibold'>{result.eventTitle}</span>
              </p>
            )}

            {/* Check-in Time */}
            {result.checkInTime && (
              <p className='text-sm text-gray-500'>
                Waktu: {new Date(result.checkInTime).toLocaleString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}

            {/* Close Button */}
            {onDismiss && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDismiss}
                className='mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors'
              >
                Tutup
              </motion.button>
            )}

            {/* Auto-dismiss indicator */}
            {autoDismissDelay > 0 && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: autoDismissDelay / 1000, ease: 'linear' }}
                className='h-1 bg-gray-400 rounded-full mt-2'
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
