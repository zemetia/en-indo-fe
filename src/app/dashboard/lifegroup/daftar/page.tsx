'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { BsCalendarWeek, BsPeople, BsPersonPlus } from 'react-icons/bs';
import { FiUserCheck, FiUsers, FiMapPin, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { getLifegroupChurchIds, getCurrentUserLifegroupPermissions } from '@/lib/helper';
import { lifeGroupApi, type LifeGroup, type BatchChurchLifeGroupsResponse, deduplicateLifeGroups } from '@/lib/lifegroup';
import LifegroupPICGuard from '@/components/auth/LifegroupPICGuard';

export default function DaftarLifegroupPage() {
  const router = useRouter();
  const [lifeGroups, setLifeGroups] = React.useState<LifeGroup[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);


  const fetchLifeGroups = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const permissions = getCurrentUserLifegroupPermissions();
      console.log('User lifegroup permissions:', permissions);
      
      if (!permissions || permissions.churches.length === 0) {
        setError('Anda tidak memiliki akses sebagai PIC Lifegroup. Silakan hubungi administrator untuk mendapatkan akses.');
        return;
      }

      const churchIds = permissions.churches.map(church => church.id);
      
      // Try batch API first, fallback to parallel individual calls
      try {
        console.log('Fetching lifegroups via batch API for churches:', churchIds);
        const batchResponse = await lifeGroupApi.getByMultipleChurches(churchIds);
        
        // Flatten all lifegroups from successful responses
        const allLifeGroups: LifeGroup[] = [];
        let hasErrors = false;
        
        for (const churchResponse of batchResponse) {
          if (churchResponse.error) {
            console.error(`Error from church ${churchResponse.church_name}:`, churchResponse.error);
            hasErrors = true;
          } else {
            console.log(`Church ${churchResponse.church_name} returned ${churchResponse.lifegroups.length} lifegroups:`, 
              churchResponse.lifegroups.map(lg => ({ id: lg.id, name: lg.name })));
            allLifeGroups.push(...churchResponse.lifegroups);
          }
        }
        
        if (hasErrors && allLifeGroups.length === 0) {
          throw new Error('No lifegroups could be loaded from any churches');
        }
        
        console.log('Before deduplication - total lifegroups:', allLifeGroups.length);
        console.log('Received total lifegroups data via batch API:', allLifeGroups.map(lg => ({ id: lg.id, name: lg.name })));
        
        const deduplicatedLifeGroups = deduplicateLifeGroups(allLifeGroups);
        console.log(`Batch API deduplication result: ${allLifeGroups.length} → ${deduplicatedLifeGroups.length} lifegroups`);
        console.log('After deduplication - unique lifegroups:', deduplicatedLifeGroups.map(lg => ({ id: lg.id, name: lg.name })));
        setLifeGroups(deduplicatedLifeGroups);
        
      } catch (batchError: any) {
        console.warn('Batch API failed, falling back to parallel individual calls:', batchError.message);
        
        // Fallback: Parallel individual API calls
        const fetchPromises = permissions.churches.map(async (church) => {
          try {
            console.log('Fetching lifegroups for church:', church.id, church.name);
            const data = await lifeGroupApi.getByChurch(church.id);
            return data || [];
          } catch (churchError: any) {
            console.error(`Error fetching lifegroups for church ${church.name}:`, churchError);
            return [];
          }
        });
        
        const results = await Promise.all(fetchPromises);
        console.log('Individual church results:', results.map((result, index) => ({
          church: permissions.churches[index].name,
          lifegroups: result.map(lg => ({ id: lg.id, name: lg.name }))
        })));
        
        const allLifeGroups = results.flat();
        console.log('Before deduplication - total lifegroups:', allLifeGroups.length);
        console.log('Received total lifegroups data via parallel calls:', allLifeGroups.map(lg => ({ id: lg.id, name: lg.name })));
        
        const deduplicatedLifeGroups = deduplicateLifeGroups(allLifeGroups);
        console.log(`Parallel API deduplication result: ${allLifeGroups.length} → ${deduplicatedLifeGroups.length} lifegroups`);
        console.log('After deduplication - unique lifegroups:', deduplicatedLifeGroups.map(lg => ({ id: lg.id, name: lg.name })));
        setLifeGroups(deduplicatedLifeGroups);
      }
      
    } catch (err: any) {
      console.error('Error fetching lifegroups:', err);
      
      if (err.response?.status === 401) {
        setError('Sesi Anda telah berakhir. Silakan login kembali.');
      } else if (err.response?.status === 403) {
        setError('Anda tidak memiliki akses sebagai PIC Lifegroup.');
      } else {
        const errorMessage = err.response?.data?.message || 'Gagal memuat data lifegroup. Silakan coba lagi.';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchLifeGroups();
  }, []);

  const handleRefresh = () => {
    fetchLifeGroups(true);
  };

  const handleAdd = () => {
    router.push('/dashboard/lifegroup/tambah');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className='flex justify-center items-center py-10'>
          <div className='w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin'></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
          <div className='text-red-400 text-4xl mb-4'>⚠️</div>
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
            {refreshing ? 'Memuat...' : 'Coba Lagi'}
          </motion.button>
        </div>
      );
    }

    if (lifeGroups.length === 0) {
      return (
        <div className='text-center py-10'>
          <BsPeople className='mx-auto text-4xl text-gray-400 mb-4' />
          <h3 className='text-lg font-semibold text-gray-700 mb-2'>Belum Ada Lifegroup</h3>
          <p className='text-gray-500 mb-4'>
            Belum ada lifegroup yang terdaftar di gereja-gereja yang Anda kelola sebagai PIC Lifegroup.
          </p>
          <p className='text-sm text-gray-400'>
            Mulai dengan membuat lifegroup baru untuk membangun komunitas.
          </p>
        </div>
      );
    }

    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {lifeGroups.map((lifeGroup, index) => (
          <motion.div
            key={lifeGroup.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-full"
          >
            <Link href={`/dashboard/lifegroup/${lifeGroup.id}`} className='block h-full'>
              <div className='bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md border border-emerald-50 h-full flex flex-col'>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 rounded-lg bg-emerald-600 text-white'>
                    <BsPeople className='w-6 h-6' />
                  </div>
                  <div className='flex-1'>
                    <div className='flex justify-between items-start'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        {lifeGroup.name}
                      </h3>
                      <span className='px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700'>
                        Aktif
                      </span>
                    </div>
                    <p className='mt-1 text-sm text-gray-500 line-clamp-2'>
                      Kelompok Sel: {lifeGroup.name}
                    </p>
                  </div>
                </div>

                <div className='mt-4 space-y-2 flex-grow'>
                  <div className='flex items-center text-sm text-gray-500'>
                    <FiUsers className='w-4 h-4 mr-2' />
                    <span>
                      {(lifeGroup.person_members?.filter(m => m.is_active).length || 0) + 
                       (lifeGroup.visitor_members?.filter(m => m.is_active).length || 0) ||
                       (lifeGroup.members?.filter(m => m.is_active).length || 0)} Anggota
                    </span>
                  </div>
                  <div className='flex items-center text-sm text-gray-500'>
                    <FiUserCheck className='w-4 h-4 mr-2' />
                    <span>Pemimpin: {lifeGroup.leader?.person?.nama || lifeGroup.leader?.email || 'N/A'}</span>
                  </div>
                  {lifeGroup.co_leader && (
                    <div className='flex items-center text-sm text-gray-500'>
                      <FiUserCheck className='w-4 h-4 mr-2' />
                      <span>Wakil: {lifeGroup.co_leader?.person?.nama || lifeGroup.co_leader?.email || 'N/A'}</span>
                    </div>
                  )}
                </div>

                <div className='mt-4 border-t border-emerald-50 pt-4'>
                  <div className='flex items-center text-sm text-gray-500'>
                    <FiMapPin className='w-4 h-4 mr-2' />
                    <span>{lifeGroup.location}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <LifegroupPICGuard>
      <div className='space-y-6'>
        <FeaturedCard
          title='Daftar Lifegroup'
          description='Kelola semua lifegroup yang tersedia sebagai PIC Lifegroup'
          actionLabel='Kembali ke Dashboard'
          gradientFrom='from-emerald-500'
          gradientTo='to-emerald-700'
        />

        <div className='bg-white rounded-xl shadow-sm p-6 border border-emerald-50'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Daftar Lifegroup
            </h2>
            <div className='flex space-x-2'>
              <motion.button
                onClick={handleRefresh}
                className={`p-2 rounded-lg border border-gray-300 hover:bg-gray-50 ${
                  refreshing ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                whileHover={{ scale: refreshing ? 1 : 1.05 }}
                whileTap={{ scale: refreshing ? 1 : 0.95 }}
                disabled={refreshing}
                title='Refresh data'
              >
                <FiRefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </motion.button>
              <button
                onClick={handleAdd}
                className='bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2'
                disabled={loading || refreshing}
              >
                <BsPersonPlus className='w-5 h-5' />
                <span>Tambah Lifegroup</span>
              </button>
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </LifegroupPICGuard>
  );
}
