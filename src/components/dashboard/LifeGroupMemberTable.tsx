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
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Nama
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Email
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Telepon
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Tanggal Bergabung
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {members.map((member) => (
              <tr key={member.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-gray-900'>
                    {member.nama}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-500'>{member.email}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-500'>{member.telepon}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-500'>
                    {member.tanggalBergabung}
                  </div>
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
    </div>
  );
}
