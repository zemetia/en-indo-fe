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
import { FiUserCheck, FiUsers, FiRefreshCw } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { hasLifegroupPICAccess, getCurrentUserLifegroupPermissions } from '@/lib/helper';
import { lifeGroupApi, type LifeGroupStatistics } from '@/lib/lifegroup';
import { useToast } from '@/context/ToastContext';

const lifegroupMenus = [
  {
    title: 'Daftar Lifegroup',
    description: 'Kelola semua lifegroup di gereja (PIC only)',
    icon: BsPeople,
    href: '/dashboard/lifegroup/daftar',
    color: 'bg-purple-600',
    requirePIC: true,
  },
  {
    title: 'My Lifegroup',
    description: 'Lihat lifegroup yang Anda ikuti',
    icon: BsPersonCircle,
    href: '/dashboard/lifegroup/my-lifegroup',
    color: 'bg-purple-700',
    requirePIC: false,
  },
  {
    title: 'Tambah Lifegroup',
    description: 'Buat lifegroup baru (PIC only)',
    icon: BsPersonPlus,
    href: '/dashboard/lifegroup/tambah',
    color: 'bg-purple-800',
    requirePIC: true,
  },
] as const;

export default function LifegroupDashboardPage() {
  const isPIC = hasLifegroupPICAccess();
  const { showToast } = useToast();
  const [statistics, setStatistics] = React.useState<LifeGroupStatistics | null>(null);
  const [loadingStats, setLoadingStats] = React.useState(true);
  const [errorStats, setErrorStats] = React.useState<string | null>(null);
  
  // Filter menus based on PIC access
  const availableMenus = lifegroupMenus.filter(menu => 
    !menu.requirePIC || isPIC
  );

  const fetchStatistics = async () => {
    try {
      setLoadingStats(true);
      setErrorStats(null);
      
      if (!isPIC) {
        // For non-PIC users, we can't fetch statistics
        setStatistics({
          total_lifegroups: 0,
          total_members: 0,
          total_person_members: 0,
          total_visitor_members: 0,
          active_lifegroups: 0,
          pending_requests: 0,
          this_week_meetings: 0,
        });
        return;
      }

      const permissions = getCurrentUserLifegroupPermissions();
      if (!permissions || permissions.churches.length === 0) {
        throw new Error('Tidak ada akses gereja');
      }

      const churchIds = permissions.churches.map(church => church.id);
      const stats = await lifeGroupApi.getStatisticsByChurches(churchIds);
      setStatistics(stats);
    } catch (error: any) {
      console.error('Error fetching statistics:', error);
      setErrorStats('Gagal memuat statistik');
      // Set default values on error
      setStatistics({
        total_lifegroups: 0,
        total_members: 0,
        total_person_members: 0,
        total_visitor_members: 0,
        active_lifegroups: 0,
        pending_requests: 0,
        this_week_meetings: 0,
      });
    } finally {
      setLoadingStats(false);
    }
  };

  React.useEffect(() => {
    fetchStatistics();
  }, [isPIC]);

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Lifegroup Dashboard'
        description='Kelola semua lifegroup dan pelayanan'
        actionLabel='Kembali ke Dashboard'
        gradientFrom='from-purple-500'
        gradientTo='to-purple-700'
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {availableMenus.map((menu, index) => (
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
                  <h3 className='text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors'>
                    {menu.title}
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    {menu.description}
                  </p>
                </div>
                <div className='text-gray-400 group-hover:text-purple-600 transition-colors'>
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
              <div className='mt-4 border-t border-purple-50 pt-4'>
                <div className='flex items-center text-sm text-gray-500'>
                  <span className='group-hover:text-purple-600 transition-colors flex items-center'>
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
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Statistik Lifegroup
          </h2>
          {errorStats && (
            <button
              onClick={fetchStatistics}
              className='text-sm text-red-600 hover:text-red-700 flex items-center'
              title='Refresh statistik'
            >
              <FiRefreshCw className='w-4 h-4 mr-1' />
              Refresh
            </button>
          )}
        </div>
        
        {loadingStats ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className='bg-purple-50 rounded-lg p-4 animate-pulse'>
                <div className='flex items-center space-x-3'>
                  <div className='bg-purple-300 p-2 rounded-lg w-9 h-9'></div>
                  <div>
                    <div className='h-4 bg-purple-200 rounded w-16 mb-1'></div>
                    <div className='h-6 bg-purple-300 rounded w-8'></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='bg-purple-50 rounded-lg p-4 transform hover:scale-105 transition-transform duration-300'>
              <div className='flex items-center space-x-3'>
                <div className='bg-purple-500 p-2 rounded-lg text-white'>
                  <BsPeople className='w-5 h-5' />
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Total Lifegroup</p>
                  <p className='text-xl font-semibold text-gray-900'>
                    {statistics?.total_lifegroups || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-purple-50 rounded-lg p-4 transform hover:scale-105 transition-transform duration-300'>
              <div className='flex items-center space-x-3'>
                <div className='bg-purple-600 p-2 rounded-lg text-white'>
                  <FiUsers className='w-5 h-5' />
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Total Anggota</p>
                  <p className='text-xl font-semibold text-gray-900'>
                    {statistics?.total_members || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-purple-50 rounded-lg p-4 transform hover:scale-105 transition-transform duration-300'>
              <div className='flex items-center space-x-3'>
                <div className='bg-purple-700 p-2 rounded-lg text-white'>
                  <BsCalendarWeek className='w-5 h-5' />
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Lifegroup Aktif</p>
                  <p className='text-xl font-semibold text-gray-900'>
                    {statistics?.active_lifegroups || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-purple-50 rounded-lg p-4 transform hover:scale-105 transition-transform duration-300'>
              <div className='flex items-center space-x-3'>
                <div className='bg-purple-800 p-2 rounded-lg text-white'>
                  <FiUserCheck className='w-5 h-5' />
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Anggota Person</p>
                  <p className='text-xl font-semibold text-gray-900'>
                    {statistics?.total_person_members || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {errorStats && (
          <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-sm text-red-700'>
              {errorStats}. Klik "Refresh" untuk mencoba lagi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
