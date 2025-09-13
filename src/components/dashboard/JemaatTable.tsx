'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

type Jemaat = {
  id: string;
  nama: string;
  namaLain: string;
  gender: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  faseHidup: string;
  statusPerkawinan: string;
  pasangan: string;
  tanggalPerkawinan: string;
  nomorTelepon: string;
  email: string;
  gereja: string;
  ayah: string;
  ibu: string;
  kerinduan: string;
  komitmenBerjemaat: string;
  status: string;
  kodeJemaat: string;
};

type JemaatTableProps = {
  data: Jemaat[];
  onEdit: (jemaat: Jemaat) => void;
  onDelete: (id: string) => void;
};

export default function JemaatTable({
  data,
  onEdit,
  onDelete,
}: JemaatTableProps) {
  const router = useRouter();

  const handleRowClick = (jemaat: Jemaat) => {
    router.push(`/dashboard/jemaat/${jemaat.id}`);
  };

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
      <table className='w-full text-sm text-left text-gray-500'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
          <tr>
            <th scope='col' className='px-6 py-3 font-medium'>
              Kode
            </th>
            <th scope='col' className='px-6 py-3 font-medium'>
              Nama
            </th>
            <th scope='col' className='px-6 py-3 font-medium'>
              Gender
            </th>
            <th scope='col' className='px-6 py-3 font-medium'>
              Status
            </th>
            <th scope='col' className='px-6 py-3 font-medium'>
              Kontak
            </th>
            <th scope='col' className='px-6 py-3 font-medium text-right'>
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((jemaat) => (
            <tr
              key={jemaat.id}
              className='bg-white border-b last:border-b-0 hover:bg-gray-50 cursor-pointer'
              onClick={() => handleRowClick(jemaat)}
            >
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {jemaat.kodeJemaat}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {jemaat.nama}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                {jemaat.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>{jemaat.status}</td>
              <td className='px-6 py-4 whitespace-nowrap'>
                {jemaat.nomorTelepon}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-right'>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(jemaat);
                  }}
                  className='text-blue-600 hover:text-blue-900 mr-4'
                >
                  <FiEdit2 className='w-5 h-5' />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(jemaat.id);
                  }}
                  className='text-red-600 hover:text-red-900'
                >
                  <FiTrash2 className='w-5 h-5' />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
