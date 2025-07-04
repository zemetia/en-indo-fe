'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { BsCalendarWeek, BsPeople, BsPersonPlus } from 'react-icons/bs';
import { FiUserCheck, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import Link from 'next/link';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { getToken } from '@/lib/helper';

interface LifeGroup {
  id: string;
  nama: string;
  lokasi: string;
  jadwal: string;
  jumlahAnggota: number;
  pembina: string;
  deskripsi: string;
  status: 'Aktif' | 'Tidak Aktif';
}

export default function DaftarLifegroupPage() {
  const [lifeGroups, setLifeGroups] = React.useState<LifeGroup[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchLifeGroups = async () => {
      setLoading(true);
      try {
        const token = getToken();
        if (!token) {
          setError('Akses ditolak. Silakan login kembali.');
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/lifegroup`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLifeGroups(response.data.data);
      } catch (err) {
        setError('Gagal memuat data lifegroup.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLifeGroups();
  }, []);

  const handleAdd = () => {
    // TODO: Implementasi tambah life group
    console.log('Tambah life group');
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
      return <p className='text-center text-red-500'>{error}</p>;
    }

    if (lifeGroups.length === 0) {
      return (
        <div className='text-center py-10'>
          <BsPeople className='mx-auto text-4xl text-gray-400 mb-2' />
          <p>Tidak ada data lifegroup ditemukan.</p>
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
                        {lifeGroup.nama}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lifeGroup.status === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {lifeGroup.status}
                      </span>
                    </div>
                    <p className='mt-1 text-sm text-gray-500 line-clamp-2'>
                      {lifeGroup.deskripsi}
                    </p>
                  </div>
                </div>

                <div className='mt-4 space-y-2 flex-grow'>
                  <div className='flex items-center text-sm text-gray-500'>
                    <FiUsers className='w-4 h-4 mr-2' />
                    <span>{lifeGroup.jumlahAnggota} Anggota</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-500'>
                    <BsCalendarWeek className='w-4 h-4 mr-2' />
                    <span>{lifeGroup.jadwal}</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-500'>
                    <FiUserCheck className='w-4 h-4 mr-2' />
                    <span>{lifeGroup.pembina}</span>
                  </div>
                </div>

                <div className='mt-4 border-t border-emerald-50 pt-4'>
                  <div className='flex items-center text-sm text-gray-500'>
                    <span>{lifeGroup.lokasi}</span>
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
    <div className='space-y-6'>
      <FeaturedCard
        title='Daftar Lifegroup'
        description='Kelola semua lifegroup yang tersedia'
        actionLabel='Kembali ke Dashboard'
        gradientFrom='from-emerald-500'
        gradientTo='to-emerald-700'
      />

      <div className='bg-white rounded-xl shadow-sm p-6 border border-emerald-50'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Daftar Lifegroup
          </h2>
          <button
            onClick={handleAdd}
            className='bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2'
          >
            <BsPersonPlus className='w-5 h-5' />
            <span>Tambah Lifegroup</span>
          </button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
