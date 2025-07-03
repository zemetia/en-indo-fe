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
    <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Kode
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Nama
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Gender
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Kontak
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {data.map((jemaat) => (
              <tr
                key={jemaat.id}
                className='hover:bg-gray-50 cursor-pointer'
                onClick={() => handleRowClick(jemaat)}
              >
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-gray-900'>
                    {jemaat.kodeJemaat}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-gray-900'>
                    {jemaat.nama}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-500'>
                    {jemaat.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-500'>{jemaat.status}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-500'>
                    {jemaat.nomorTelepon}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(jemaat);
                    }}
                    className='text-primary-600 hover:text-primary-900 mr-4'
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
    </div>
  );
}
