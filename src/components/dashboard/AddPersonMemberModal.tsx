'use client';

import { useState, useEffect } from 'react';
import { FiX, FiUser, FiStar, FiSearch } from 'react-icons/fi';
import { Crown } from 'lucide-react';
import { personService, SimplePerson } from '@/lib/person-service';
import { AddPersonMemberRequest } from '@/lib/lifegroup';

type AddPersonMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: AddPersonMemberRequest) => Promise<void>;
  existingPersonIds: string[];
  lifeGroupChurchId: string;
};

export default function AddPersonMemberModal({
  isOpen,
  onClose,
  onAdd,
  existingPersonIds,
  lifeGroupChurchId,
}: AddPersonMemberModalProps) {
  const [persons, setPersons] = useState<SimplePerson[]>([]);
  const [filteredPersons, setFilteredPersons] = useState<SimplePerson[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<'LEADER' | 'CO_LEADER' | 'MEMBER'>('MEMBER');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch persons when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchPersons();
    }
  }, [isOpen, lifeGroupChurchId]);

  // Filter persons based on search term
  useEffect(() => {
    const filtered = persons.filter(person => 
      person.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPersons(filtered);
  }, [persons, searchTerm]);

  const fetchPersons = async () => {
    try {
      setLoading(true);
      const response = await personService.getAll({
        church_id: lifeGroupChurchId,
        per_page: 1000
      });
      
      // Filter out persons who are already members
      const availablePersons = response.data.filter(
        person => !existingPersonIds.includes(person.id)
      );
      
      setPersons(availablePersons);
      setFilteredPersons(availablePersons);
    } catch (error) {
      console.error('Error fetching persons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPersonId) {
      alert('Silakan pilih person terlebih dahulu');
      return;
    }

    try {
      setSubmitting(true);
      await onAdd({
        person_id: selectedPersonId,
        position: selectedPosition,
      });
      
      // Reset form
      setSelectedPersonId('');
      setSelectedPosition('MEMBER');
      setSearchTerm('');
      onClose();
    } catch (error) {
      console.error('Error adding person member:', error);
      alert('Gagal menambahkan anggota. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
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

  const handleClose = () => {
    setSelectedPersonId('');
    setSelectedPosition('MEMBER');
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>
      
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Tambah Anggota Person
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Position Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posisi
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['MEMBER', 'CO_LEADER', 'LEADER'] as const).map((position) => (
                  <label
                    key={position}
                    className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedPosition === position
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="position"
                      value={position}
                      checked={selectedPosition === position}
                      onChange={(e) => setSelectedPosition(e.target.value as typeof position)}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      {getPositionIcon(position)}
                      <span className="ml-2 text-sm font-medium">
                        {position === 'LEADER' ? 'Pemimpin' : 
                         position === 'CO_LEADER' ? 'Wakil Pemimpin' : 'Anggota'}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Person Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Person
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama atau email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Person List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredPersons.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {persons.length === 0 ? 
                    'Tidak ada person yang tersedia untuk ditambahkan' :
                    'Tidak ada person yang cocok dengan pencarian'
                  }
                </div>
              ) : (
                filteredPersons.map((person) => (
                  <label
                    key={person.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedPersonId === person.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="person"
                      value={person.id}
                      checked={selectedPersonId === person.id}
                      onChange={(e) => setSelectedPersonId(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3">
                          {person.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{person.nama}</div>
                          <div className="text-sm text-gray-500">{person.email || 'Tidak ada email'}</div>
                        </div>
                      </div>
                      {person.nomor_telepon && (
                        <div className="text-xs text-gray-500 ml-11 mt-1">
                          {person.nomor_telepon}
                        </div>
                      )}
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!selectedPersonId || submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Menambahkan...' : 'Tambah Anggota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}