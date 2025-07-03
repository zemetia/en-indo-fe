'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiCalendar,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUsers,
  FiHeart,
  FiHome,
  FiSave,
  FiArrowLeft,
} from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

export default function TambahJemaatPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Data Pribadi
    nama: '',
    nama_lain: '',
    gender: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    fase_hidup: '',
    status_perkawinan: '',
    nama_pasangan: '',
    tanggal_perkawinan: '',

    // Kontak
    alamat: '',
    nomor_telepon: '',
    email: '',

    // Data Keluarga
    ayah: '',
    ibu: '',

    // Data Gereja
    kode_jemaat: '',
    church_id: '',
    kabupaten_id: '',

    // Data Tambahan
    kerinduan: '',
    komitmen_berjemaat: '',
    status: 'aktif',
    is_aktif: true,
    pelayanan: [] as string[],
    life_groups: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementasi API call untuk menyimpan data
    console.log('Form data:', formData);
    router.push('/dashboard/jemaat');
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className='space-y-6 pb-16'>
      <FeaturedCard
        title='Tambah Jemaat Baru'
        description='Tambahkan data jemaat baru ke dalam sistem'
        actionLabel='Kembali ke Daftar Jemaat'
        gradientFrom='from-indigo-500'
        gradientTo='to-indigo-700'
      />

      <motion.form
        onSubmit={handleSubmit}
        className='bg-white rounded-xl shadow-md p-6 border border-indigo-50'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Data Pribadi */}
        <div className='mb-8'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
            <FiUser className='w-5 h-5 mr-2 text-indigo-500' />
            Data Pribadi
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Nama Lengkap
              </label>
              <input
                type='text'
                name='nama'
                value={formData.nama}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Nama Lain
              </label>
              <input
                type='text'
                name='nama_lain'
                value={formData.nama_lain}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Jenis Kelamin
              </label>
              <select
                name='gender'
                value={formData.gender}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                required
              >
                <option value=''>Pilih Jenis Kelamin</option>
                <option value='L'>Laki-laki</option>
                <option value='P'>Perempuan</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tempat Lahir
              </label>
              <input
                type='text'
                name='tempat_lahir'
                value={formData.tempat_lahir}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tanggal Lahir
              </label>
              <input
                type='date'
                name='tanggal_lahir'
                value={formData.tanggal_lahir}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Fase Hidup
              </label>
              <select
                name='fase_hidup'
                value={formData.fase_hidup}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                required
              >
                <option value=''>Pilih Fase Hidup</option>
                <option value='anak'>Anak</option>
                <option value='remaja'>Remaja</option>
                <option value='pemuda'>Pemuda</option>
                <option value='dewasa'>Dewasa</option>
                <option value='lansia'>Lansia</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Status Perkawinan
              </label>
              <select
                name='status_perkawinan'
                value={formData.status_perkawinan}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                required
              >
                <option value=''>Pilih Status Perkawinan</option>
                <option value='belum_menikah'>Belum Menikah</option>
                <option value='menikah'>Menikah</option>
                <option value='cerai'>Cerai</option>
                <option value='janda'>Janda</option>
                <option value='duda'>Duda</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Nama Pasangan
              </label>
              <input
                type='text'
                name='nama_pasangan'
                value={formData.nama_pasangan}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tanggal Perkawinan
              </label>
              <input
                type='date'
                name='tanggal_perkawinan'
                value={formData.tanggal_perkawinan}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>
          </div>
        </div>

        {/* Kontak */}
        <div className='mb-8'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
            <FiPhone className='w-5 h-5 mr-2 text-indigo-500' />
            Kontak
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Alamat
              </label>
              <textarea
                name='alamat'
                value={formData.alamat}
                onChange={handleChange}
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Nomor Telepon
              </label>
              <input
                type='tel'
                name='nomor_telepon'
                value={formData.nomor_telepon}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                required
              />
            </div>
          </div>
        </div>

        {/* Data Keluarga */}
        <div className='mb-8'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
            <FiUsers className='w-5 h-5 mr-2 text-indigo-500' />
            Data Keluarga
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Nama Ayah
              </label>
              <input
                type='text'
                name='ayah'
                value={formData.ayah}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Nama Ibu
              </label>
              <input
                type='text'
                name='ibu'
                value={formData.ibu}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                required
              />
            </div>
          </div>
        </div>

        {/* Data Gereja */}
        <div className='mb-8'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
            <FiHome className='w-5 h-5 mr-2 text-indigo-500' />
            Data Gereja
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Kode Jemaat
              </label>
              <input
                type='text'
                name='kode_jemaat'
                value={formData.kode_jemaat}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Gereja
              </label>
              <select
                name='church_id'
                value={formData.church_id}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                required
              >
                <option value=''>Pilih Gereja</option>
                {/* TODO: Add church options */}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Kabupaten
              </label>
              <select
                name='kabupaten_id'
                value={formData.kabupaten_id}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                required
              >
                <option value=''>Pilih Kabupaten</option>
                {/* TODO: Add district options */}
              </select>
            </div>
          </div>
        </div>

        {/* Data Tambahan */}
        <div className='mb-8'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
            <FiHeart className='w-5 h-5 mr-2 text-indigo-500' />
            Data Tambahan
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Kerinduan
              </label>
              <textarea
                name='kerinduan'
                value={formData.kerinduan}
                onChange={handleChange}
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Komitmen Berjemaat
              </label>
              <textarea
                name='komitmen_berjemaat'
                value={formData.komitmen_berjemaat}
                onChange={handleChange}
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Status
              </label>
              <select
                name='status'
                value={formData.status}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                required
              >
                <option value='aktif'>Aktif</option>
                <option value='tidak_aktif'>Tidak Aktif</option>
                <option value='pindah'>Pindah</option>
                <option value='meninggal'>Meninggal</option>
              </select>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                name='is_aktif'
                checked={formData.is_aktif}
                onChange={handleChange}
                className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
              />
              <label className='ml-2 block text-sm text-gray-700'>
                Jemaat Aktif
              </label>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className='flex justify-end space-x-4'>
          <motion.button
            type='button'
            onClick={() => router.push('/dashboard/jemaat')}
            className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiArrowLeft className='w-4 h-4 mr-2' />
            Kembali
          </motion.button>
          <motion.button
            type='submit'
            className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiSave className='w-4 h-4 mr-2' />
            Simpan
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
