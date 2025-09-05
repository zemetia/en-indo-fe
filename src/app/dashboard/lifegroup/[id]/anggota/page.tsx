'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiAlertTriangle,
  FiUsers,
  FiRefreshCw
} from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import MemberTabView from '@/components/dashboard/MemberTabView';
import { lifeGroupApi, LifeGroup } from '@/lib/lifegroup';
import { getCurrentUserId, canManageLifeGroup } from '@/lib/helper';
import { useToast } from '@/context/ToastContext';
import LifegroupPICGuard from '@/components/auth/LifegroupPICGuard';

export default function KelolaAnggotaPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params?.id as string;
  
  const [lifeGroup, setLifeGroup] = useState<LifeGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [canManageMembers, setCanManageMembers] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchLifeGroup();
  }, [id]);

  const fetchLifeGroup = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const data = await lifeGroupApi.getById(id);
      setLifeGroup(data);
      
      // Check if current user can manage members
      const userId = getCurrentUserId();
      if (userId) {
        setCanManageMembers(canManageLifeGroup(data, userId));
      }
    } catch (error: any) {
      console.error('Error fetching lifegroup:', error);
      if (error.response?.status === 404) {
        setError('Lifegroup tidak ditemukan.');
      } else if (error.response?.status === 403) {
        setError('Anda tidak memiliki akses untuk melihat anggota lifegroup ini.');
      } else {
        setError('Gagal memuat data lifegroup. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchLifeGroup(true);
    showToast('Data berhasil diperbarui', 'success');
  };

  if (loading) {
    return (
      <LifegroupPICGuard>
        <div className='space-y-6 pb-16'>
          <FeaturedCard
            title='Kelola Anggota Life Group'
            description='Kelola anggota life group Anda'
            actionLabel='Kembali ke Life Group'
            gradientFrom='from-emerald-500'
            gradientTo='to-emerald-700'
          />
          <div className='flex justify-center items-center py-10'>
            <div className='w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin'></div>
            <span className='ml-3 text-gray-600'>Memuat data...</span>
          </div>
        </div>
      </LifegroupPICGuard>
    );
  }

  if (error || !lifeGroup) {
    return (
      <LifegroupPICGuard>
        <div className='space-y-6 pb-16'>
          <FeaturedCard
            title='Kelola Anggota Life Group'
            description='Kelola anggota life group Anda'
            actionLabel='Kembali ke Life Group'
            gradientFrom='from-emerald-500'
            gradientTo='to-emerald-700'
          />
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
            <FiAlertTriangle className='w-12 h-12 text-red-400 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-red-800 mb-2'>Terjadi Kesalahan</h3>
            <p className='text-red-600 mb-4'>{error || 'Data lifegroup tidak ditemukan'}</p>
            <div className='flex justify-center space-x-3'>
              <motion.button
                onClick={handleRefresh}
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center'
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
              <motion.button
                onClick={() => router.push('/dashboard/lifegroup/kelola')}
                className='px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiArrowLeft className='w-4 h-4 mr-2' />
                Kembali
              </motion.button>
            </div>
          </div>
        </div>
      </LifegroupPICGuard>
    );
  }

  return (
    <LifegroupPICGuard>
      <div className='space-y-6 pb-16'>
        <div className='flex justify-between items-center'>
          <FeaturedCard
            title={`Kelola Anggota: ${lifeGroup.name}`}
            description={`Kelola anggota lifegroup di ${lifeGroup.location}`}
            actionLabel='Kembali ke Detail Life Group'
            gradientFrom='from-emerald-500'
            gradientTo='to-emerald-700'
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

        <div className='bg-white rounded-xl shadow-md p-6 border border-emerald-50'>
          <div className='flex justify-between items-center mb-6'>
            <div className='flex items-center space-x-3'>
              <div className='p-3 rounded-lg bg-emerald-600 text-white'>
                <FiUsers className='w-6 h-6' />
              </div>
              <div>
                <h2 className='text-xl font-semibold text-gray-900'>
                  Anggota Life Group
                </h2>
                <p className='text-sm text-gray-600'>
                  Kelola anggota person dan pengunjung
                </p>
              </div>
            </div>
            <motion.button
              onClick={() => router.push(`/dashboard/lifegroup/${id}`)}
              className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiArrowLeft className='w-4 h-4 mr-2' />
              Kembali ke Detail
            </motion.button>
          </div>

          {!canManageMembers && (
            <div className='mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
              <div className='flex items-center'>
                <FiAlertTriangle className='w-5 h-5 text-yellow-500 mr-2' />
                <p className='text-yellow-800 text-sm'>
                  Anda hanya dapat melihat daftar anggota. Hanya pemimpin dan wakil pemimpin yang dapat mengelola anggota.
                </p>
              </div>
            </div>
          )}

          <MemberTabView
            lifeGroupId={id}
            lifeGroupChurchId={lifeGroup.church_id}
            canManageMembers={canManageMembers}
          />
        </div>
      </div>
    </LifegroupPICGuard>
  );
}