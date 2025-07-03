'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { BsCalendarWeek, BsPeople, BsPersonPlus } from 'react-icons/bs';
import { FiEdit2, FiTrash2, FiUserCheck, FiUsers } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

// Data dummy untuk contoh
const dummyData = [
  {
    id: '1',
    nama: 'Life Group Alpha',
    lokasi: 'Rumah Pdt. John Doe',
    jadwal: 'Setiap Rabu, 19:00 WIB',
    jumlahAnggota: 12,
    pembina: 'Pdt. John Doe',
    deskripsi:
      'Life Group untuk keluarga muda dengan fokus pada pengembangan karakter dan pertumbuhan rohani.',
    status: 'Aktif' as const,
  },
  {
    id: '2',
    nama: 'Life Group Beta',
    lokasi: 'Rumah Pdt. Jane Smith',
    jadwal: 'Setiap Kamis, 19:00 WIB',
    jumlahAnggota: 8,
    pembina: 'Pdt. Jane Smith',
    deskripsi:
      'Life Group untuk mahasiswa dan profesional muda dengan fokus pada pengembangan kepemimpinan.',
    status: 'Aktif' as const,
  },
  {
    id: '3',
    nama: 'Life Group Gamma',
    lokasi: 'Rumah Pdt. Mike Johnson',
    jadwal: 'Setiap Jumat, 19:00 WIB',
    jumlahAnggota: 15,
    pembina: 'Pdt. Mike Johnson',
    deskripsi:
      'Life Group untuk keluarga dengan anak-anak, fokus pada pengembangan keluarga Kristen.',
    status: 'Tidak Aktif' as const,
  },
];

export default function DaftarLifegroupPage() {
  const [lifeGroups, setLifeGroups] = React.useState(dummyData);

  const handleAdd = () => {
    // TODO: Implementasi tambah life group
    console.log('Tambah life group');
  };

  const handleEdit = (lifeGroup: (typeof dummyData)[0]) => {
    // TODO: Implementasi edit life group
    console.log('Edit life group:', lifeGroup);
  };

  const handleDelete = (id: string) => {
    // TODO: Implementasi hapus life group
    console.log('Hapus life group:', id);
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

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {lifeGroups.map((lifeGroup, index) => (
            <motion.div
              key={lifeGroup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className='bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md border border-emerald-50'>
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

                <div className='mt-4 space-y-2'>
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
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center text-sm text-gray-500'>
                      <span>{lifeGroup.lokasi}</span>
                    </div>
                    <div className='flex space-x-2'>
                      <button
                        onClick={() => handleEdit(lifeGroup)}
                        className='p-2 text-gray-400 hover:text-emerald-600 transition-colors'
                      >
                        <FiEdit2 className='w-5 h-5' />
                      </button>
                      <button
                        onClick={() => handleDelete(lifeGroup.id)}
                        className='p-2 text-gray-400 hover:text-red-600 transition-colors'
                      >
                        <FiTrash2 className='w-5 h-5' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
