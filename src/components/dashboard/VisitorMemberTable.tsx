'use client';

import { FiTrash2, FiInstagram, FiPhone, FiMapPin } from 'react-icons/fi';
import { LifeGroupVisitorMember } from '@/lib/lifegroup';

type VisitorMemberTableProps = {
  members: LifeGroupVisitorMember[];
  onRemove: (member: LifeGroupVisitorMember) => void;
  canManageMembers: boolean;
};

export default function VisitorMemberTable({
  members,
  onRemove,
  canManageMembers,
}: VisitorMemberTableProps) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPhoneNumber = (phoneNumber?: string) => {
    if (!phoneNumber) return '-';
    
    // Format Indonesian phone numbers
    if (phoneNumber.startsWith('62')) {
      return `+${phoneNumber}`;
    } else if (phoneNumber.startsWith('0')) {
      return phoneNumber;
    }
    return phoneNumber;
  };

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
      <table className='w-full text-sm text-left text-gray-500'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
          <tr>
            <th scope='col' className='px-6 py-3 font-medium'>
              Nama
            </th>
            <th scope='col' className='px-6 py-3 font-medium'>
              Instagram
            </th>
            <th scope='col' className='px-6 py-3 font-medium'>
              Telepon
            </th>
            <th scope='col' className='px-6 py-3 font-medium'>
              Kota
            </th>
            <th scope='col' className='px-6 py-3 font-medium'>
              Tanggal Bergabung
            </th>
            <th scope='col' className='px-6 py-3 font-medium'>
              Status
            </th>
            {canManageMembers && (
              <th scope='col' className='px-6 py-3 font-medium text-right'>
                Aksi
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className='bg-white border-b last:border-b-0 hover:bg-gray-50'>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3">
                    {member.visitor.name.charAt(0).toUpperCase()}
                  </div>
                  {member.visitor.name}
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                {member.visitor.ig_username ? (
                  <div className="flex items-center text-pink-600">
                    <FiInstagram className="w-4 h-4 mr-1" />
                    <span>@{member.visitor.ig_username}</span>
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                {member.visitor.phone_number ? (
                  <div className="flex items-center text-green-600">
                    <FiPhone className="w-4 h-4 mr-1" />
                    <span>{formatPhoneNumber(member.visitor.phone_number)}</span>
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                {member.visitor.kabupaten ? (
                  <div className="flex items-center text-blue-600">
                    <FiMapPin className="w-4 h-4 mr-1" />
                    <span>{member.visitor.kabupaten}</span>
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                {formatDate(member.joined_date)}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    member.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {member.is_active ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </td>
              {canManageMembers && (
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <button
                    onClick={() => onRemove(member)}
                    className='text-red-600 hover:text-red-900'
                    title="Hapus pengunjung"
                  >
                    <FiTrash2 className='w-4 h-4' />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {members.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Belum ada pengunjung di life group ini.
        </div>
      )}
    </div>
  );
}