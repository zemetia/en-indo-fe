'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { FiHome, FiPlus, FiSearch, FiTrash2, FiEdit, FiMapPin, FiPhone, FiMail, FiGlobe, FiRefreshCw } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/context/ToastContext';
import { churchService, Church, ChurchSearchParams } from '@/lib/church-service';
import Skeleton from '@/components/Skeleton';

export default function ChurchManagementPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [churches, setChurches] = useState<Church[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [confirmationText, setConfirmationText] = useState('');

  useEffect(() => {
    fetchChurches();
  }, [currentPage, searchTerm]);

  const fetchChurches = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params: ChurchSearchParams = {
        page: currentPage,
        per_page: 12,
      };
      
      if (searchTerm) {
        params.name = searchTerm;
      }
      
      console.log('Fetching churches with params:', params);
      const response = await churchService.getAll(params);
      console.log('Church service response:', response);
      setChurches(response.data || []);
      setTotalPages(response.max_page || 1);
      setTotalCount(response.count || 0);
      console.log('Set churches count:', response.data?.length);
    } catch (error) {
      console.error('Failed to fetch churches:', error);
      setError('Gagal memuat data gereja. Silakan coba lagi.');
      showToast('Gagal memuat data gereja.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedChurch) return;
    
    const expectedText = `hapus ${selectedChurch.name}`;
    if (confirmationText !== expectedText) {
      showToast(`Silakan ketik "${expectedText}" untuk mengonfirmasi penghapusan.`, 'error');
      return;
    }
    
    try {
      setIsDeleting(true);
      await churchService.delete(selectedChurch.id);
      
      // Remove from local state
      setChurches(prev => prev.filter(c => c.id !== selectedChurch.id));
      setTotalCount(prev => prev - 1);
      showToast(`Gereja ${selectedChurch.name} berhasil dihapus.`, 'success');
      setShowConfirmation(false);
      setSelectedChurch(null);
      setConfirmationText('');
    } catch (error) {
      console.error('Failed to delete church:', error);
      showToast('Gagal menghapus gereja.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchChurches();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredChurches = React.useMemo(() => {
    return churches || [];
  }, [churches]);

  if (error) {
    return (
      <div className='space-y-6'>
        <FeaturedCard
          title='Manajemen Gereja'
          description='Kelola data gereja, tambah gereja baru, dan atur informasi gereja.'
          actionLabel='Tambah Gereja Baru'
          onAction={() => router.push('/dashboard/church/tambah')}
          gradientFrom='from-blue-500'
          gradientTo='to-indigo-500'
        />
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
          <div className='text-center py-16 text-red-500 bg-red-50 rounded-lg border border-red-200'>
            <FiHome className='mx-auto h-12 w-12 text-red-400 mb-4' />
            <h3 className="text-lg font-semibold text-red-800">Terjadi Kesalahan</h3>
            <p>{error}</p>
            <Button onClick={handleRefresh} className="mt-4">
              <FiRefreshCw className="mr-2 h-4 w-4" />
              Muat Ulang
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Manajemen Gereja'
        description='Kelola data gereja, tambah gereja baru, dan atur informasi gereja.'
        actionLabel='Tambah Gereja Baru'
        onAction={() => router.push('/dashboard/church/tambah')}
        gradientFrom='from-blue-500'
        gradientTo='to-indigo-500'
      />

      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>Daftar Gereja</h2>
            <p className='text-sm text-gray-500 mt-1'>
              {isLoading ? 'Memuat data...' : `Total ${totalCount} gereja ditemukan.`}
            </p>
          </div>
          <div className='flex w-full md:w-auto space-x-4'>
            <div className='relative flex-grow'>
              <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Cari nama gereja...'
                className='pl-10'
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
              <FiRefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}/>
              Refresh
            </Button>
            <Button asChild>
              <Link href="/dashboard/church/tambah">
                <FiPlus className='mr-2 h-4 w-4'/>
                Tambah
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex space-x-2 pt-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredChurches && filteredChurches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChurches.map((church, index) => (
              <motion.div 
                key={church.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <FiHome className="text-blue-500 w-5 h-5" />
                          {church.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 mt-1">
                          {church.kabupaten}, {church.provinsi}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-grow pt-0">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <FiMapPin className="text-gray-400 w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="break-words">{church.address}</span>
                      </div>
                      
                      {church.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiPhone className="text-gray-400 w-4 h-4" />
                          <span>{church.phone}</span>
                        </div>
                      )}
                      
                      {church.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiMail className="text-gray-400 w-4 h-4" />
                          <span className="break-all">{church.email}</span>
                        </div>
                      )}
                      
                      {church.website && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiGlobe className="text-gray-400 w-4 h-4" />
                          <a href={church.website} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-500 hover:text-blue-700 break-all">
                            {church.website}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/dashboard/church/${church.id}`)}
                      >
                        <FiEdit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setSelectedChurch(church);
                          setConfirmationText('');
                          setShowConfirmation(true);
                        }}
                        disabled={isDeleting}
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className='text-center py-16 text-gray-500 bg-gray-50 rounded-lg'>
            <FiHome className='mx-auto h-12 w-12 text-gray-400 mb-4' />
            <h3 className="text-lg font-semibold text-gray-800">Tidak Ada Gereja</h3>
            <p>Belum ada gereja yang terdaftar atau tidak ada hasil yang cocok dengan pencarian Anda.</p>
            <Button className="mt-4" onClick={() => router.push('/dashboard/church/tambah')}>
              <FiPlus className="mr-2 h-4 w-4" />
              Tambah Gereja Pertama
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Peringatan: Hapus Gereja</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Anda akan menghapus gereja
                <strong className='text-red-700'> {selectedChurch?.name}</strong>.
              </p>
              <p className="text-red-600 font-medium">
                Tindakan ini akan menghapus SEMUA data yang terkait dengan gereja ini dan TIDAK DAPAT DIBATALKAN.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm font-medium text-red-800 mb-2">
                  Untuk melanjutkan, ketik persis seperti ini:
                </p>
                <code className="bg-red-100 text-red-800 px-2 py-1 rounded font-mono text-sm">
                  hapus {selectedChurch?.name}
                </code>
              </div>
              <Input
                type="text"
                placeholder={`Ketik: hapus ${selectedChurch?.name}`}
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                disabled={isDeleting}
                className="mt-2"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setSelectedChurch(null);
                setConfirmationText('');
              }} 
              disabled={isDeleting}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting || !confirmationText || confirmationText !== `hapus ${selectedChurch?.name}`}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Menghapus...' : 'Ya, Hapus Gereja'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}