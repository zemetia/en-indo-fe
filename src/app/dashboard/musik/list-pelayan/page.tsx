'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import {
  FiEdit2,
  FiMusic,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUser,
} from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

// Dummy data untuk contoh
const dummyMusicians = [
  {
    id: '1',
    nama: 'John Doe',
    email: 'john@example.com',
    telepon: '081234567890',
    instrument: 'Gitar',
    status: 'active',
    pengalaman: '3 tahun',
  },
  {
    id: '2',
    nama: 'Jane Smith',
    email: 'jane@example.com',
    telepon: '081234567891',
    instrument: 'Piano',
    status: 'active',
    pengalaman: '5 tahun',
  },
  // Tambahkan data dummy lainnya sesuai kebutuhan
];

export default function ListPelayanPage() {
  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Daftar Pelayan Musik'
        description='Kelola tim pelayan musik gereja'
        actionLabel='Kembali ke Dashboard Musik'
        gradientFrom='from-amber-500'
        gradientTo='to-amber-700'
      />

      <div className='bg-white rounded-xl shadow-sm p-6 border border-amber-50'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>
              Kelola Pelayan Musik
            </h2>
            <p className='text-sm text-gray-500 mt-1'>
              Tambah, edit, dan kelola data pelayan musik
            </p>
          </div>
          <Link
            href='/dashboard/musik/list-pelayan/tambah'
            className='bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 whitespace-nowrap'
          >
            <FiPlus className='w-5 h-5' />
            <span>Tambah Pelayan</span>
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
                  placeholder='Cari pelayan...'
                  className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm'
                />
              </div>
            </div>
            <div className='flex gap-4'>
              <select className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md'>
                <option value=''>Semua Instrumen</option>
                <option value='gitar'>Gitar</option>
                <option value='piano'>Piano</option>
                <option value='bass'>Bass</option>
                <option value='drum'>Drum</option>
                <option value='vokal'>Vokal</option>
              </select>
              <select className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md'>
                <option value=''>Semua Status</option>
                <option value='active'>Aktif</option>
                <option value='inactive'>Tidak Aktif</option>
              </select>
            </div>
          </div>
        </div>

        {dummyMusicians.length === 0 ? (
          <div className='bg-gray-50 rounded-xl p-8 text-center'>
            <FiUser className='w-10 h-10 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Tidak ada data pelayan
            </h3>
            <p className='text-gray-600 max-w-md mx-auto mb-6'>
              Belum ada data pelayan musik yang tersedia. Silakan tambahkan
              pelayan baru.
            </p>
            <Link
              href='/dashboard/musik/list-pelayan/tambah'
              className='px-4 py-2 bg-amber-600 rounded-lg text-white hover:bg-amber-700 transition-colors'
            >
              Tambah Pelayan Baru
            </Link>
          </div>
        ) : (
          <div className='overflow-x-auto bg-white rounded-xl shadow-sm border border-amber-50'>
            <table className='min-w-full divide-y divide-amber-100'>
              <thead className='bg-amber-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider'>
                    Nama
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider'>
                    Kontak
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider'>
                    Instrumen
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider'>
                    Pengalaman
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
                {dummyMusicians.map((musician, index) => (
                  <motion.tr
                    key={musician.id}
                    className='hover:bg-amber-50'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10'>
                          <div className='h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center'>
                            <FiUser className='h-6 w-6 text-amber-600' />
                          </div>
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {musician.nama}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-500'>
                        {musician.email}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {musician.telepon}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <FiMusic className='h-4 w-4 text-amber-500 mr-2' />
                        <span className='text-sm text-gray-500'>
                          {musician.instrument}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-500'>
                        {musician.pengalaman}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          musician.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {musician.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <div className='flex space-x-2 justify-end'>
                        <Link
                          href={`/dashboard/musik/list-pelayan/${musician.id}/edit`}
                          className='text-amber-600 hover:text-amber-900'
                        >
                          <FiEdit2 className='w-5 h-5' />
                        </Link>
                        <button className='text-red-600 hover:text-red-900'>
                          <FiTrash2 className='w-5 h-5' />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
