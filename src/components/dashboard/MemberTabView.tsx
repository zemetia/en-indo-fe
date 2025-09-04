'use client';

import { useState, useEffect } from 'react';
import { FiUsers, FiUserPlus } from 'react-icons/fi';
import { Crown } from 'lucide-react';
import PersonMemberTable from './PersonMemberTable';
import VisitorMemberTable from './VisitorMemberTable';
import AddPersonMemberModal from './AddPersonMemberModal';
import AddVisitorMemberModal from './AddVisitorMemberModal';
import { 
  lifeGroupApi, 
  LifeGroupPersonMember, 
  LifeGroupVisitorMember,
  AddPersonMemberRequest,
  AddVisitorMemberRequest,
  UpdatePersonMemberPositionRequest,
  RemovePersonMemberRequest,
  RemoveVisitorMemberRequest
} from '@/lib/lifegroup';

type MemberTabViewProps = {
  lifeGroupId: string;
  lifeGroupChurchId: string;
  canManageMembers: boolean;
  onMemberCountChange?: (personCount: number, visitorCount: number) => void;
};

export default function MemberTabView({
  lifeGroupId,
  lifeGroupChurchId,
  canManageMembers,
  onMemberCountChange,
}: MemberTabViewProps) {
  const [activeTab, setActiveTab] = useState<'person' | 'visitor'>('person');
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
    if (onMemberCountChange) {
      onMemberCountChange(personMembers.length, visitorMembers.length);
    }
  }, [personMembers.length, visitorMembers.length, onMemberCountChange]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const [personResponse, visitorResponse] = await Promise.all([
        lifeGroupApi.getPersonMembers(lifeGroupId),
        lifeGroupApi.getVisitorMembers(lifeGroupId),
      ]);
      
      setPersonMembers(personResponse);
      setVisitorMembers(visitorResponse);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Person member handlers
  const handleAddPersonMember = async (data: AddPersonMemberRequest) => {
    try {
      await lifeGroupApi.addPersonMember(lifeGroupId, data);
      await fetchMembers(); // Refresh the list
    } catch (error) {
      console.error('Error adding person member:', error);
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
    if (!confirm(`Apakah Anda yakin ingin menghapus ${member.person.nama} dari life group ini?`)) {
      return;
    }

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
  const handleAddVisitorMember = async (data: AddVisitorMemberRequest) => {
    try {
      await lifeGroupApi.addVisitorMember(lifeGroupId, data);
      await fetchMembers(); // Refresh the list
    } catch (error) {
      console.error('Error adding visitor member:', error);
      throw error;
    }
  };

  const handleRemoveVisitorMember = async (member: LifeGroupVisitorMember) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${member.visitor.name} dari life group ini?`)) {
      return;
    }

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

  // Helper to get existing member IDs for filtering
  const existingPersonIds = personMembers.map(member => member.person_id);
  const existingVisitorIds = visitorMembers.map(member => member.visitor_id);

  // Count leaders for display
  const leaderCount = personMembers.filter(m => m.position === 'LEADER').length;
  const coLeaderCount = personMembers.filter(m => m.position === 'CO_LEADER').length;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('person')}
            className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'person'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FiUsers className="w-4 h-4 mr-2" />
            Anggota Person ({personMembers.length})
            {leaderCount > 0 && (
              <div className="ml-2 flex items-center">
                <Crown className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-yellow-600 ml-1">
                  {leaderCount + coLeaderCount} Pemimpin
                </span>
              </div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('visitor')}
            className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'visitor'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="w-4 h-4 mr-2 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">V</span>
            </div>
            Pengunjung ({visitorMembers.length})
          </button>
        </nav>
      </div>

      {/* Add Member Buttons */}
      {canManageMembers && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowAddPersonModal(true)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'person'
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FiUserPlus className="w-4 h-4 mr-2" />
            Tambah Anggota Person
          </button>
          <button
            onClick={() => setShowAddVisitorModal(true)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'visitor'
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="w-4 h-4 mr-2 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">+</span>
            </div>
            Tambah Pengunjung
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        /* Tab Content */
        <div>
          {activeTab === 'person' ? (
            <div>
              <PersonMemberTable
                members={personMembers}
                onUpdatePosition={handleUpdatePersonPosition}
                onRemove={handleRemovePersonMember}
                canManageMembers={canManageMembers}
              />
            </div>
          ) : (
            <div>
              <VisitorMemberTable
                members={visitorMembers}
                onRemove={handleRemoveVisitorMember}
                canManageMembers={canManageMembers}
              />
            </div>
          )}
        </div>
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