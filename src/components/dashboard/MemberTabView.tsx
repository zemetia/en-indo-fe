'use client';

import { useState, useEffect } from 'react';
import { FiUsers, FiUserPlus, FiLogOut } from 'react-icons/fi';
import { Crown } from 'lucide-react';
import UnifiedMemberTable from './UnifiedMemberTable';
import AddPersonMemberModal from './AddPersonMemberModal';
import AddVisitorMemberModal from './AddVisitorMemberModal';
import { 
  lifeGroupApi, 
  LifeGroupPersonMember, 
  LifeGroupVisitorMember,
  AddPersonMembersBatchRequest,
  AddVisitorMembersBatchRequest,
  BatchOperationResult,
  UpdatePersonMemberPositionRequest,
  RemovePersonMemberRequest,
  RemoveVisitorMemberRequest,
  LifeGroup
} from '@/lib/lifegroup';
import { getCurrentUserId } from '@/lib/helper';

type MemberTabViewProps = {
  lifeGroupId: string;
  lifeGroupChurchId: string;
  canManageMembers: boolean; // Kept for backward compatibility
  canAddEditMembers?: boolean;
  canDeleteMembers?: boolean;
  canEditPositions?: boolean;
  userRole?: string | null;
  lifeGroup?: LifeGroup;
  onMemberCountChange?: (personCount: number, visitorCount: number) => void;
};

