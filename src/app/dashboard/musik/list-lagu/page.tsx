'use client';

import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import { FiEdit2, FiMusic, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { getToken } from '@/lib/helper';

interface Song {
  id: string;
  judul: string;
  penyanyi: string;
  genre: string;
  durasi: string;
  status: 'active' | 'inactive';
}

export default function ListLaguPage() {
  const [songs, setSongs] = React.useState<Song[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const token = getToken();
        if (!token) {
          setError('Akses ditolak. Silakan login kembali.');
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/song`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSongs(response.data.data);
      } catch (err) {
        setError('Gagal memuat daftar lagu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className='flex justify-center items-center py-10'>
          <div className='w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin'></div>
        </div>
      );
    }

    if (error) {
      return <p className='text-center text-red-500'>{error}</p>;
    }

    if (songs.length === 0) {
      return (
        <div className='bg-gray-50 rounded-xl p-8 text-center'>
          <FiMusic className='w-10 h-10 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Tidak ada lagu
          </h3>
          <p className='text-gray-600 max-w-md mx-auto mb-6'>
            Belum ada lagu yang tersedia. Silakan tambahkan lagu baru.
          </p>
          <Link
            href='/dashboard/musik/list-lagu/tambah'
            className='px-4 py-2 bg-amber-600 rounded-lg text-white hover:bg-amber-700 transition-colors'
          >
            Tambah Lagu Baru
          </Link>
        </div>
      );
    }

    return (
      <div className='overflow-x-auto bg-white rounded-xl shadow-sm border border-amber-50'>
        <table className='min-w-full divide-y divide-amber-100'>
          <thead className='bg-amber-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider'>
                Judul Lagu
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider'>
                Penyanyi
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider'>
                Genre
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider'>
                Durasi
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-amber-700 uppercase tracking-wider'>
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-amber-50'>
            {songs.map((song, index) => (
              <motion.tr
                key={song.id}
                className='hover:bg-amber-50'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 h-10 w-10'>
                      <div className='h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center'>
                        <FiMusic className='h-6 w-6 text-amber-600' />
                      </div>
                    </div>
                    <div className='ml-4'>
                      <div className='text-sm font-medium text-gray-900'>
                        {song.judul}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-500'>
                    {song.penyanyi}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-500'>{song.genre}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-500'>{song.durasi}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      song.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {song.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 flex justify-end'>
                  <Link
                    href={`/dashboard/musik/list-lagu/${song.id}/edit`}
                    className='text-amber-600 hover:text-amber-900'
                  >
                    <FiEdit2 className='w-5 h-5' />
                  </Link>
                  <button className='text-red-600 hover:text-red-900'>
                    <FiTrash2 className='w-5 h-5' />
                  </button>
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
        title='Daftar Lagu'
        description='Kelola daftar lagu untuk pelayanan musik'
        actionLabel='Kembali ke Dashboard Musik'
        gradientFrom='from-amber-500'
        gradientTo='to-amber-700'
      />

      <div className='bg-white rounded-xl shadow-sm p-6 border border-amber-50'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>Kelola Lagu</h2>
            <p className='text-sm text-gray-500 mt-1'>
              Tambah, edit, dan kelola lagu untuk pelayanan musik
            </p>
          </div>
          <Link
            href='/dashboard/musik/list-lagu/tambah'
            className='bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 whitespace-nowrap'
          >
            <FiPlus className='w-5 h-5' />
            <span>Tambah Lagu</span>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className='bg-white rounded-xl shadow-sm p-4 border border-amber-50 mb-6'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FiSearch className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  placeholder='Cari lagu...'
                  className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm'
                />
              </div>
            </div>
            <div className='flex gap-4'>
              <select className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md'>
                <option value=''>Semua Genre</option>
                <option value='pujian'>Pujian</option>
                <option value='penyembahan'>Penyembahan</option>
                <option value='pujian_penyembahan'>Pujian & Penyembahan</option>
              </select>
              <select className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md'>
                <option value=''>Semua Status</option>
                <option value='active'>Aktif</option>
                <option value='inactive'>Tidak Aktif</option>
              </select>
            </div>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
