'use client';

import { FiEdit2, FiTrash2 } from 'react-icons/fi';

type LifeGroupMember = {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  tanggalBergabung: string;
  status: 'aktif' | 'tidak_aktif';
};

type LifeGroupMemberTableProps = {
  members: LifeGroupMember[];
  onEdit: (member: LifeGroupMember) => void;
  onDelete: (member: LifeGroupMember) => void;
};

export default function LifeGroupMemberTable({
  members,
  onEdit,
  onDelete,
}: LifeGroupMemberTableProps) {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
      <table className='w-full text-sm text-left text-gray-500'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
          <tr>
            <th scope='col' className='px-6 py-3 font-medium'>
              Nama
            </th>
            <th scope='col' className='px-6 py-3 font-medium'>
              Email
            </th>
            <th scope='col' className='px-6 py-3 font-medium'>
              Telepon
            </th>
            <th scope='col' className='px-6 py-3 font-medium'>
              Tanggal Bergabung
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
          {members.map((member) => (
            <tr key={member.id} className='bg-white border-b last:border-b-0 hover:bg-gray-50'>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {member.nama}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>{member.email}</td>
              <td className='px-6 py-4 whitespace-nowrap'>{member.telepon}</td>
              <td className='px-6 py-4 whitespace-nowrap'>
                {member.tanggalBergabung}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    member.status === 'aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {member.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3'>
                <button
                  onClick={() => onEdit(member)}
                  className='text-primary-600 hover:text-primary-900'
                >
                  <FiEdit2 className='w-5 h-5' />
                </button>
                <button
                  onClick={() => onDelete(member)}
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
