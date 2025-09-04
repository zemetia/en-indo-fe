'use client';

import { useState, useEffect } from 'react';
import { FiX, FiSearch, FiInstagram, FiPhone, FiMapPin } from 'react-icons/fi';
import { visitorApi, VisitorSimple } from '@/lib/visitor-service';
import { AddVisitorMemberRequest } from '@/lib/lifegroup';

type AddVisitorMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: AddVisitorMemberRequest) => Promise<void>;
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
  const [selectedVisitorId, setSelectedVisitorId] = useState('');
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
    
    if (!selectedVisitorId) {
      alert('Silakan pilih pengunjung terlebih dahulu');
      return;
    }

    try {
      setSubmitting(true);
      await onAdd({
        visitor_id: selectedVisitorId,
      });
      
      // Reset form
      setSelectedVisitorId('');
      setSearchTerm('');
      onClose();
    } catch (error) {
      console.error('Error adding visitor member:', error);
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
    setSelectedVisitorId('');
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
            Tambah Pengunjung
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
            {/* Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
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
                    Pengunjung tidak memiliki posisi khusus dalam life group. 
                    Mereka akan ditambahkan sebagai anggota biasa untuk pelacakan kehadiran dan keterlibatan.
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Visitor List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
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
                filteredVisitors.map((visitor) => (
                  <label
                    key={visitor.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedVisitorId === visitor.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="visitor"
                      value={visitor.id}
                      checked={selectedVisitorId === visitor.id}
                      onChange={(e) => setSelectedVisitorId(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3">
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
              disabled={!selectedVisitorId || submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Menambahkan...' : 'Tambah Pengunjung'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}