'use client';

import { motion } from 'framer-motion';
import { Calendar, Users, QrCode } from 'lucide-react';
import Link from 'next/link';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

interface AttendanceType {
  id: string;
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}

const attendanceTypes: AttendanceType[] = [
  {
    id: 'simple',
    title: 'Pencatatan Sederhana',
    description:
      'Catat jumlah kehadiran berdasarkan kategori (Dewasa, Youth, Kids)',
    icon: Users,
    href: '/dashboard/attendance/simple',
    color: 'bg-emerald-600',
  },
  {
    id: 'manual',
    title: 'Pencatatan Manual',
    description:
      'Tandai kehadiran jemaat secara manual untuk event yang terdaftar',
    icon: Calendar,
    href: '/dashboard/attendance/manual',
    color: 'bg-emerald-700',
  },
  {
    id: 'qr',
    title: 'Scan QR Code',
    description: 'Scan QR Code untuk pencatatan kehadiran otomatis',
    icon: QrCode,
    href: '/dashboard/attendance/qr',
    color: 'bg-emerald-800',
  },
];

export default function AttendancePage() {
  return (
    <div className='space-y-6'>
      {/* Featured Card */}
      <FeaturedCard
        title='Pencatatan Kehadiran'
        description='Kelola pencatatan kehadiran jemaat untuk setiap event'
        actionLabel='Mulai Pencatatan'
        gradientFrom='from-emerald-500'
        gradientTo='to-emerald-700'
      />

      {/* Menu Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {attendanceTypes.map((type, index) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={type.href} className='block group'>
              <div className='bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1'>
                <div className='flex items-start space-x-4'>
                  <div
                    className={`p-3 rounded-lg ${type.color} text-white transform group-hover:rotate-12 transition-transform duration-300`}
                  >
                    <type.icon className='w-6 h-6' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors'>
                      {type.title}
                    </h3>
                    <p className='mt-1 text-sm text-gray-500'>
                      {type.description}
                    </p>
                  </div>
                  <div className='text-gray-400 group-hover:text-emerald-600 transition-colors'>
                    <svg
                      className='w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </div>
                </div>
                <div className='mt-4 border-t border-emerald-50 pt-4'>
                  <div className='flex items-center text-sm text-gray-500'>
                    <span className='group-hover:text-emerald-600 transition-colors flex items-center'>
                      Buka Menu
                      <svg
                        className='w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 5l7 7-7 7'
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
