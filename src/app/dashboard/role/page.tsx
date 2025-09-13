'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import { BsPeople, BsPersonBadge, BsPersonPlus } from 'react-icons/bs';
import { FiUserCheck } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

const roleMenus = [
  {
    title: 'Daftar Role',
    description: 'Lihat semua role yang tersedia',
    icon: BsPersonBadge,
    href: '/dashboard/role/daftar',
    color: 'bg-amber-600',
  },
  {
    title: 'Kelompok',
    description: 'Kelola kelompok pelayanan',
    icon: BsPeople,
    href: '/dashboard/role/kelompok',
    color: 'bg-amber-700',
  },
  {
    title: 'Tambah Role',
    description: 'Buat role baru',
    icon: BsPersonPlus,
    href: '/dashboard/role/tambah',
    color: 'bg-amber-800',
  },
  {
    title: 'Verifikasi',
    description: 'Verifikasi role pelayan',
    icon: FiUserCheck,
    href: '/dashboard/role/verifikasi',
    color: 'bg-amber-900',
  },
] as const;

export default function RoleDashboardPage() {
  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Role Dashboard'
        description='Kelola semua role dan kelompok pelayanan'
        actionLabel='Kembali ke Dashboard'
        gradientFrom='from-amber-500'
        gradientTo='to-amber-700'
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {roleMenus.map((menu, index) => (
          <motion.div
            key={menu.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={menu.href} className='block group'>
              <div className='bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1'>
                <div className='flex items-start space-x-4'>
                  <div className={`p-3 rounded-lg ${menu.color} text-white`}>
                    <menu.icon className='w-6 h-6' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors'>
                      {menu.title}
                    </h3>
                    <p className='mt-1 text-sm text-gray-500'>
                      {menu.description}
                    </p>
                  </div>
                  <div className='text-gray-400 group-hover:text-amber-600 transition-colors'>
                    <svg
                      className='w-5 h-5'
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
                <div className='mt-4 border-t border-gray-100 pt-4'>
                  <div className='flex items-center text-sm text-gray-500'>
                    <span className='group-hover:text-amber-600 transition-colors'>
                      Buka Menu →
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
