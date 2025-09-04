'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BsPersonCheck,
  BsGeoAlt,
  BsPlus,
} from 'react-icons/bs';
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiPhone, 
  FiTrash2,
  FiX 
} from 'react-icons/fi';
import { RiInstagramLine } from 'react-icons/ri';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import VisitorEditForm from '@/components/dashboard/VisitorEditForm';
import { visitorApi, visitorInformationApi, type Visitor, type VisitorInformation } from '@/lib/visitor-service';
import { getToken } from '@/lib/helper';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function VisitorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const visitorId = params.visitor_id as string;

  const [visitor, setVisitor] = React.useState<Visitor | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showAddInfoModal, setShowAddInfoModal] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedInfoId, setSelectedInfoId] = React.useState<string>('');
  const [formData, setFormData] = React.useState({ label: '', value: '' });

  const fetchVisitor = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        setError('Token autentikasi tidak ditemukan. Silakan login kembali.');
        return;
      }

      const visitorData = await visitorApi.getById(visitorId);
      setVisitor(visitorData);
      
    } catch (error) {
      console.error('Failed to fetch visitor:', error);
      setError('Gagal memuat data tamu. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (visitorId) {
      fetchVisitor();
    }
  }, [visitorId]);

  const handleAddInformation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitor || !formData.label || !formData.value) return;

    try {
      await visitorInformationApi.create(visitor.id, formData);
      setFormData({ label: '', value: '' });
      setShowAddInfoModal(false);
      await fetchVisitor(); // Refresh data
    } catch (error) {
      setError('Gagal menambah informasi tamu.');
    }
  };

  const handleDeleteInformation = async () => {
    if (!selectedInfoId) return;

    try {
      await visitorInformationApi.delete(selectedInfoId);
      setShowDeleteDialog(false);
      setSelectedInfoId('');
      await fetchVisitor(); // Refresh data
    } catch (error) {
      setError('Gagal menghapus informasi tamu.');
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center py-20'>
        <div className='w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  if (error || !visitor) {
    return (
      <div className='text-center py-20 bg-red-50 rounded-xl border border-red-200 max-w-2xl mx-auto'>
        <BsPersonCheck className='w-12 h-12 text-red-400 mx-auto mb-4' />
        <h3 className='text-lg font-semibold text-red-800 mb-2'>Gagal Memuat Data</h3>
        <p className='text-red-600 mb-4'>{error || 'Data tamu tidak ditemukan'}</p>
        <div className='flex justify-center space-x-4'>
          <button
            onClick={() => router.back()}
            className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors'
          >
            Kembali
          </button>
          <button
            onClick={fetchVisitor}
            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title={`Detail Tamu - ${visitor.name}`}
        description='Lihat dan kelola informasi detail tamu'
        actionLabel='Kembali ke Daftar Tamu'
        gradientFrom='from-green-500'
        gradientTo='to-green-700'
        onAction={() => router.push('/dashboard/tamu')}
      />

      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'
        >
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-gray-900'>Informasi Dasar</h2>
            <button
              onClick={() => setShowEditModal(true)}
              className='flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
            >
              <FiEdit2 className='w-4 h-4' />
              <span>Edit</span>
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='flex items-center space-x-4'>
              <div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0'>
                <BsPersonCheck className='w-6 h-6 text-green-600'/>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Nama Lengkap</p>
                <p className='text-lg font-semibold text-gray-900'>{visitor.name}</p>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <FiPhone className='w-5 h-5 text-gray-400' />
              <div>
                <p className='text-sm text-gray-500'>WhatsApp</p>
                <p className='text-gray-900'>{visitor.phone_number || 'Tidak tersedia'}</p>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <RiInstagramLine className='w-5 h-5 text-gray-400' />
              <div>
                <p className='text-sm text-gray-500'>Instagram</p>
                <p className='text-gray-900'>{visitor.ig_username || 'Tidak tersedia'}</p>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <BsGeoAlt className='w-5 h-5 text-gray-400' />
              <div>
                <p className='text-sm text-gray-500'>Kota</p>
                <p className='text-gray-900'>{visitor.kabupaten || 'Tidak tersedia'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'
        >
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-gray-900'>Informasi Tambahan</h2>
            <button
              onClick={() => setShowAddInfoModal(true)}
              className='flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              <BsPlus className='w-4 h-4' />
              <span>Tambah Info</span>
            </button>
          </div>

          {visitor.information && visitor.information.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {visitor.information.map((info, index) => (
                <motion.div
                  key={info.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className='p-4 bg-gray-50 rounded-lg border border-gray-200'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-gray-600 mb-1'>{info.label}</p>
                      <p className='text-gray-900 break-words'>{info.value}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedInfoId(info.id);
                        setShowDeleteDialog(true);
                      }}
                      className='ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors'
                    >
                      <FiTrash2 className='w-4 h-4' />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8 text-gray-500'>
              <p>Belum ada informasi tambahan.</p>
              <p className='text-sm mt-1'>Klik "Tambah Info" untuk menambahkan informasi baru.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Information Modal */}
      <Dialog open={showAddInfoModal} onOpenChange={setShowAddInfoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Informasi</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddInformation} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Label
              </label>
              <input
                type='text'
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder='Misal: Universitas, Pekerjaan, Alamat'
                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Nilai
              </label>
              <input
                type='text'
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder='Masukkan nilai informasi'
                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
            <div className='flex justify-end space-x-3 pt-4'>
              <button
                type='button'
                onClick={() => {
                  setShowAddInfoModal(false);
                  setFormData({ label: '', value: '' });
                }}
                className='px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
              >
                Batal
              </button>
              <button
                type='submit'
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                Tambah
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Visitor Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Informasi Tamu</DialogTitle>
          </DialogHeader>
          <VisitorEditForm
            visitor={visitor}
            onSuccess={() => {
              setShowEditModal(false);
              fetchVisitor();
            }}
            onCancel={() => setShowEditModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus informasi ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedInfoId('')}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInformation}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}