'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  BsCalendarWeek,
  BsPeople,
  BsPersonCircle,
  BsCalendarEvent,
} from 'react-icons/bs';
import { FiUsers, FiCalendar, FiMapPin, FiRefreshCw, FiAlertTriangle, FiUser, FiStar, FiUserCheck } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { getCurrentUserId } from '@/lib/helper';
import { useToast } from '@/context/ToastContext';
import { lifeGroupApi, type LifeGroup } from '@/lib/lifegroup';

export default function MyLifegroupPage() {
  const { showToast } = useToast();
  const [lifeGroups, setLifeGroups] = useState<LifeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const fetchMyLifeGroups = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        setError('Tidak dapat mengambil data pengguna. Silakan login kembali.');
        return;
      }

      const userLifeGroups = await lifeGroupApi.getByUser(userId);
      setLifeGroups(userLifeGroups || []);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Gagal memuat data lifegroup Anda.';
      setError(errorMessage);
      console.error('Error fetching user lifegroups:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyLifeGroups();
  }, []);

  const handleRefresh = () => {
    fetchMyLifeGroups(true);
    showToast('Data berhasil diperbarui', 'success');
  };

  const getUserRole = (lifeGroup: LifeGroup, userId: string) => {
    // Check person members first (new structure)
    const personMember = lifeGroup.person_members?.find(m => 
      m.person?.id === userId || 
      (lifeGroup.leader_id === userId && m.position === 'LEADER') ||
      (lifeGroup.co_leader_id === userId && m.position === 'CO_LEADER')
    );
    if (personMember) {
      switch (personMember.position) {
        case 'LEADER': return 'leader';
        case 'CO_LEADER': return 'co_leader';
        case 'MEMBER': return 'member';
        default: return 'member';
      }
    }

    // Fallback to legacy members structure if exists
    const member = lifeGroup.members?.find(m => m.user_id === userId && m.is_active);
    return member?.role || null;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'leader':
        return <FiStar className='w-4 h-4 text-yellow-500' />;
      case 'co_leader':
        return <FiUserCheck className='w-4 h-4 text-blue-500' />;
      case 'member':
        return <FiUser className='w-4 h-4 text-gray-500' />;
      default:
        return <FiUser className='w-4 h-4 text-gray-500' />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'leader':
        return 'Pemimpin';
      case 'co_leader':
        return 'Wakil Pemimpin';
      case 'member':
        return 'Anggota';
      default:
        return 'Anggota';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'leader':
        return 'bg-yellow-100 text-yellow-800';
      case 'co_leader':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className='space-y-6'>
        <FeaturedCard
          title='My Lifegroup'
          description='Lihat informasi lifegroup yang Anda ikuti'
          actionLabel='Kembali ke Lifegroup'
          onAction={() => window.location.href = '/dashboard/lifegroup'}
          gradientFrom='from-purple-500'
          gradientTo='to-purple-700'
        />
        <div className='flex justify-center items-center py-10'>
          <div className='w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin'></div>
          <span className='ml-3 text-gray-600'>Memuat data lifegroup...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <FeaturedCard
          title='My Lifegroup'
          description='Lihat informasi lifegroup yang Anda ikuti'
          actionLabel='Kembali ke Lifegroup'
          onAction={() => window.location.href = '/dashboard/lifegroup'}
          gradientFrom='from-purple-500'
          gradientTo='to-purple-700'
        />
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
          <FiAlertTriangle className='w-12 h-12 text-red-400 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-red-800 mb-2'>Terjadi Kesalahan</h3>
          <p className='text-red-600 mb-4'>{error}</p>
          <motion.button
            onClick={handleRefresh}
            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center mx-auto'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={refreshing}
          >
            {refreshing ? (
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
            ) : (
              <FiRefreshCw className='w-4 h-4 mr-2' />
            )}
            Coba Lagi
          </motion.button>
        </div>
      </div>
    );
  }

  const currentUserId = getCurrentUserId();

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <FeaturedCard
          title='My Lifegroup'
          description='Lihat informasi lifegroup yang Anda ikuti'
          actionLabel='Kembali ke Lifegroup'
          onAction={() => window.location.href = '/dashboard/lifegroup'}
          gradientFrom='from-purple-500'
          gradientTo='to-purple-700'
        />
        <motion.button
          onClick={handleRefresh}
          className={`ml-4 p-2 rounded-lg border border-gray-300 hover:bg-gray-50 ${
            refreshing ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          whileHover={{ scale: refreshing ? 1 : 1.05 }}
          whileTap={{ scale: refreshing ? 1 : 0.95 }}
          disabled={refreshing}
          title='Refresh data'
        >
          <FiRefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Filter Section */}
      {lifeGroups.length > 0 && (
        <div className='bg-white rounded-xl shadow-sm p-4 border border-gray-200'>
          <div className='flex flex-wrap gap-2'>
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua ({lifeGroups.length})
            </button>
            {['leader', 'co_leader', 'member'].map(role => {
              const count = lifeGroups.filter(group => {
                const userRole = currentUserId ? getUserRole(group, currentUserId) : null;
                return userRole === role;
              }).length;
              
              if (count === 0) return null;
              
              return (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                    roleFilter === role 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getRoleIcon(role)}
                  <span className='ml-1'>{getRoleLabel(role)} ({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* My Lifegroups List */}
      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
        <h2 className='text-lg font-semibold mb-4 text-gray-900'>
          Lifegroup Saya
        </h2>
        
        {lifeGroups.length === 0 ? (
          <div className='text-center py-8'>
            <BsPeople className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>Belum Mengikuti Lifegroup</h3>
            <p className='text-gray-500 mb-4'>
              Anda belum terdaftar sebagai anggota di lifegroup manapun. 
              Hubungi admin untuk bergabung dengan lifegroup.
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {lifeGroups
              .filter(group => {
                if (roleFilter === 'all') return true;
                const userRole = currentUserId ? getUserRole(group, currentUserId) : null;
                return userRole === roleFilter;
              })
              .map((group, index) => {
                const userRole = currentUserId ? getUserRole(group, currentUserId) : null;
              
              return (
                <motion.div
                  key={group.id}
                  className='bg-purple-50 rounded-lg p-6 border border-purple-100'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className='flex items-start space-x-4'>
                    <div className='bg-purple-500 p-3 rounded-lg text-white'>
                      <BsPeople className='w-6 h-6' />
                    </div>
                    <div className='flex-1'>
                      <div className='flex justify-between items-start mb-2'>
                        <h3 className='text-xl font-semibold text-gray-900'>
                          {group.name}
                        </h3>
                        {userRole && (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(userRole)}`}>
                            {getRoleIcon(userRole)}
                            <span className='ml-1'>{getRoleLabel(userRole)}</span>
                          </span>
                        )}
                      </div>
                      
                      <div className='space-y-2 mb-3'>
                        <div className='flex items-center text-gray-600'>
                          <FiMapPin className='w-4 h-4 mr-2' />
                          <span>{group.location}</span>
                        </div>
                        <div className='flex items-center text-gray-600'>
                          <FiUser className='w-4 h-4 mr-2' />
                          <span>Pemimpin: {group.leader?.person?.nama || group.leader?.email || 'N/A'}</span>
                        </div>
                        {group.co_leader && (
                          <div className='flex items-center text-gray-600'>
                            <FiUserCheck className='w-4 h-4 mr-2' />
                            <span>Wakil Pemimpin: {group.co_leader?.person?.nama || group.co_leader?.email || 'N/A'}</span>
                          </div>
                        )}
                        <div className='flex items-center text-gray-600'>
                          <FiUsers className='w-4 h-4 mr-2' />
                          <span>
                            {(group.person_members?.filter(m => m.is_active).length || 0) + 
                             (group.visitor_members?.filter(m => m.is_active).length || 0) ||
                             (group.members?.filter(m => m.is_active).length || 0)} anggota aktif
                          </span>
                        </div>
                      </div>
                      
                      <div className='flex justify-between items-center'>
                        <div className='flex space-x-2'>
                          <span className='px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                            Aktif
                          </span>
                          <span className='px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                            {group.church?.name || 'N/A'}
                          </span>
                        </div>
                        <Link href={`/dashboard/lifegroup/${group.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm'
                          >
                            <FiUsers className='w-4 h-4 mr-2' />
                            Lihat Detail
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Role Summary */}
      {lifeGroups.length > 0 && (
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
          <h2 className='text-lg font-semibold mb-4 text-gray-900'>
            Ringkasan Peran Saya
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {['leader', 'co_leader', 'member'].map(role => {
              const count = lifeGroups.filter(group => {
                const userRole = currentUserId ? getUserRole(group, currentUserId) : null;
                return userRole === role;
              }).length;
              
              return (
                <div key={role} className={`p-4 rounded-lg ${getRoleBadgeColor(role).replace('text-', 'border-').replace('bg-', 'bg-opacity-10 border-')}`}>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      {getRoleIcon(role)}
                      <span className='font-medium text-gray-900'>{getRoleLabel(role)}</span>
                    </div>
                    <span className='text-2xl font-bold text-gray-900'>{count}</span>
                  </div>
                  <p className='text-sm text-gray-600 mt-1'>
                    {count === 1 ? 'Lifegroup' : 'Lifegroups'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link href='/dashboard/lifegroup/daftar' className='group block p-6 bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-purple-500 hover:-translate-y-1'>
            <div className='flex items-start space-x-4'>
              <div className='p-3 rounded-lg bg-purple-600 text-white transform group-hover:rotate-12 transition-transform duration-300'>
                <BsPeople className='w-6 h-6' />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors'>
                  Lifegroup Lainnya
                </h3>
                <p className='mt-1 text-sm text-gray-500'>
                  Lihat semua lifegroup yang tersedia
                </p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link href='/dashboard/lifegroup/kelola' className='group block p-6 bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-purple-500 hover:-translate-y-1'>
            <div className='flex items-start space-x-4'>
              <div className='p-3 rounded-lg bg-purple-700 text-white transform group-hover:rotate-12 transition-transform duration-300'>
                <BsCalendarEvent className='w-6 h-6' />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors'>
                  Kelola Lifegroup
                </h3>
                <p className='mt-1 text-sm text-gray-500'>
                  Kelola lifegroup sebagai PIC
                </p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className='group block p-6 bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-purple-500 hover:-translate-y-1'>
            <div className='flex items-start space-x-4'>
              <div className='p-3 rounded-lg bg-purple-800 text-white transform group-hover:rotate-12 transition-transform duration-300'>
                <BsPersonCircle className='w-6 h-6' />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors'>
                  Profil Saya
                </h3>
                <p className='mt-1 text-sm text-gray-500'>
                  Lihat informasi profil lengkap
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
        <h2 className='text-lg font-semibold mb-4 text-gray-900'>
          Aktivitas Terbaru
        </h2>
        <div className='space-y-4'>
          <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
            <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
            <div className='flex-1'>
              <p className='text-sm font-medium text-gray-900'>
                Pertemuan Lifegroup - Rabu, 28 Feb 2024
              </p>
              <p className='text-xs text-gray-500'>
                Pembahasan: "Kasih yang Sejati"
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
            <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
            <div className='flex-1'>
              <p className='text-sm font-medium text-gray-900'>
                Pertemuan Lifegroup - Rabu, 21 Feb 2024
              </p>
              <p className='text-xs text-gray-500'>
                Pembahasan: "Iman dan Perbuatan"
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
            <div className='w-2 h-2 bg-purple-300 rounded-full'></div>
            <div className='flex-1'>
              <p className='text-sm font-medium text-gray-900'>
                Pertemuan Lifegroup - Rabu, 14 Feb 2024
              </p>
              <p className='text-xs text-gray-500'>
                Pembahasan: "Pengampunan"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}