'use client';

import * as React from 'react';

import LifeGroupList from '@/components/dashboard/LifeGroupList';

// Data dummy untuk contoh
const dummyData = [
  {
    id: '1',
    nama: 'Life Group Alpha',
    lokasi: 'Rumah Pdt. John Doe',
    jadwal: 'Setiap Rabu, 19:00 WIB',
    jumlahAnggota: 12,
    pembina: 'Pdt. John Doe',
    deskripsi:
      'Life Group untuk keluarga muda dengan fokus pada pengembangan karakter dan pertumbuhan rohani.',
    status: 'Aktif' as const,
  },
  {
    id: '2',
    nama: 'Life Group Beta',
    lokasi: 'Rumah Pdt. Jane Smith',
    jadwal: 'Setiap Kamis, 19:00 WIB',
    jumlahAnggota: 8,
    pembina: 'Pdt. Jane Smith',
    deskripsi:
      'Life Group untuk mahasiswa dan profesional muda dengan fokus pada pengembangan kepemimpinan.',
    status: 'Aktif' as const,
  },
  {
    id: '3',
    nama: 'Life Group Gamma',
    lokasi: 'Rumah Pdt. Mike Johnson',
    jadwal: 'Setiap Jumat, 19:00 WIB',
    jumlahAnggota: 15,
    pembina: 'Pdt. Mike Johnson',
    deskripsi:
      'Life Group untuk keluarga dengan anak-anak, fokus pada pengembangan keluarga Kristen.',
    status: 'Tidak Aktif' as const,
  },
];

export default function LifeGroupPage() {
  const [lifeGroups, setLifeGroups] = React.useState(dummyData);

  const handleAdd = () => {
    // TODO: Implementasi tambah life group
    console.log('Tambah life group');
  };

  const handleEdit = (lifeGroup: (typeof dummyData)[0]) => {
    // TODO: Implementasi edit life group
    console.log('Edit life group:', lifeGroup);
  };

  const handleDelete = (id: string) => {
    // TODO: Implementasi hapus life group
    console.log('Hapus life group:', id);
  };

  return (
    <div className='p-6'>
      <LifeGroupList
        data={lifeGroups}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
