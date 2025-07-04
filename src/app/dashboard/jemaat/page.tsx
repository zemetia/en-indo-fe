'use client';

import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import { useEffect } from 'react';
import {
  BsCalendarWeek,
  BsGeoAlt,
  BsPeople,
  BsPersonPlus,
} from 'react-icons/bs';
import { FiEdit2, FiSearch, FiTrash2, FiUsers } from 'react-icons/fi';
import { MdAlternateEmail } from 'react-icons/md';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { getToken } from '@/lib/helper';

interface Jemaat {
  id: string;
  nama: string;
  gender: string;
  alamat: string;
  church: string;
  tanggal_lahir: string;
  email: string;
  nomor_telepon: string;
  is_aktif: boolean;
}

export default function DataJemaatPage() {
  const [jemaat, setJemaat] = React.useState<Array<Jemaat> | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [selectedJemaat, setSelectedJemaat] = React.useState<Jemaat | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchJemaat = async () => {
    setLoading(true);
    try {
      const token = getToken();

      if (!token) {
        setError('Token autentikasi tidak ditemukan. Silakan login kembali.');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/person`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        setJemaat(response.data);
      } else if (
        response.data &&
        typeof response.data === 'object' &&
        Array.isArray(response.data.data)
      ) {
        setJemaat(response.data.data);
      } else {
        throw new Error('Format data tidak valid');
      }

      setError(null);
    } catch (error) {
      setError('Gagal mengambil data jemaat. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJemaat();
  }, []);

  const handleToggleStatus = async () => {
    if (!selectedJemaat) return;

    try {
      const token = getToken();
      if (!token) {
        setError('Token autentikasi tidak ditemukan. Silakan login kembali.');
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/person/nonaktif`,
        { id: selectedJemaat.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update status jemaat di state tanpa fetch ulang
      setJemaat(
        (prevJemaat) =>
          prevJemaat?.map((j) =>
            j.id === selectedJemaat.id ? { ...j, is_aktif: !j.is_aktif } : j
          ) || null
      );

      setShowConfirmation(false);
      setSelectedJemaat(null);
    } catch (error) {
      setError('Gagal mengubah status jemaat. Silakan coba lagi nanti.');
      // Jika terjadi error, fetch ulang data untuk memastikan konsistensi
      fetchJemaat();
    }
  };

  const filteredJemaat = jemaat
    ? jemaat.filter((item: Jemaat) =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className='space-y-6'>
        <FeaturedCard
          title='Data Jemaat'
          description='Kelola data jemaat gereja'
          actionLabel='Kembali ke Dashboard'
          gradientFrom='from-blue-500'
          gradientTo='to-blue-700'
        />
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex justify-center items-center min-h-[400px]'>
          <div className='flex flex-col items-center'>
            <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4'></div>
            <p className='text-gray-600'>Memuat data jemaat...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <FeaturedCard
          title='Data Jemaat'
          description='Kelola data jemaat gereja'
          actionLabel='Kembali ke Dashboard'
          gradientFrom='from-blue-500'
          gradientTo='to-blue-700'
        />
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex justify-center items-center min-h-[400px]'>
          <div className='text-center'>
            <div className='text-red-500 mb-2 text-5xl'>
              <BsGeoAlt className='mx-auto' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Error</h3>
            <p className='text-gray-600 mb-4'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Data Jemaat'
        description='Kelola data jemaat gereja'
        actionLabel='Kembali ke Dashboard'
        gradientFrom='from-blue-500'
        gradientTo='to-blue-700'
      />

      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>
              Daftar Jemaat
            </h2>
            <p className='text-sm text-gray-500 mt-1'>
              Kelola dan lihat data jemaat gereja
            </p>
          </div>
          <div className='flex space-x-4 w-full md:w-auto'>
            <div className='relative flex-1 md:flex-none'>
              <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='text'
                placeholder='Cari jemaat...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64'
              />
            </div>
            <button className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 whitespace-nowrap'>
              <BsPersonPlus className='w-5 h-5' />
              <span>Tambah Jemaat</span>
            </button>
          </div>
        </div>

        {filteredJemaat.length === 0 ? (
          <div className='bg-gray-50 rounded-xl p-8 text-center'>
            <BsPeople className='w-10 h-10 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Tidak ada data jemaat
            </h3>
            <p className='text-gray-600 max-w-md mx-auto mb-6'>
              {searchTerm
                ? `Tidak ada hasil yang cocok dengan "${searchTerm}"`
                : 'Belum ada data jemaat yang tersedia. Tambahkan data jemaat baru untuk melihatnya di sini.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className='px-4 py-2 bg-gray-200 rounded-lg text-gray-800 hover:bg-gray-300 transition-colors'
              >
                Hapus Pencarian
              </button>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredJemaat.map((item: Jemaat, index: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/dashboard/jemaat/${item.id}`}
                  className='group block p-6 bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-blue-500 hover:-translate-y-1'
                >
                    <div className='flex items-start space-x-4'>
                      <div className='p-3 rounded-lg bg-blue-600 text-white transform group-hover:rotate-12 transition-transform duration-300'>
                        <BsPeople className='w-6 h-6' />
                      </div>
                      <div className='flex-1'>
                        <div className='flex justify-between items-start'>
                          <h3 className='text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors'>
                            {item.nama}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.is_aktif === true
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {item.is_aktif ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </div>
                        <p className='mt-1 text-sm text-gray-500'>
                          {item.church}
                        </p>
                      </div>
                    </div>

                    <div className='mt-4 space-y-2'>
                      <div className='flex items-center text-sm text-gray-500'>
                        <FiUsers className='w-4 h-4 mr-2 text-blue-500' />
                        <span>
                          {item.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      </div>
                      <div className='flex items-center text-sm text-gray-500'>
                        <BsCalendarWeek className='w-4 h-4 mr-2 text-blue-500' />
                        <span>Lahir: {item.tanggal_lahir}</span>
                      </div>
                      <div className='flex items-center text-sm text-gray-500'>
                        <MdAlternateEmail className='w-4 h-4 mr-2 text-blue-500' />
                        <span>Email: {item.email || '-'}</span>
                      </div>
                    </div>

                    <div className='mt-4 border-t border-blue-50 pt-4'>
                      <div className='flex flex-col space-y-2'>
                        <div className='flex items-center text-sm text-gray-500'>
                          <BsGeoAlt className='w-4 h-4 mr-2 text-blue-500' />
                          <span className='line-clamp-1'>{item.alamat}</span>
                        </div>
                        <div className='flex justify-between items-center'>
                          <div className='flex items-center text-sm text-gray-500'>
                            <span>{item.nomor_telepon}</span>
                          </div>
                          <div className='flex space-x-2'>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Handler untuk edit
                              }}
                              className='p-2 text-gray-400 hover:text-blue-600 transition-colors'
                            >
                              <FiEdit2 className='w-5 h-5' />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedJemaat(item);
                                setShowConfirmation(true);
                              }}
                              className='p-2 text-gray-400 hover:text-red-600 transition-colors'
                            >
                              <FiTrash2 className='w-5 h-5' />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Popup Konfirmasi */}
      {showConfirmation && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
          style={{ margin: '0px' }}
        >
          <div className='bg-white rounded-xl p-6 max-w-md w-full mx-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Konfirmasi {selectedJemaat?.is_aktif ? 'Nonaktifkan' : 'Aktifkan'}{' '}
              Jemaat
            </h3>
            <p className='text-gray-600 mb-6'>
              Yakin ingin{' '}
              {selectedJemaat?.is_aktif ? 'menonaktifkan' : 'mengaktifkan'}{' '}
              jemaat ini?
            </p>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setSelectedJemaat(null);
                }}
                className='px-4 py-2 text-gray-600 hover:text-gray-800'
              >
                Batal
              </button>
              <button
                onClick={() => {
                  handleToggleStatus();
                  setShowConfirmation(false);
                  setSelectedJemaat(null);
                }}
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
              >
                Yakin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
