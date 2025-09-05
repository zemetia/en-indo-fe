'use client';

import { useState } from 'react';
import { FiEdit2, FiTrash2, FiStar, FiUser, FiInstagram, FiPhone, FiMapPin } from 'react-icons/fi';
import { Crown } from 'lucide-react';
import { LifeGroupPersonMember, LifeGroupVisitorMember } from '@/lib/lifegroup';

type UnifiedMember = {
  type: 'person' | 'visitor';
  data: LifeGroupPersonMember | LifeGroupVisitorMember;
};

type UnifiedMemberTableProps = {
  personMembers: LifeGroupPersonMember[];
  visitorMembers: LifeGroupVisitorMember[];
  onUpdatePersonPosition: (member: LifeGroupPersonMember, newPosition: 'LEADER' | 'CO_LEADER' | 'MEMBER') => void;
  onRemovePersonMember: (member: LifeGroupPersonMember) => void;
  onRemoveVisitorMember: (member: LifeGroupVisitorMember) => void;
  canManageMembers: boolean;
};

const getPositionIcon = (position: string) => {
  switch (position) {
    case 'LEADER':
      return <Crown className="w-4 h-4 text-yellow-600" />;
    case 'CO_LEADER':
      return <FiStar className="w-4 h-4 text-blue-600" />;
    case 'MEMBER':
    default:
      return <FiUser className="w-4 h-4 text-gray-600" />;
  }
};

const getPositionBadge = (position: string) => {
  switch (position) {
    case 'LEADER':
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
          <Crown className="w-3 h-3 mr-1 mt-0.5" />
          Pemimpin
        </span>
      );
    case 'CO_LEADER':
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          <FiStar className="w-3 h-3 mr-1 mt-0.5" />
          Wakil Pemimpin
        </span>
      );
    case 'MEMBER':
    default:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
          <FiUser className="w-3 h-3 mr-1 mt-0.5" />
          Anggota
        </span>
      );
  }
};

export default function UnifiedMemberTable({
  personMembers,
  visitorMembers,
  onUpdatePersonPosition,
  onRemovePersonMember,
  onRemoveVisitorMember,
  canManageMembers,
}: UnifiedMemberTableProps) {
  const [editingMember, setEditingMember] = useState<string | null>(null);

  const handlePositionChange = (member: LifeGroupPersonMember, newPosition: string) => {
    onUpdatePersonPosition(member, newPosition as 'LEADER' | 'CO_LEADER' | 'MEMBER');
    setEditingMember(null);
  };

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

  // Combine and sort members (person members first, then visitors)
  const unifiedMembers: UnifiedMember[] = [
    ...(personMembers || []).map(member => ({ type: 'person' as const, data: member })),
    ...(visitorMembers || []).map(member => ({ type: 'visitor' as const, data: member }))
  ];

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
      <table className='w-full text-sm text-left text-gray-500'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
          <tr>
            <th scope='col' className='px-6 py-3 font-medium'>
              Nama
            </th>
            <th scope='col' className='px-6 py-3 font-medium'>
              Kontak
            </th>
            <th scope='col' className='px-6 py-3 font-medium'>
              Posisi/Jenis
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
          {unifiedMembers.map((unifiedMember) => {
            const member = unifiedMember.data;
            const isVisitor = unifiedMember.type === 'visitor';
            const personMember = unifiedMember.data as LifeGroupPersonMember;
            const visitorMember = unifiedMember.data as LifeGroupVisitorMember;

            return (
              <tr key={member.id} className='bg-white border-b last:border-b-0 hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  <div className="flex items-center">
                    {isVisitor ? (
                      <>
                        <FiUser className="w-4 h-4 text-gray-600" />
                        <span className="ml-2"></span>
                      </>
                    ) : (
                      <>
                        {getPositionIcon(personMember.position)}
                        <span className="ml-2"></span>
                      </>
                    )}
                    <span>{isVisitor ? visitorMember.visitor.name : personMember.person.nama}</span>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {isVisitor ? (
                    <div className="space-y-1">
                      {visitorMember.visitor.ig_username && (
                        <div className="flex items-center text-pink-600 text-xs">
                          <FiInstagram className="w-3 h-3 mr-1" />
                          <span>@{visitorMember.visitor.ig_username}</span>
                        </div>
                      )}
                      {visitorMember.visitor.phone_number && (
                        <div className="flex items-center text-green-600 text-xs">
                          <FiPhone className="w-3 h-3 mr-1" />
                          <span>{formatPhoneNumber(visitorMember.visitor.phone_number)}</span>
                        </div>
                      )}
                      {visitorMember.visitor.kabupaten && (
                        <div className="flex items-center text-blue-600 text-xs">
                          <FiMapPin className="w-3 h-3 mr-1" />
                          <span>{visitorMember.visitor.kabupaten.Name}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-xs">{personMember.person.email || '-'}</div>
                      <div className="text-xs text-gray-500">{personMember.person.nomor_telepon || '-'}</div>
                    </div>
                  )}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {isVisitor ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 mt-1.5"></div>
                      Visitor
                    </span>
                  ) : (
                    editingMember === member.id && canManageMembers ? (
                      <select
                        value={personMember.position}
                        onChange={(e) => handlePositionChange(personMember, e.target.value)}
                        onBlur={() => setEditingMember(null)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      >
                        <option value="MEMBER">Anggota</option>
                        <option value="CO_LEADER">Wakil Pemimpin</option>
                        <option value="LEADER">Pemimpin</option>
                      </select>
                    ) : (
                      <button
                        onClick={() => canManageMembers && setEditingMember(member.id)}
                        className={`${canManageMembers ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default'}`}
                        disabled={!canManageMembers}
                      >
                        {getPositionBadge(personMember.position)}
                      </button>
                    )
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
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3'>
                    {!isVisitor && (
                      <button
                        onClick={() => setEditingMember(member.id)}
                        className='text-primary-600 hover:text-primary-900'
                        title="Edit posisi"
                      >
                        <FiEdit2 className='w-4 h-4' />
                      </button>
                    )}
                    <button
                      onClick={() => isVisitor ? onRemoveVisitorMember(visitorMember) : onRemovePersonMember(personMember)}
                      className='text-red-600 hover:text-red-900'
                      title={isVisitor ? "Hapus pengunjung" : "Hapus anggota"}
                    >
                      <FiTrash2 className='w-4 h-4' />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {unifiedMembers.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Belum ada anggota di life group ini.
        </div>
      )}
    </div>
  );
}