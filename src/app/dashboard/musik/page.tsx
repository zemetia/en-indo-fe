'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import { FiCalendar, FiList, FiMusic } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

const musicMenus = [
  {
    title: 'Jadwal Saya',
    description: 'Lihat jadwal pelayanan musik',
    icon: FiCalendar,
    href: '/dashboard/musik/jadwal-saya',
    color: 'bg-amber-600',
  },
  {
    title: 'Penjadwalan',
    description: 'Jadwalkan pelayanan musik',
    icon: FiCalendar,
    href: '/dashboard/musik/penjadwalan',
    color: 'bg-amber-700',
  },
  {
    title: 'List Lagu',
    description: 'Kelola daftar lagu',
    icon: FiMusic,
    href: '/dashboard/musik/list-lagu',
    color: 'bg-amber-800',
  },
  {
    title: 'List Pelayan',
    description: 'Kelola data pelayan musik',
    icon: FiList,
    href: '/dashboard/musik/list-pelayan',
    color: 'bg-amber-900',
  },
] as const;

export default function MusicDashboardPage() {
  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Musik Dashboard'
        description='Kelola semua jadwal dan pelayanan musik'
        actionLabel='Kembali ke Dashboard'
        gradientFrom='from-amber-500'
        gradientTo='to-amber-700'
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {musicMenus.map((menu, index) => (
          <motion.div
            key={menu.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={menu.href}
              className='group block p-6 bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-blue-500 hover:-translate-y-1'
            >
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
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
