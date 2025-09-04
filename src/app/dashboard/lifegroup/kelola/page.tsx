'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUserPlus,
  FiUserMinus,
  FiMapPin,
  FiUser,
  FiRefreshCw,
  FiAlertTriangle,
} from 'react-icons/fi';
import Link from 'next/link';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { getCurrentUserId, getCurrentUserLifegroupPermissions } from '@/lib/helper';
import { useToast } from '@/context/ToastContext';
import { lifeGroupApi, type LifeGroup } from '@/lib/lifegroup';
import LifegroupPICGuard from '@/components/auth/LifegroupPICGuard';

export default function LifeGroupPage() {
  const { showToast } = useToast();
  const [lifeGroups, setLifeGroups] = useState<LifeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserLifeGroups = async (isRefresh = false) => {
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

      const permissions = getCurrentUserLifegroupPermissions();
      console.log('User lifegroup permissions for kelola:', permissions); // Debug log
      
      if (!permissions || permissions.churches.length === 0) {
        setError('Anda tidak memiliki akses sebagai PIC Lifegroup. Silakan hubungi administrator untuk mendapatkan akses.');
        console.error('User is not PIC of any lifegroup pelayanan');
        return;
      }

      // First try to get user's lifegroups
      let userLifeGroups: LifeGroup[] = [];
      try {
        userLifeGroups = await lifeGroupApi.getByUser(userId) || [];
        console.log('User lifegroups:', userLifeGroups);
      } catch (userError: any) {
        console.error('Error fetching user lifegroups:', userError);
      }

      // If user has no direct lifegroups, show all lifegroups from churches they manage as PIC
      if (userLifeGroups.length === 0) {
        const allManagedLifeGroups: LifeGroup[] = [];
        
        for (const church of permissions.churches) {
          try {
            console.log('Fetching managed lifegroups for church:', church.id, church.name);
            const data = await lifeGroupApi.getByChurch(church.id);
            if (data && data.length > 0) {
              allManagedLifeGroups.push(...data);
            }
          } catch (churchError: any) {
            console.error(`Error fetching lifegroups for church ${church.name}:`, churchError);
          }
        }
        
        setLifeGroups(allManagedLifeGroups);
        console.log('Using managed lifegroups:', allManagedLifeGroups);
      } else {
        setLifeGroups(userLifeGroups);
      }
      
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
    fetchUserLifeGroups();
  }, []);

  const handleRefresh = () => {
    fetchUserLifeGroups(true);
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

  const canManageMembers = (lifeGroup: LifeGroup, userId: string) => {
    const role = getUserRole(lifeGroup, userId);
    return role === 'leader' || role === 'co_leader';
  };

  const renderHeader = () => (
    <div className='flex justify-between items-center'>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <FeaturedCard
          title='Kelola Life Group'
          description='Kelola dan pantau perkembangan life group sebagai PIC Lifegroup'
          actionLabel='Refresh Data'
          gradientFrom='from-emerald-500'
          gradientTo='to-emerald-700'
        />
        <Link href='/dashboard/lifegroup/tambah' className="mt-4 sm:mt-0 sm:ml-4">
          <motion.button
            className='px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiPlus className='w-4 h-4 mr-2' />
            Buat Life Group Baru
          </motion.button>
        </Link>
      </div>
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
  );

  if (loading) {
    return (
      <div className='space-y-6'>
        {renderHeader()}
        <div className='flex justify-center items-center py-10'>
          <div className='w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin'></div>
          <span className='ml-3 text-gray-600'>Memuat data life group...</span>
        </div>
      </div>
    );
  }

  const renderError = () => (
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
  );

  const currentUserId = getCurrentUserId();

  return (
    <LifegroupPICGuard>
      <div className='space-y-6 pb-16'>
        {renderHeader()}
        
        {error && renderError()}

        {!error && (
        lifeGroups.length === 0 ? (
          <div className='bg-white rounded-xl shadow-md p-8 text-center border border-gray-100'>
            <FiUsers className='mx-auto text-5xl text-gray-400 mb-4' />
            <h3 className='text-lg font-semibold text-gray-700 mb-2'>Belum Ada Life Group</h3>
            <p className='text-gray-500 mb-6'>
              Sebagai PIC Lifegroup, Anda belum memiliki atau mengelola life group manapun. 
              Mulai dengan membuat life group baru untuk membangun komunitas!
            </p>
            <Link href='/dashboard/lifegroup/tambah'>
              <motion.button
                className='px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center mx-auto'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className='w-5 h-5 mr-2' />
                Buat Life Group Baru
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {lifeGroups.map((group, index) => {
              const userRole = currentUserId ? getUserRole(group, currentUserId) : null;
              const canManage = currentUserId ? canManageMembers(group, currentUserId) : false;

              return (
                <motion.div
                key={group.id}
                className='bg-white rounded-xl shadow-md p-6 border border-emerald-50'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      {group.name}
                    </h3>
                    <p className='text-xs text-emerald-600 font-medium uppercase'>
                      {userRole === 'leader' && 'Pemimpin'}
                      {userRole === 'co_leader' && 'Wakil Pemimpin'}
                      {userRole === 'member' && 'Anggota'}
                    </p>
                  </div>
                  {canManage && (
                    <div className='flex space-x-2'>
                      <Link href={`/dashboard/lifegroup/${group.id}/edit`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className='p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg'
                        >
                          <FiEdit2 className='w-5 h-5' />
                        </motion.button>
                      </Link>
                    </div>
                  )}
                </div>

                <div className='space-y-3'>
                  <div className='flex items-center text-sm text-gray-600'>
                    <FiMapPin className='w-4 h-4 mr-2' />
                    <span>{group.location}</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <FiUser className='w-4 h-4 mr-2' />
                    <span>Pemimpin: {group.leader?.person?.nama || group.leader?.email || 'N/A'}</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <FiUsers className='w-4 h-4 mr-2' />
                    <span>
                      {(group.person_members?.filter(m => m.is_active).length || 0) + 
                       (group.visitor_members?.filter(m => m.is_active).length || 0) ||
                       (group.members?.filter(m => m.is_active).length || 0)} anggota
                    </span>
                  </div>
                </div>

                <div className='mt-6 flex justify-between items-center'>
                  <span className='px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800'>
                    Aktif
                  </span>
                  <div className='flex space-x-2'>
                    <Link href={`/dashboard/lifegroup/${group.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className='flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm'
                      >
                        <FiUsers className='w-4 h-4 mr-2' />
                        Lihat Detail
                      </motion.button>
                    </Link>
                    {canManage && (
                      <Link href={`/dashboard/lifegroup/${group.id}/anggota`}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className='flex items-center px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm'
                        >
                          <FiUserPlus className='w-4 h-4 mr-2' />
                          Kelola Anggota
                        </motion.button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
              );
            })}

            {/* Card untuk membuat Life Group baru - hanya tampil jika user memiliki permission */}
            <motion.div
              className='bg-white rounded-xl shadow-md p-6 border-2 border-dashed border-emerald-200 hover:border-emerald-400 cursor-pointer'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href='/dashboard/lifegroup/tambah'>
                <div className='flex flex-col items-center justify-center h-full text-emerald-600'>
                  <FiPlus className='w-12 h-12 mb-4' />
                  <h3 className='text-lg font-semibold'>Buat Life Group Baru</h3>
                  <p className='text-sm text-gray-500 text-center mt-2'>
                    Klik untuk membuat life group baru
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>
        )
      )}
      </div>
    </LifegroupPICGuard>
  );
}
