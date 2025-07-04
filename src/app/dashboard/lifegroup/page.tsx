'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import {
  BsCalendarWeek,
  BsPeople,
  BsPersonCircle,
  BsPersonPlus,
} from 'react-icons/bs';
import { FiUserCheck, FiUsers } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

const lifegroupMenus = [
  {
    title: 'Daftar Lifegroup',
    description: 'Lihat semua lifegroup yang tersedia',
    icon: BsPeople,
    href: '/dashboard/lifegroup/daftar',
    color: 'bg-emerald-600',
  },
  {
    title: 'Kelola Lifegroup Saya',
    description: 'Kelola Lifegroup kamu',
    icon: BsPersonCircle,
    href: '/dashboard/lifegroup/kelola',
    color: 'bg-emerald-800',
  },
] as const;

export default function LifegroupDashboardPage() {
  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Lifegroup Dashboard'
        description='Kelola semua lifegroup dan pelayanan'
        actionLabel='Kembali ke Dashboard'
        gradientFrom='from-emerald-500'
        gradientTo='to-emerald-700'
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {lifegroupMenus.map((menu, index) => (
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
                <div
                  className={`p-3 rounded-lg ${menu.color} text-white transform group-hover:rotate-12 transition-transform duration-300`}
                >
                  <menu.icon className='w-6 h-6' />
                </div>
                <div className='flex-1'>
                  <h3 className='text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors'>
                    {menu.title}
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    {menu.description}
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
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats Section */}
      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
        <h2 className='text-lg font-semibold mb-4 text-gray-900'>
          Statistik Lifegroup
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='bg-emerald-50 rounded-lg p-4 transform hover:scale-105 transition-transform duration-300'>
            <div className='flex items-center space-x-3'>
              <div className='bg-emerald-500 p-2 rounded-lg text-white'>
                <BsPeople className='w-5 h-5' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Total Lifegroup</p>
                <p className='text-xl font-semibold text-gray-900'>12</p>
              </div>
            </div>
          </div>
          <div className='bg-emerald-50 rounded-lg p-4 transform hover:scale-105 transition-transform duration-300'>
            <div className='flex items-center space-x-3'>
              <div className='bg-emerald-600 p-2 rounded-lg text-white'>
                <FiUsers className='w-5 h-5' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Anggota Aktif</p>
                <p className='text-xl font-semibold text-gray-900'>120</p>
              </div>
            </div>
          </div>
          <div className='bg-emerald-50 rounded-lg p-4 transform hover:scale-105 transition-transform duration-300'>
            <div className='flex items-center space-x-3'>
              <div className='bg-emerald-700 p-2 rounded-lg text-white'>
                <BsCalendarWeek className='w-5 h-5' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Jadwal Minggu Ini</p>
                <p className='text-xl font-semibold text-gray-900'>8</p>
              </div>
            </div>
          </div>
          <div className='bg-emerald-50 rounded-lg p-4 transform hover:scale-105 transition-transform duration-300'>
            <div className='flex items-center space-x-3'>
              <div className='bg-emerald-800 p-2 rounded-lg text-white'>
                <FiUserCheck className='w-5 h-5' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Menunggu Verifikasi</p>
                <p className='text-xl font-semibold text-gray-900'>5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
