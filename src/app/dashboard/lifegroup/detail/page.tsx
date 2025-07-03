'use client';

import Link from 'next/link';
import { FiArrowLeft, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';

import LifeGroupMemberTable from '@/components/dashboard/LifeGroupMemberTable';

// Dummy data untuk contoh
const lifeGroupDetail = {
  id: '1',
  nama: 'Life Group Alpha',
  deskripsi: 'Life Group untuk pemuda dan mahasiswa',
  lokasi: 'Gedung Utama Lantai 2',
  jadwal: 'Setiap Rabu, 19:00 WIB',
  pembina: 'Pdt. John Doe',
  totalAnggota: 15,
  status: 'aktif',
  tanggalPembuatan: '1 Januari 2024',
};

const dummyMembers = [
  {
    id: '1',
    nama: 'John Smith',
    email: 'john@example.com',
    telepon: '081234567890',
    tanggalBergabung: '1 Januari 2024',
    status: 'aktif' as const,
  },
  {
    id: '2',
    nama: 'Jane Doe',
    email: 'jane@example.com',
    telepon: '081234567891',
    tanggalBergabung: '2 Januari 2024',
    status: 'aktif' as const,
  },
  // Tambahkan data dummy lainnya sesuai kebutuhan
];

export default function LifeGroupDetailPage() {
  const handleEditMember = (member: any) => {
    // Implementasi edit member
    console.log('Edit member:', member);
  };

  const handleDeleteMember = (member: any) => {
    // Implementasi delete member
    console.log('Delete member:', member);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Link
            href='/dashboard/lifegroup'
            className='text-gray-500 hover:text-gray-700'
          >
            <FiArrowLeft className='w-6 h-6' />
          </Link>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Detail Life Group
          </h1>
        </div>
        <div className='flex items-center space-x-3'>
          <button className='px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
            <FiEdit2 className='w-4 h-4 inline-block mr-2' />
            Edit Life Group
          </button>
          <button className='px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
            <FiTrash2 className='w-4 h-4 inline-block mr-2' />
            Hapus
          </button>
        </div>
      </div>

      {/* Detail Card */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h2 className='text-lg font-medium text-gray-900 mb-4'>
              Informasi Life Group
            </h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Nama Life Group
                </label>
                <p className='mt-1 text-sm text-gray-900'>
                  {lifeGroupDetail.nama}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Deskripsi
                </label>
                <p className='mt-1 text-sm text-gray-900'>
                  {lifeGroupDetail.deskripsi}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Lokasi
                </label>
                <p className='mt-1 text-sm text-gray-900'>
                  {lifeGroupDetail.lokasi}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h2 className='text-lg font-medium text-gray-900 mb-4'>
              Informasi Tambahan
            </h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Jadwal
                </label>
                <p className='mt-1 text-sm text-gray-900'>
                  {lifeGroupDetail.jadwal}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Pembina
                </label>
                <p className='mt-1 text-sm text-gray-900'>
                  {lifeGroupDetail.pembina}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Status
                </label>
                <span
                  className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    lifeGroupDetail.status === 'aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {lifeGroupDetail.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center space-x-3'>
            <FiUsers className='w-5 h-5 text-gray-500' />
            <h2 className='text-lg font-medium text-gray-900'>
              Anggota Life Group
            </h2>
          </div>
          <button className='px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
            Tambah Anggota
          </button>
        </div>

        <LifeGroupMemberTable
          members={dummyMembers}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
        />
      </div>
    </div>
  );
}
