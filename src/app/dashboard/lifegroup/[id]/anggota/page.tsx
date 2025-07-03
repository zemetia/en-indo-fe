'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiUserPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiArrowLeft,
} from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

interface Anggota {
  id: string;
  nama: string;
  email: string;
  nomor_telepon: string;
  status: 'aktif' | 'tidak_aktif';
  tanggal_bergabung: string;
}

export default function KelolaAnggotaPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [anggota, setAnggota] = useState<Anggota[]>([
    {
      id: '1',
      nama: 'John Doe',
      email: 'john@example.com',
      nomor_telepon: '081234567890',
      status: 'aktif',
      tanggal_bergabung: '2024-01-01',
    },
    // Tambahkan data dummy lainnya di sini
  ]);

  const filteredAnggota = anggota.filter((a) =>
    a.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='space-y-6 pb-16'>
      <FeaturedCard
        title='Kelola Anggota Life Group'
        description='Kelola anggota life group Anda'
        actionLabel='Kembali ke Life Group'
        gradientFrom='from-emerald-500'
        gradientTo='to-emerald-700'
      />

      <div className='bg-white rounded-xl shadow-md p-6 border border-emerald-50'>
        {/* Search Bar */}
        <div className='mb-6'>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <FiSearch className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              placeholder='Cari anggota...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
            />
          </div>
        </div>

        {/* Anggota List */}
        <div className='space-y-4'>
          {filteredAnggota.map((a) => (
            <motion.div
              key={a.id}
              className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className='flex items-center space-x-4'>
                <div className='bg-emerald-100 p-2 rounded-full'>
                  <FiUsers className='w-5 h-5 text-emerald-600' />
                </div>
                <div>
                  <h3 className='font-medium text-gray-900'>{a.nama}</h3>
                  <p className='text-sm text-gray-500'>{a.email}</p>
                </div>
              </div>
              <div className='flex items-center space-x-4'>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    a.status === 'aktif'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {a.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                </span>
                <div className='flex space-x-2'>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg'
                  >
                    <FiEdit2 className='w-5 h-5' />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='p-2 text-red-600 hover:bg-red-50 rounded-lg'
                  >
                    <FiTrash2 className='w-5 h-5' />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tombol Aksi */}
        <div className='mt-8 flex justify-between items-center'>
          <motion.button
            onClick={() => router.push('/dashboard/lifegroup')}
            className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiArrowLeft className='w-4 h-4 mr-2' />
            Kembali
          </motion.button>
          <motion.button
            className='px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiUserPlus className='w-4 h-4 mr-2' />
            Tambah Anggota
          </motion.button>
        </div>
      </div>
    </div>
  );
}
