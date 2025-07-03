'use client';

import * as React from 'react';
import {
  FiCalendar,
  FiEdit2,
  FiMapPin,
  FiTrash2,
  FiUsers,
} from 'react-icons/fi';

type LifeGroup = {
  id: string;
  nama: string;
  lokasi: string;
  jadwal: string;
  jumlahAnggota: number;
  pembina: string;
  deskripsi: string;
  status: 'Aktif' | 'Tidak Aktif';
};

type LifeGroupCardProps = {
  data: LifeGroup;
  onEdit: (lifeGroup: LifeGroup) => void;
  onDelete: (id: string) => void;
};

export default function LifeGroupCard({
  data,
  onEdit,
  onDelete,
}: LifeGroupCardProps) {
  return (
    <div className='bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200'>
      <div className='flex justify-between items-start mb-4'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>{data.nama}</h3>
          <p className='text-sm text-gray-500'>{data.pembina}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            data.status === 'Aktif'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {data.status}
        </span>
      </div>

      <div className='space-y-3 mb-4'>
        <div className='flex items-center text-gray-600'>
          <FiMapPin className='w-4 h-4 mr-2' />
          <span className='text-sm'>{data.lokasi}</span>
        </div>
        <div className='flex items-center text-gray-600'>
          <FiCalendar className='w-4 h-4 mr-2' />
          <span className='text-sm'>{data.jadwal}</span>
        </div>
        <div className='flex items-center text-gray-600'>
          <FiUsers className='w-4 h-4 mr-2' />
          <span className='text-sm'>{data.jumlahAnggota} anggota</span>
        </div>
      </div>

      <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
        {data.deskripsi}
      </p>

      <div className='flex justify-end space-x-3'>
        <button
          onClick={() => onEdit(data)}
          className='text-primary-600 hover:text-primary-900'
        >
          <FiEdit2 className='w-5 h-5' />
        </button>
        <button
          onClick={() => onDelete(data.id)}
          className='text-red-600 hover:text-red-900'
        >
          <FiTrash2 className='w-5 h-5' />
        </button>
      </div>
    </div>
  );
}
