'use client';

import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';

import LifeGroupMemberTable from '@/components/dashboard/LifeGroupMemberTable';
import { getToken } from '@/lib/helper';

interface LifeGroupDetail {
  id: string;
  nama: string;
  deskripsi: string;
  lokasi: string;
  jadwal: string;
  pembina: string;
  totalAnggota: number;
  status: 'aktif' | 'tidak_aktif';
  tanggalPembuatan: string;
}

interface LifeGroupMember {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  tanggalBergabung: string;
  status: 'aktif' | 'tidak_aktif';
}

export default function LifeGroupDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [lifeGroup, setLifeGroup] = useState<LifeGroupDetail | null>(null);
  const [members, setMembers] = useState<LifeGroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchLifeGroupDetails = async () => {
      setLoading(true);
      try {
        const token = getToken();
        if (!token) {
          setError('Akses ditolak. Silakan login kembali.');
          return;
        }

        const [detailResponse, membersResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/lifegroup/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/lifegroup/${id}/members`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        setLifeGroup(detailResponse.data.data);
        setMembers(membersResponse.data.data);
      } catch (err) {
        setError('Gagal memuat detail lifegroup.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLifeGroupDetails();
  }, [id]);

  const handleEditMember = (member: any) => {
    // Implementasi edit member
    console.log('Edit member:', member);
  };

  const handleDeleteMember = (member: any) => {
    // Implementasi delete member
    console.log('Delete member:', member);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center py-20'>
        <div className='w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  if (error || !lifeGroup) {
    return (
      <div className='text-center py-20'>
        <p className='text-red-500'>{error || 'Data tidak ditemukan.'}</p>
        <Link
          href='/dashboard/lifegroup'
          className='mt-4 inline-block text-primary-600 hover:underline'
        >
          Kembali
        </Link>
      </div>
    );
  }

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
                <p className='mt-1 text-sm text-gray-900'>{lifeGroup.nama}</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Deskripsi
                </label>
                <p className='mt-1 text-sm text-gray-900'>
                  {lifeGroup.deskripsi}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Lokasi
                </label>
                <p className='mt-1 text-sm text-gray-900'>{lifeGroup.lokasi}</p>
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
                <p className='mt-1 text-sm text-gray-900'>{lifeGroup.jadwal}</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Pembina
                </label>
                <p className='mt-1 text-sm text-gray-900'>
                  {lifeGroup.pembina}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Status
                </label>
                <span
                  className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    lifeGroup.status === 'aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {lifeGroup.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
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
          members={members}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
        />
      </div>
    </div>
  );
}
