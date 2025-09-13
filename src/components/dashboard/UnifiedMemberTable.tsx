'use client';

import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { FiTrash2, FiStar, FiUser, FiInstagram, FiPhone, FiMapPin, FiLogOut } from 'react-icons/fi';
import { Crown } from 'lucide-react';
import { LifeGroupPersonMember, LifeGroupVisitorMember, LifeGroup } from '@/lib/lifegroup';
import { getCurrentUserId } from '@/lib/helper';

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
  canManageMembers: boolean; // Kept for backward compatibility
  canAddEditMembers?: boolean;
  canDeleteMembers?: boolean;
  canEditPositions?: boolean;
  userRole?: string | null;
  lifeGroup?: LifeGroup;
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
  canAddEditMembers = canManageMembers, // Default to backward compatibility
  canDeleteMembers = canManageMembers, // Default to backward compatibility
  canEditPositions = canManageMembers,
  userRole,
  lifeGroup,
}: UnifiedMemberTableProps) {
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [showPositionConfirmation, setShowPositionConfirmation] = useState(false);
  const [showKickConfirmation, setShowKickConfirmation] = useState(false);
  const [pendingPositionChange, setPendingPositionChange] = useState<{
    member: LifeGroupPersonMember;
    newPosition: string;
  } | null>(null);
  const [pendingKickMember, setPendingKickMember] = useState<{
    member: LifeGroupPersonMember | LifeGroupVisitorMember;
    isVisitor: boolean;
  } | null>(null);

  const handlePositionChange = (member: LifeGroupPersonMember, newPosition: string) => {
    setPendingPositionChange({ member, newPosition });
    setShowPositionConfirmation(true);
    setEditingMember(null);
  };

  const confirmPositionChange = () => {
    if (pendingPositionChange) {
      onUpdatePersonPosition(pendingPositionChange.member, pendingPositionChange.newPosition as 'LEADER' | 'CO_LEADER' | 'MEMBER');
      setPendingPositionChange(null);
    }
    setShowPositionConfirmation(false);
  };

  const handleKickMember = (member: LifeGroupPersonMember | LifeGroupVisitorMember, isVisitor: boolean) => {
    setPendingKickMember({ member, isVisitor });
    setShowKickConfirmation(true);
  };

  const confirmKickMember = () => {
    if (pendingKickMember) {
      if (pendingKickMember.isVisitor) {
        onRemoveVisitorMember(pendingKickMember.member as LifeGroupVisitorMember);
      } else {
        onRemovePersonMember(pendingKickMember.member as LifeGroupPersonMember);
      }
      setPendingKickMember(null);
    }
    setShowKickConfirmation(false);
  };

  // Check if user can remove a specific member
  const canRemoveMember = (member: LifeGroupPersonMember): boolean => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId || !canDeleteMembers) return false;

    if (userRole === 'pic') return true; // PIC can remove all
    if (userRole === 'leader') {
      // Leader can remove all except himself
      return member.person_id !== currentUserId;
    }
    if (userRole === 'co_leader') {
      // CoLeader can only remove normal members (not leaders, co-leaders, or himself)
      return member.position === 'MEMBER' && member.person_id !== currentUserId;
    }
    return false;
  };

  // Check if user can edit a specific member's position
  const canEditMemberPosition = (member: LifeGroupPersonMember): boolean => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId || !canEditPositions) return false;

    if (userRole === 'pic') return true; // PIC can edit all positions
    if (userRole === 'leader') {
      // Leader can edit all positions except cannot demote himself
      return member.person_id !== currentUserId;
    }
    // CoLeader cannot edit any positions
    return false;
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
    <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto'>
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
                    {/* Kick button - positioned at leftmost before name */}
                    {(isVisitor ? canDeleteMembers : canRemoveMember(personMember)) && (
                      <button
                        onClick={() => handleKickMember(member, isVisitor)}
                        className='text-red-600 hover:text-red-800 mr-3'
                        title={isVisitor ? "Keluarkan pengunjung" : "Keluarkan anggota"}
                      >
                        <FiLogOut className='w-4 h-4' />
                      </button>
                    )}
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
                    editingMember === member.id && canEditMemberPosition(personMember) ? (
                      <select
                        value={personMember.position}
                        onChange={(e) => handlePositionChange(personMember, e.target.value)}
                        onBlur={() => setEditingMember(null)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      >
                        <option value="MEMBER">Anggota</option>
                        <option value="CO_LEADER">Wakil Pemimpin</option>
                        {(userRole === 'pic' || userRole === 'leader') && (
                          <option value="LEADER">Pemimpin</option>
                        )}
                      </select>
                    ) : (
                      <button
                        onClick={() => canEditMemberPosition(personMember) && setEditingMember(member.id)}
                        className={`${canEditMemberPosition(personMember) ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default'}`}
                        disabled={!canEditMemberPosition(personMember)}
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
      
      {/* Position Change Confirmation Dialog */}
      <AlertDialog open={showPositionConfirmation} onOpenChange={setShowPositionConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Perubahan Posisi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengubah posisi{' '}
              <strong>{pendingPositionChange?.member?.person?.nama}</strong>{' '}
              menjadi{' '}
              <strong>
                {pendingPositionChange?.newPosition === 'LEADER' 
                  ? 'Pemimpin'
                  : pendingPositionChange?.newPosition === 'CO_LEADER'
                  ? 'Wakil Pemimpin'
                  : 'Anggota'
                }
              </strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowPositionConfirmation(false)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmPositionChange}>
              Ya, Ubah Posisi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Kick Member Confirmation Dialog */}
      <AlertDialog open={showKickConfirmation} onOpenChange={setShowKickConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Keluarkan {pendingKickMember?.isVisitor ? 'Pengunjung' : 'Anggota'}</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengeluarkan{' '}
              <strong>
                {pendingKickMember?.isVisitor 
                  ? (pendingKickMember?.member as LifeGroupVisitorMember)?.visitor?.name
                  : (pendingKickMember?.member as LifeGroupPersonMember)?.person?.nama
                }
              </strong>{' '}
              dari life group ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowKickConfirmation(false)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmKickMember} className="bg-red-600 hover:bg-red-700">
              Ya, Keluarkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}