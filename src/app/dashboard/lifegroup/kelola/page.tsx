'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUserPlus,
  FiCalendar,
  FiMapPin,
} from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

interface LifeGroup {
  id: string;
  nama: string;
  deskripsi: string;
  lokasi: string;
  jadwal: string;
  jumlah_anggota: number;
  pemimpin: string;
  status: 'aktif' | 'tidak_aktif';
}

export default function LifeGroupPage() {
  const [lifeGroups, setLifeGroups] = useState<LifeGroup[]>([
    {
      id: '1',
      nama: 'Life Group Alpha',
      deskripsi: 'Life Group untuk pemuda dan mahasiswa',
      lokasi: 'Rumah Pak Budi',
      jadwal: 'Setiap Rabu, 19:00 WIB',
      jumlah_anggota: 12,
      pemimpin: 'John Doe',
      status: 'aktif',
    },
    // Tambahkan data dummy lainnya di sini
  ]);

  return (
    <div className='space-y-6 pb-16'>
      <FeaturedCard
        title='Kelola Life Group'
        description='Kelola dan pantau perkembangan life group Anda'
        actionLabel='Buat Life Group Baru'
        gradientFrom='from-emerald-500'
        gradientTo='to-emerald-700'
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {lifeGroups.map((group) => (
          <motion.div
            key={group.id}
            className='bg-white rounded-xl shadow-md p-6 border border-emerald-50'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900'>
                  {group.nama}
                </h3>
                <p className='text-sm text-gray-500'>{group.deskripsi}</p>
              </div>
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

            <div className='space-y-3'>
              <div className='flex items-center text-sm text-gray-600'>
                <FiMapPin className='w-4 h-4 mr-2' />
                <span>{group.lokasi}</span>
              </div>
              <div className='flex items-center text-sm text-gray-600'>
                <FiCalendar className='w-4 h-4 mr-2' />
                <span>{group.jadwal}</span>
              </div>
              <div className='flex items-center text-sm text-gray-600'>
                <FiUsers className='w-4 h-4 mr-2' />
                <span>{group.jumlah_anggota} anggota</span>
              </div>
            </div>

            <div className='mt-6 flex justify-between items-center'>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  group.status === 'aktif'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {group.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700'
              >
                <FiUserPlus className='w-4 h-4 mr-2' />
                Tambah Anggota
              </motion.button>
            </div>
          </motion.div>
        ))}

        {/* Card untuk membuat Life Group baru */}
        <motion.div
          className='bg-white rounded-xl shadow-md p-6 border-2 border-dashed border-emerald-200 hover:border-emerald-400 cursor-pointer'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className='flex flex-col items-center justify-center h-full text-emerald-600'>
            <FiPlus className='w-12 h-12 mb-4' />
            <h3 className='text-lg font-semibold'>Buat Life Group Baru</h3>
            <p className='text-sm text-gray-500 text-center mt-2'>
              Klik untuk membuat life group baru
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
