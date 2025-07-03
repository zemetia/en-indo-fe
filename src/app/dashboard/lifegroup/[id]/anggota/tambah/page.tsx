'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiUserPlus,
  FiSearch,
  FiSave,
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
} from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

interface Jemaat {
  id: string;
  nama: string;
  email: string;
  nomor_telepon: string;
}

export default function TambahAnggotaPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJemaat, setSelectedJemaat] = useState<Jemaat | null>(null);
  const [jemaatList, setJemaatList] = useState<Jemaat[]>([
    {
      id: '1',
      nama: 'John Doe',
      email: 'john@example.com',
      nomor_telepon: '081234567890',
    },
    // Tambahkan data dummy lainnya di sini
  ]);

  const filteredJemaat = jemaatList.filter((j) =>
    j.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJemaat) return;

    // TODO: Implementasi API call untuk menambah anggota
    console.log('Selected jemaat:', selectedJemaat);
    router.push(`/dashboard/lifegroup/${params.id}/anggota`);
  };

  return (
    <div className='space-y-6 pb-16'>
      <FeaturedCard
        title='Tambah Anggota Life Group'
        description='Tambahkan anggota baru ke life group Anda'
        actionLabel='Kembali ke Daftar Anggota'
        gradientFrom='from-emerald-500'
        gradientTo='to-emerald-700'
      />

      <motion.form
        onSubmit={handleSubmit}
        className='bg-white rounded-xl shadow-md p-6 border border-emerald-50'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Search Bar */}
        <div className='mb-6'>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <FiSearch className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              placeholder='Cari jemaat...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
            />
          </div>
        </div>

        {/* Jemaat List */}
        <div className='space-y-4 mb-6'>
          {filteredJemaat.map((jemaat) => (
            <motion.div
              key={jemaat.id}
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                selectedJemaat?.id === jemaat.id
                  ? 'bg-emerald-50 border-2 border-emerald-500'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedJemaat(jemaat)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className='flex items-center space-x-4'>
                <div className='bg-emerald-100 p-2 rounded-full'>
                  <FiUser className='w-5 h-5 text-emerald-600' />
                </div>
                <div>
                  <h3 className='font-medium text-gray-900'>{jemaat.nama}</h3>
                  <div className='flex items-center space-x-4 text-sm text-gray-500'>
                    <span className='flex items-center'>
                      <FiMail className='w-4 h-4 mr-1' />
                      {jemaat.email}
                    </span>
                    <span className='flex items-center'>
                      <FiPhone className='w-4 h-4 mr-1' />
                      {jemaat.nomor_telepon}
                    </span>
                  </div>
                </div>
              </div>
              {selectedJemaat?.id === jemaat.id && (
                <div className='text-emerald-600'>
                  <FiUserPlus className='w-5 h-5' />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Tombol Aksi */}
        <div className='flex justify-end space-x-4'>
          <motion.button
            type='button'
            onClick={() =>
              router.push(`/dashboard/lifegroup/${params.id}/anggota`)
            }
            className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiArrowLeft className='w-4 h-4 mr-2' />
            Kembali
          </motion.button>
          <motion.button
            type='submit'
            disabled={!selectedJemaat}
            className={`px-4 py-2 rounded-lg flex items-center ${
              selectedJemaat
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={{ scale: selectedJemaat ? 1.02 : 1 }}
            whileTap={{ scale: selectedJemaat ? 0.98 : 1 }}
          >
            <FiSave className='w-4 h-4 mr-2' />
            Tambah Anggota
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
