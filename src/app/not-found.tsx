'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4'>
      <div className='max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center'>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='flex justify-center mb-6'
        >
          <div className='p-4 bg-red-100 rounded-full'>
            <FiAlertTriangle className='w-16 h-16 text-red-500' />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className='text-3xl font-bold text-gray-900 mb-2'
        >
          Halaman Tidak Ditemukan
        </motion.h1>

        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='text-gray-600 mb-8'
        >
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau Anda tidak
          memiliki izin untuk mengaksesnya.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            href='/dashboard'
            className='inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
          >
            <FiArrowLeft className='mr-2' />
            Kembali ke Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
