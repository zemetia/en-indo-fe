'use client';

import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BsPeople,
  BsPersonPlus,
} from 'react-icons/bs';
import { FiEdit2, FiSearch, FiTrash2, FiMail, FiPhone } from 'react-icons/fi';

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
  const router = useRouter();

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
      fetchJemaat();
    }
  };

  const filteredJemaat = jemaat
    ? jemaat.filter((item: Jemaat) =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const renderContent = () => {
    if (loading) {
      return (
        <div className='flex justify-center items-center py-10'>
          <div className='w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
        </div>
      );
    }

    if (error) {
      return <p className='text-center text-red-500 py-10'>{error}</p>;
    }

    if (filteredJemaat.length === 0) {
      return (
        <div className='text-center py-10 bg-gray-50 rounded-xl'>
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
      );
    }

    return (
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-6 py-3 font-medium'>
                Nama
              </th>
              <th scope='col' className='px-6 py-3 font-medium'>
                Kontak
              </th>
              <th scope='col' className='px-6 py-3 font-medium'>
                Gereja
              </th>
              <th scope='col' className='px-6 py-3 font-medium'>
                Status
              </th>
              <th scope='col' className='px-6 py-3 font-medium text-right'>
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredJemaat.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => router.push(`/dashboard/jemaat/${item.id}`)}
                className='bg-white border-b last:border-b-0 even:bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer'
              >
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
                      <BsPeople className='w-5 h-5 text-blue-600'/>
                    </div>
                    <span>{item.nama}</span>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  <div className='flex items-center space-x-2'>
                    <FiMail className="w-4 h-4 text-gray-400" />
                    <span>{item.email || '-'}</span>
                  </div>
                  <div className='flex items-center space-x-2 mt-1'>
                    <FiPhone className="w-4 h-4 text-gray-400" />
                    <span>{item.nomor_telepon || '-'}</span>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {item.church}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                   <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.is_aktif
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.is_aktif ? 'Aktif' : 'Nonaktif'}
                    </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-right'>
                  <div className='flex items-center justify-end space-x-2'>
                     <Link
                        href={`/dashboard/jemaat/edit/${item.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className='p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-100 transition-colors'
                      >
                        <FiEdit2 className='w-4 h-4' />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJemaat(item);
                          setShowConfirmation(true);
                        }}
                        className='p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors'
                      >
                        <FiTrash2 className='w-4 h-4' />
                      </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

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
            <Link href='/dashboard/jemaat/tambah' className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 whitespace-nowrap'>
              <BsPersonPlus className='w-5 h-5' />
              <span>Tambah Jemaat</span>
            </Link>
          </div>
        </div>
        {renderContent()}
      </div>

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
