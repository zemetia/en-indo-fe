'use client';

import { motion } from 'framer-motion';
import { FiUserX, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { hasLifegroupPICAccess } from '@/lib/helper';

interface LifegroupPICGuardProps {
  children: React.ReactNode;
}

export default function LifegroupPICGuard({ children }: LifegroupPICGuardProps) {
  const hasAccess = hasLifegroupPICAccess();

  if (!hasAccess) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <motion.div
          className='max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <FiUserX className='w-8 h-8 text-red-500' />
          </div>
          
          <h2 className='text-xl font-bold text-gray-900 mb-2'>
            Akses Ditolak
          </h2>
          
          <p className='text-gray-600 mb-6'>
            Anda tidak memiliki akses ke fitur lifegroup. Hanya PIC (Person In Charge) 
            Lifegroup yang dapat mengakses halaman ini.
          </p>
          
          <div className='space-y-3'>
            <p className='text-sm text-gray-500'>
              Jika Anda merasa ini adalah kesalahan, silakan hubungi administrator 
              untuk mendapatkan akses PIC Lifegroup.
            </p>
          </div>
          
          <div className='mt-6 flex flex-col sm:flex-row gap-3 justify-center'>
            <Link href='/dashboard'>
              <motion.button
                className='w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiArrowLeft className='w-4 h-4 mr-2' />
                Kembali ke Dashboard
              </motion.button>
            </Link>
            
            <Link href='/dashboard/pelayanan/pelayanan-saya'>
              <motion.button
                className='w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Lihat Pelayanan Saya
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}