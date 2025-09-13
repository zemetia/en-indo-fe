'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { FiAward, FiPlus, FiSearch, FiTrash2, FiEdit, FiRefreshCw, FiTag } from 'react-icons/fi';

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
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/context/ToastContext';
import { pelayananService, PelayananInfo } from '@/lib/pelayanan-service';
import { departmentService, Department } from '@/lib/department-service';
import Skeleton from '@/components/Skeleton';

export default function ManagePelayananEntitiesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [pelayanan, setPelayanan] = useState<PelayananInfo[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPelayanan, setSelectedPelayanan] = useState<PelayananInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDepartmentLoading, setIsDepartmentLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  useEffect(() => {
    fetchPelayanan();
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchPelayanan();
  }, [selectedDepartment]);

  const fetchPelayanan = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const departmentFilter = selectedDepartment === 'all' ? undefined : selectedDepartment;
      const data = await pelayananService.getAllPelayanan(departmentFilter);
      setPelayanan(data);
    } catch (error) {
      console.error('Failed to fetch pelayanan:', error);
      setError('Gagal memuat data pelayanan. Silakan coba lagi.');
      showToast('Gagal memuat data pelayanan.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      setIsDepartmentLoading(true);
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      showToast('Gagal memuat data departemen.', 'error');
    } finally {
      setIsDepartmentLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPelayanan) return;
    
    const expectedText = `hapus ${selectedPelayanan.pelayanan}`;
    if (confirmationText !== expectedText) {
      showToast(`Silakan ketik "${expectedText}" untuk mengonfirmasi penghapusan.`, 'error');
      return;
    }
    
    try {
      setIsDeleting(true);
      await pelayananService.deletePelayanan(selectedPelayanan.id);
      
      // Remove from local state
      setPelayanan(prev => prev.filter(p => p.id !== selectedPelayanan.id));
      showToast(`Pelayanan ${selectedPelayanan.pelayanan} berhasil dihapus.`, 'success');
      setShowConfirmation(false);
      setSelectedPelayanan(null);
      setConfirmationText('');
    } catch (error) {
      console.error('Failed to delete pelayanan:', error);
      showToast('Gagal menghapus pelayanan.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = () => {
    fetchPelayanan();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('all');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedDepartment !== 'all') count++;
    return count;
  };

  const getSelectedDepartmentName = () => {
    if (selectedDepartment === 'all') return 'Semua Departemen';
    const dept = departments.find(d => d.id === selectedDepartment);
    return dept ? dept.name : 'Departemen Tidak Dikenal';
  };

  const filteredPelayanan = React.useMemo(() => {
    if (!searchTerm) return pelayanan;
    
    const lowercasedFilter = searchTerm.toLowerCase();
    return pelayanan.filter((p) =>
      p.pelayanan.toLowerCase().includes(lowercasedFilter) ||
      p.description.toLowerCase().includes(lowercasedFilter)
    );
  }, [pelayanan, searchTerm]);

  if (error) {
    return (
      <div className='space-y-6'>
        <FeaturedCard
          title='Kelola Jenis Pelayanan'
          description='Tambah, edit, dan hapus jenis-jenis pelayanan dalam sistem.'
          actionLabel='Tambah Pelayanan Baru'
          onAction={() => router.push('/dashboard/pelayanan/tambah')}
          gradientFrom='from-purple-500'
          gradientTo='to-pink-500'
        />
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
          <div className='text-center py-16 text-red-500 bg-red-50 rounded-lg border border-red-200'>
            <FiAward className='mx-auto h-12 w-12 text-red-400 mb-4' />
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
        title='Kelola Jenis Pelayanan'
        description='Tambah, edit, dan hapus jenis-jenis pelayanan dalam sistem.'
        actionLabel='Tambah Pelayanan Baru'
        onAction={() => router.push('/dashboard/pelayanan/tambah')}
        gradientFrom='from-purple-500'
        gradientTo='to-pink-500'
      />

      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>Daftar Pelayanan</h2>
            <p className='text-sm text-gray-500 mt-1'>
              {isLoading ? 'Memuat data...' : (
                <>
                  Total {filteredPelayanan.length} jenis pelayanan ditemukan
                  {selectedDepartment !== 'all' && ` dari ${getSelectedDepartmentName()}`}
                  {searchTerm && ` dengan pencarian "${searchTerm}"`}
                </>
              )}
            </p>
          </div>
          <div className='flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-4'>
            <div className='flex space-x-2 flex-grow'>
              <div className='relative flex-grow'>
                <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Cari pelayanan...'
                  className='pl-10'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Select 
                value={selectedDepartment} 
                onValueChange={setSelectedDepartment}
                disabled={isLoading || isDepartmentLoading}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter Departemen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Departemen</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex space-x-2'>
              {getActiveFiltersCount() > 0 && (
                <Button onClick={handleResetFilters} variant="outline" size="sm" disabled={isLoading}>
                  Reset ({getActiveFiltersCount()})
                </Button>
              )}
              <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
                <FiRefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}/>
                Refresh
              </Button>
              <Button asChild>
                <Link href="/dashboard/pelayanan/tambah">
                  <FiPlus className='mr-2 h-4 w-4'/>
                  Tambah
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-24" />
                  <div className="flex space-x-2 pt-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPelayanan.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPelayanan.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FiAward className="text-purple-500 w-5 h-5" />
                      {item.pelayanan}
                    </CardTitle>
                    <Badge variant="secondary" className="w-fit mt-2">
                      <FiTag className="w-3 h-3 mr-1" />
                      {item.department.name}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="flex-grow pt-0">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          {item.description || 'Tidak ada deskripsi.'}
                        </p>
                      </div>
                      
                      <div className="text-xs text-gray-400 space-y-1">
                        <p>Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                        <p>Diperbarui: {new Date(item.updated_at).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/dashboard/pelayanan/${item.id}`)}
                      >
                        <FiEdit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setSelectedPelayanan(item);
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
            <FiAward className='mx-auto h-12 w-12 text-gray-400 mb-4' />
            <h3 className="text-lg font-semibold text-gray-800">Tidak Ada Pelayanan</h3>
            <p>Belum ada jenis pelayanan yang terdaftar atau tidak ada hasil yang cocok dengan pencarian Anda.</p>
            <Button className="mt-4" onClick={() => router.push('/dashboard/pelayanan/tambah')}>
              <FiPlus className="mr-2 h-4 w-4" />
              Tambah Pelayanan Pertama
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Peringatan: Hapus Pelayanan</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Anda akan menghapus jenis pelayanan
                <strong className='text-red-700'> {selectedPelayanan?.pelayanan}</strong>.
              </p>
              <p className="text-red-600 font-medium">
                Tindakan ini akan menghapus SEMUA penugasan yang terkait dengan pelayanan ini dan TIDAK DAPAT DIBATALKAN.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm font-medium text-red-800 mb-2">
                  Untuk melanjutkan, ketik persis seperti ini:
                </p>
                <code className="bg-red-100 text-red-800 px-2 py-1 rounded font-mono text-sm">
                  hapus {selectedPelayanan?.pelayanan}
                </code>
              </div>
              <Input
                type="text"
                placeholder={`Ketik: hapus ${selectedPelayanan?.pelayanan}`}
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
                setSelectedPelayanan(null);
                setConfirmationText('');
              }} 
              disabled={isDeleting}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting || !confirmationText || confirmationText !== `hapus ${selectedPelayanan?.pelayanan}`}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Menghapus...' : 'Ya, Hapus Pelayanan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}