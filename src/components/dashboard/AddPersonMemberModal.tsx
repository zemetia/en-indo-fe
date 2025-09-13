'use client';

import { useState, useEffect } from 'react';
import { FiX, FiSearch, FiCheck, FiUsers } from 'react-icons/fi';
import { personService, SimplePerson } from '@/lib/person-service';
import { AddPersonMembersBatchRequest, BatchOperationResult } from '@/lib/lifegroup';

type AddPersonMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: AddPersonMembersBatchRequest) => Promise<BatchOperationResult>;
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
  const [selectedPersonIds, setSelectedPersonIds] = useState<Set<string>>(new Set());
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
    
    if (selectedPersonIds.size === 0) {
      alert('Silakan pilih minimal satu person terlebih dahulu');
      return;
    }

    try {
      setSubmitting(true);
      const result = await onAdd({
        person_ids: Array.from(selectedPersonIds),
      });
      
      // Show result summary
      if (result.failed > 0) {
        const failedMessages = result.errors?.map(e => `${e.id}: ${e.error}`).join('\\n') || '';
        alert(`Berhasil menambahkan ${result.successful} dari ${result.total_requested} anggota sebagai Member.\\n\\nError:\\n${failedMessages}`);
      } else {
        alert(`Berhasil menambahkan ${result.successful} anggota sebagai Member!`);
      }
      
      // Reset form
      setSelectedPersonIds(new Set());
      setSearchTerm('');
      onClose();
    } catch (error) {
      console.error('Error adding person members:', error);
      alert('Gagal menambahkan anggota. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedPersonIds(new Set());
    setSearchTerm('');
    onClose();
  };

  const handlePersonToggle = (personId: string) => {
    const newSelected = new Set(selectedPersonIds);
    if (newSelected.has(personId)) {
      newSelected.delete(personId);
    } else {
      newSelected.add(personId);
    }
    setSelectedPersonIds(newSelected);
  };

  const isPersonSelected = (personId: string) => selectedPersonIds.has(personId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>
      
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Tambah Anggota Person
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Semua person yang dipilih akan ditambahkan sebagai Member. Posisi dapat diubah setelahnya.
            </p>
            {selectedPersonIds.size > 0 && (
              <div className="flex items-center mt-2 text-sm text-blue-600">
                <FiUsers className="w-4 h-4 mr-1" />
                <span>{selectedPersonIds.size} person dipilih</span>
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 p-6 overflow-hidden flex flex-col">
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Person List */}
            <div className="flex-1 min-h-0">
              <div className="h-full overflow-y-auto space-y-2 pr-2 max-h-64">
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
                  filteredPersons.map((person) => {
                    const isSelected = isPersonSelected(person.id);
                    return (
                      <div
                        key={person.id}
                        className={`border rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handlePersonToggle(person.id)}
                      >
                        <div className="p-4">
                          <div className="flex items-center">
                            <div className="relative mr-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handlePersonToggle(person.id)}
                                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                                onClick={(e) => e.stopPropagation()}
                              />
                              {isSelected && (
                                <FiCheck className="absolute top-0 left-0 w-4 h-4 text-white pointer-events-none" />
                              )}
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                              {person.nama.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{person.nama}</div>
                              <div className="text-sm text-gray-500">{person.email || 'Tidak ada email'}</div>
                              {person.nomor_telepon && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {person.nomor_telepon}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={selectedPersonIds.size === 0 || submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {submitting ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Menambahkan {selectedPersonIds.size} anggota...
                </span>
              ) : (
                `Tambah ${selectedPersonIds.size} Anggota sebagai Member`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}