'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiMapPin,
  FiCalendar,
  FiSave,
  FiArrowLeft,
} from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

interface LifeGroup {
  id: string;
  nama: string;
  deskripsi: string;
  lokasi: string;
  jadwal: string;
  status: 'aktif' | 'tidak_aktif';
}

export default function EditLifeGroupPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<LifeGroup>({
    id: '',
    nama: '',
    deskripsi: '',
    lokasi: '',
    jadwal: '',
    status: 'aktif',
  });

  useEffect(() => {
    // TODO: Fetch life group data from API
    // Temporary dummy data
    setFormData({
      id: params.id,
      nama: 'Life Group Alpha',
      deskripsi: 'Life Group untuk pemuda dan mahasiswa',
      lokasi: 'Rumah Pak Budi',
      jadwal: 'Setiap Rabu, 19:00 WIB',
      status: 'aktif',
    });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementasi API call untuk menyimpan perubahan
    console.log('Form data:', formData);
    router.push('/dashboard/lifegroup');
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className='space-y-6 pb-16'>
      <FeaturedCard
        title='Edit Life Group'
        description='Edit informasi life group Anda'
        actionLabel='Kembali ke Daftar Life Group'
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
        <div className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Nama Life Group
            </label>
            <input
              type='text'
              name='nama'
              value={formData.nama}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Deskripsi
            </label>
            <textarea
              name='deskripsi'
              value={formData.deskripsi}
              onChange={handleChange}
              rows={3}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Lokasi
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FiMapPin className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='text'
                name='lokasi'
                value={formData.lokasi}
                onChange={handleChange}
                className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                required
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Jadwal
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FiCalendar className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='text'
                name='jadwal'
                value={formData.jadwal}
                onChange={handleChange}
                placeholder='Contoh: Setiap Rabu, 19:00 WIB'
                className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                required
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Status
            </label>
            <select
              name='status'
              value={formData.status}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              required
            >
              <option value='aktif'>Aktif</option>
              <option value='tidak_aktif'>Tidak Aktif</option>
            </select>
          </div>
        </div>

        <div className='mt-8 flex justify-end space-x-4'>
          <motion.button
            type='button'
            onClick={() => router.push('/dashboard/lifegroup')}
            className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiArrowLeft className='w-4 h-4 mr-2' />
            Kembali
          </motion.button>
          <motion.button
            type='submit'
            className='px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiSave className='w-4 h-4 mr-2' />
            Simpan Perubahan
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