export default function MemberTabView({
  lifeGroupId,
  lifeGroupChurchId,
  canManageMembers,
  canAddEditMembers = canManageMembers, // Default to backward compatibility
  canDeleteMembers = canManageMembers, // Default to backward compatibility
  canEditPositions = canManageMembers,
  userRole,
  lifeGroup,
  onMemberCountChange,
}: MemberTabViewProps) {
  const [personMembers, setPersonMembers] = useState<LifeGroupPersonMember[]>([]);
  const [visitorMembers, setVisitorMembers] = useState<LifeGroupVisitorMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [showAddVisitorModal, setShowAddVisitorModal] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [lifeGroupId]);

  useEffect(() => {
    // Notify parent about member count changes
    if (onMemberCountChange && personMembers && visitorMembers) {
      onMemberCountChange(personMembers.length || 0, visitorMembers.length || 0);
    }
  }, [personMembers, visitorMembers, onMemberCountChange]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const [personResponse, visitorResponse] = await Promise.all([
        lifeGroupApi.getPersonMembers(lifeGroupId),
        lifeGroupApi.getVisitorMembers(lifeGroupId),
      ]);
      
      setPersonMembers(personResponse || []);
      setVisitorMembers(visitorResponse || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Person member handlers
  const handleAddPersonMember = async (data: AddPersonMembersBatchRequest): Promise<BatchOperationResult> => {
    try {
      const result = await lifeGroupApi.addPersonMembersBatch(lifeGroupId, data);
      await fetchMembers(); // Refresh the list
      return result;
    } catch (error) {
      console.error('Error adding person members:', error);
      throw error;
    }
  };

  const handleUpdatePersonPosition = async (
    member: LifeGroupPersonMember, 
    newPosition: 'LEADER' | 'CO_LEADER' | 'MEMBER'
  ) => {
    try {
      const data: UpdatePersonMemberPositionRequest = {
        person_id: member.person_id,
        position: newPosition,
      };
      await lifeGroupApi.updatePersonMemberPosition(lifeGroupId, data);
      await fetchMembers(); // Refresh the list
    } catch (error) {
      console.error('Error updating person position:', error);
      alert('Gagal mengubah posisi. Silakan coba lagi.');
    }
  };

  const handleRemovePersonMember = async (member: LifeGroupPersonMember) => {
    try {
      const data: RemovePersonMemberRequest = {
        person_id: member.person_id,
      };
      await lifeGroupApi.removePersonMember(lifeGroupId, data);
      await fetchMembers(); // Refresh the list
    } catch (error) {
      console.error('Error removing person member:', error);
      alert('Gagal menghapus anggota. Silakan coba lagi.');
    }
  };

  // Visitor member handlers
  const handleAddVisitorMember = async (data: AddVisitorMembersBatchRequest): Promise<BatchOperationResult> => {
    try {
      const result = await lifeGroupApi.addVisitorMembersBatch(lifeGroupId, data);
      await fetchMembers(); // Refresh the list
      return result;
    } catch (error) {
      console.error('Error adding visitor members:', error);
      throw error;
    }
  };

  const handleRemoveVisitorMember = async (member: LifeGroupVisitorMember) => {
    try {
      const data: RemoveVisitorMemberRequest = {
        visitor_id: member.visitor_id,
      };
      await lifeGroupApi.removeVisitorMember(lifeGroupId, data);
      await fetchMembers(); // Refresh the list
    } catch (error) {
      console.error('Error removing visitor member:', error);
      alert('Gagal menghapus pengunjung. Silakan coba lagi.');
    }
  };

  // Exit lifegroup functionality
  const handleExitLifeGroup = async () => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    if (!confirm('Apakah Anda yakin ingin keluar dari life group ini?')) {
      return;
    }

    try {
      const data: RemovePersonMemberRequest = {
        person_id: currentUserId,
      };
      await lifeGroupApi.removePersonMember(lifeGroupId, data);
      alert('Anda berhasil keluar dari life group ini.');
      // Redirect to lifegroup list or dashboard
      window.location.href = '/dashboard/lifegroup';
    } catch (error) {
      console.error('Error exiting life group:', error);
      alert('Gagal keluar dari life group. Silakan coba lagi.');
    }
  };

  // Helper to get existing member IDs for filtering
  const existingPersonIds = (personMembers || []).map(member => member.person_id);
  const existingVisitorIds = (visitorMembers || []).map(member => member.visitor_id);

  // Count leaders for display
  const leaderCount = (personMembers || []).filter(m => m.position === 'LEADER').length;
  const coLeaderCount = (personMembers || []).filter(m => m.position === 'CO_LEADER').length;

  return (
    <div className="space-y-6">
      {/* Member Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-600">
            <FiUsers className="w-4 h-4 mr-2" />
            <span>{(personMembers || []).length} Person • {(visitorMembers || []).length} Visitor</span>
            {leaderCount > 0 && (
              <div className="ml-4 flex items-center">
                <Crown className="w-3 h-3 text-yellow-500 mr-1" />
                <span className="text-xs text-yellow-600">
                  {leaderCount + coLeaderCount} Pemimpin
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        {/* Add Member Buttons */}
        {canAddEditMembers && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddPersonModal(true)}
              className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <FiUserPlus className="w-4 h-4 mr-2" />
              Tambah Anggota Person
            </button>
            <button
              onClick={() => setShowAddVisitorModal(true)}
              className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              <div className="w-4 h-4 mr-2 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full flex items-center justify-center">
                <span className="text-purple-800 text-xs">+</span>
              </div>
              Tambah Visitor
            </button>
          </div>
        )}

        {/* Exit Lifegroup Button - Only show if user is a member */}
        {userRole && userRole !== 'pic' && (
          <button
            onClick={handleExitLifeGroup}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <FiLogOut className="w-4 h-4 mr-2" />
            Keluar
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        /* Unified Member Table */
        <UnifiedMemberTable
          personMembers={personMembers}
          visitorMembers={visitorMembers}
          onUpdatePersonPosition={handleUpdatePersonPosition}
          onRemovePersonMember={handleRemovePersonMember}
          onRemoveVisitorMember={handleRemoveVisitorMember}
          canManageMembers={canManageMembers}
          canAddEditMembers={canAddEditMembers}
          canDeleteMembers={canDeleteMembers}
          canEditPositions={canEditPositions}
          userRole={userRole}
          lifeGroup={lifeGroup}
        />
      )}

      {/* Modals */}
      <AddPersonMemberModal
        isOpen={showAddPersonModal}
        onClose={() => setShowAddPersonModal(false)}
        onAdd={handleAddPersonMember}
        existingPersonIds={existingPersonIds}
        lifeGroupChurchId={lifeGroupChurchId}
      />

      <AddVisitorMemberModal
        isOpen={showAddVisitorModal}
        onClose={() => setShowAddVisitorModal(false)}
        onAdd={handleAddVisitorMember}
        existingVisitorIds={existingVisitorIds}
      />
    </div>
  );
}