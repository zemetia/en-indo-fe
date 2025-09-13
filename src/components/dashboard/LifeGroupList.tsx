'use client';

import * as React from 'react';
import { FiPlus } from 'react-icons/fi';

import LifeGroupCard from './LifeGroupCard';

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

type LifeGroupListProps = {
  data: LifeGroup[];
  onAdd: () => void;
  onEdit: (lifeGroup: LifeGroup) => void;
  onDelete: (id: string) => void;
};

export default function LifeGroupList({
  data,
  onAdd,
  onEdit,
  onDelete,
}: LifeGroupListProps) {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-gray-900'>Life Group</h2>
        <button
          onClick={onAdd}
          className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
        >
          <FiPlus className='w-5 h-5 mr-2' />
          Tambah Life Group
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {data.map((lifeGroup) => (
          <LifeGroupCard
            key={lifeGroup.id}
            data={lifeGroup}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
