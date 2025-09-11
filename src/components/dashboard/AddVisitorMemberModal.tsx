'use client';

import { useState, useEffect } from 'react';
import { FiX, FiSearch, FiInstagram, FiPhone, FiMapPin, FiCheck, FiUsers } from 'react-icons/fi';
import { visitorApi, VisitorSimple } from '@/lib/visitor-service';
import { AddVisitorMembersBatchRequest, BatchOperationResult } from '@/lib/lifegroup';

type AddVisitorMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: AddVisitorMembersBatchRequest) => Promise<BatchOperationResult>;
  existingVisitorIds: string[];
};

export default function AddVisitorMemberModal({
  isOpen,
  onClose,
  onAdd,
  existingVisitorIds,
}: AddVisitorMemberModalProps) {
  const [visitors, setVisitors] = useState<VisitorSimple[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<VisitorSimple[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVisitorIds, setSelectedVisitorIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch visitors when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchVisitors();
    }
  }, [isOpen]);

  // Filter visitors based on search term
  useEffect(() => {
    const filtered = visitors.filter(visitor => 
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (visitor.ig_username && visitor.ig_username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (visitor.phone_number && visitor.phone_number.includes(searchTerm))
    );
    setFilteredVisitors(filtered);
  }, [visitors, searchTerm]);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const allVisitors = await visitorApi.getAll();
      
      // Filter out visitors who are already members and format for display
      const availableVisitors = allVisitors
        .filter(visitor => !existingVisitorIds.includes(visitor.id))
        .map(visitor => ({
          id: visitor.id,
          name: visitor.name,
          ig_username: visitor.ig_username,
          phone_number: visitor.phone_number,
          kabupaten_id: visitor.kabupaten_id,
          kabupaten: visitor.kabupaten,
        }));
      
      setVisitors(availableVisitors);
      setFilteredVisitors(availableVisitors);
    } catch (error) {
      console.error('Error fetching visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedVisitorIds.size === 0) {
      alert('Silakan pilih minimal satu pengunjung terlebih dahulu');
      return;
    }

    try {
      setSubmitting(true);
      const result = await onAdd({
        visitor_ids: Array.from(selectedVisitorIds),
      });
      
      // Show result summary
      if (result.failed > 0) {
        const failedMessages = result.errors?.map(e => `${e.id}: ${e.error}`).join('\\n') || '';
        alert(`Berhasil menambahkan ${result.successful} dari ${result.total_requested} pengunjung.\\n\\nError:\\n${failedMessages}`);
      } else {
        alert(`Berhasil menambahkan ${result.successful} pengunjung!`);
      }
      
      // Reset form
      setSelectedVisitorIds(new Set());
      setSearchTerm('');
      onClose();
    } catch (error) {
      console.error('Error adding visitor members:', error);
      alert('Gagal menambahkan pengunjung. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPhoneNumber = (phoneNumber?: string) => {
    if (!phoneNumber) return '';
    
    // Format Indonesian phone numbers
    if (phoneNumber.startsWith('62')) {
      return `+${phoneNumber}`;
    } else if (phoneNumber.startsWith('0')) {
      return phoneNumber;
    }
    return phoneNumber;
  };

  const handleClose = () => {
    setSelectedVisitorIds(new Set());
    setSearchTerm('');
    onClose();
  };

  const handleVisitorToggle = (visitorId: string) => {
    const newSelected = new Set(selectedVisitorIds);
    if (newSelected.has(visitorId)) {
      newSelected.delete(visitorId);
    } else {
      newSelected.add(visitorId);
    }
    setSelectedVisitorIds(newSelected);
  };

  const isVisitorSelected = (visitorId: string) => selectedVisitorIds.has(visitorId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>
      
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Tambah Pengunjung
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Pilih pengunjung yang akan ditambahkan ke life group ini.
            </p>
            {selectedVisitorIds.size > 0 && (
              <div className="flex items-center mt-2 text-sm text-purple-600">
                <FiUsers className="w-4 h-4 mr-1" />
                <span>{selectedVisitorIds.size} pengunjung dipilih</span>
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
            {/* Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm">ℹ</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-purple-800">
                    Tentang Pengunjung
                  </h3>
                  <p className="text-sm text-purple-700 mt-1">
                    Pengunjung akan ditambahkan untuk pelacakan kehadiran dan keterlibatan dalam life group.
                  </p>
                </div>
              </div>
            </div>

            {/* Visitor Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Pengunjung
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, Instagram, atau nomor telepon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Visitor List */}
            <div className="flex-1 min-h-0">
              <div className="h-full overflow-y-auto space-y-2 pr-2 max-h-64">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filteredVisitors.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {visitors.length === 0 ? 
                      'Tidak ada pengunjung yang tersedia untuk ditambahkan' :
                      'Tidak ada pengunjung yang cocok dengan pencarian'
                    }
                  </div>
                ) : (
                  filteredVisitors.map((visitor) => {
                    const isSelected = isVisitorSelected(visitor.id);
                    return (
                      <div
                        key={visitor.id}
                        className={`border rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleVisitorToggle(visitor.id)}
                      >
                        <div className="p-4">
                          <div className="flex items-center">
                            <div className="relative mr-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleVisitorToggle(visitor.id)}
                                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                                onClick={(e) => e.stopPropagation()}
                              />
                              {isSelected && (
                                <FiCheck className="absolute top-0 left-0 w-4 h-4 text-white pointer-events-none" />
                              )}
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                              {visitor.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{visitor.name}</div>
                              <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                {visitor.ig_username && (
                                  <div className="flex items-center text-pink-600">
                                    <FiInstagram className="w-3 h-3 mr-1" />
                                    @{visitor.ig_username}
                                  </div>
                                )}
                                {visitor.phone_number && (
                                  <div className="flex items-center text-green-600">
                                    <FiPhone className="w-3 h-3 mr-1" />
                                    {formatPhoneNumber(visitor.phone_number)}
                                  </div>
                                )}
                                {visitor.kabupaten && (
                                  <div className="flex items-center text-blue-600">
                                    <FiMapPin className="w-3 h-3 mr-1" />
                                    {visitor.kabupaten}
                                  </div>
                                )}
                              </div>
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
              disabled={selectedVisitorIds.size === 0 || submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {submitting ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Menambahkan {selectedVisitorIds.size} pengunjung...
                </span>
              ) : (
                `Tambah ${selectedVisitorIds.size} Pengunjung`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}