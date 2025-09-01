'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { FiAward, FiHome, FiPlus, FiSearch, FiTrash2, FiUser, FiStar, FiTag, FiRefreshCw } from 'react-icons/fi';
import Image from 'next/image';

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
import { useToast } from '@/context/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { pelayananService, PelayananAssignment } from '@/lib/pelayanan-service';
import Skeleton from '@/components/Skeleton';

interface GroupedAssignment {
    personId: string;
    personName: string;
    personAvatar: string;
    roles: {
        id: string;
        pelayananName: string;
        churchName: string;
        isPic: boolean;
    }[];
}

export default function ManagePelayananPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<PelayananAssignment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<PelayananAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch assignments from API
  useEffect(() => {
    fetchAssignments();
  }, [currentPage]);

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await pelayananService.getAllAssignments(currentPage, 10);
      setAssignments(response.data);
      setTotalPages(response.max_page);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      setError('Gagal memuat data pelayanan. Silakan coba lagi.');
      showToast('Gagal memuat data pelayanan.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnassign = async () => {
    if (!selectedAssignment) return;
    
    try {
      setIsDeleting(true);
      await pelayananService.unassignPelayanan(selectedAssignment.id);
      
      // Remove from local state
      setAssignments(prev => prev.filter(a => a.id !== selectedAssignment.id));
      showToast(`Pelayanan untuk ${selectedAssignment.person_name} berhasil dihapus.`, 'success');
      setShowConfirmation(false);
      setSelectedAssignment(null);
    } catch (error) {
      console.error('Failed to unassign pelayanan:', error);
      showToast('Gagal menghapus penugasan pelayanan.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = () => {
    fetchAssignments();
  };
  
  const filteredAndGroupedArray = React.useMemo(() => {
      const groupedByPerson = assignments.reduce((acc, assignment) => {
          const personId = assignment.person_id;
          const personName = assignment.person_name;
          const personAvatar = 'https://placehold.co/100x100.png'; // Default avatar
          
          if (!acc[personId]) {
              acc[personId] = {
                  personId,
                  personName,
                  personAvatar,
                  roles: [],
              };
          }
          acc[personId].roles.push({
              id: assignment.id,
              pelayananName: assignment.pelayanan,
              churchName: assignment.church_name,
              isPic: assignment.is_pic,
          });
          return acc;
      }, {} as Record<string, GroupedAssignment>);

      if (!searchTerm) {
          return Object.values(groupedByPerson);
      }

      const lowercasedFilter = searchTerm.toLowerCase();
      return Object.values(groupedByPerson).filter(
          (personGroup) =>
              personGroup.personName.toLowerCase().includes(lowercasedFilter) ||
              personGroup.roles.some(
                  (role) =>
                      role.pelayananName.toLowerCase().includes(lowercasedFilter) ||
                      role.churchName.toLowerCase().includes(lowercasedFilter)
              )
      );
  }, [assignments, searchTerm]);

  if (error) {
    return (
      <div className='space-y-6'>
        <FeaturedCard
          title='Manajemen Pelayanan'
          description='Lihat, atur, dan hapus penugasan pelayanan untuk semua jemaat.'
          actionLabel='Assign Pelayanan Baru'
          onAction={() => router.push('/dashboard/pelayanan/assign')}
          gradientFrom='from-indigo-500'
          gradientTo='to-purple-500'
        />
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
          <div className='text-center py-16 text-red-500 bg-red-50 rounded-lg border border-red-200'>
            <FiUser className='mx-auto h-12 w-12 text-red-400 mb-4' />
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
        title='Manajemen Pelayanan'
        description='Lihat, atur, dan hapus penugasan pelayanan untuk semua jemaat.'
        actionLabel='Assign Pelayanan Baru'
        onAction={() => router.push('/dashboard/pelayanan/assign')}
        gradientFrom='from-indigo-500'
        gradientTo='to-purple-500'
      />

      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>Daftar Penugasan Pelayanan</h2>
              <p className='text-sm text-gray-500 mt-1'>
                {isLoading ? 'Memuat data...' : `Total ${filteredAndGroupedArray.length} pelayan ditemukan.`}
              </p>
            </div>
            <div className='flex w-full md:w-auto space-x-4'>
                <div className='relative flex-grow'>
                    <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <Input
                        placeholder='Cari nama, pelayanan, atau gereja...'
                        className='pl-10'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
                    <FiRefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}/>
                    Refresh
                </Button>
                <Button asChild>
                    <Link href="/dashboard/pelayanan/assign">
                        <FiPlus className='mr-2 h-4 w-4'/>
                        Assign
                    </Link>
                </Button>
            </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-8 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndGroupedArray.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndGroupedArray.map((personGroup, index) => (
                    <motion.div 
                        key={personGroup.personId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="h-full flex flex-col">
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                    <Image src={personGroup.personAvatar} alt={personGroup.personName} width={48} height={48} className="rounded-full" data-ai-hint="person portrait" />
                                    <div>
                                        <CardTitle>{personGroup.personName}</CardTitle>
                                        <CardDescription>{personGroup.roles.length} peran pelayanan</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="space-y-3">
                                    {personGroup.roles.map(role => (
                                        <div key={role.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className='min-w-0'>
                                                <p className="font-semibold text-gray-800 flex items-center gap-2">
                                                    <FiAward className="text-indigo-500 w-4 h-4"/>
                                                    <span className='truncate'>{role.pelayananName}</span>
                                                </p>
                                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                    <FiHome className="text-gray-400 w-4 h-4"/>
                                                     <span className='truncate'>{role.churchName}</span>
                                                </p>
                                                {role.isPic && (
                                                    <span className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                        <FiStar className='w-3 h-3 mr-1.5'/>
                                                        PIC
                                                    </span>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className='text-red-500 hover:text-red-700 hover:bg-red-50 ml-2 flex-shrink-0'
                                                onClick={() => {
                                                    const assignmentToUnassign = assignments.find(a => a.id === role.id);
                                                    if(assignmentToUnassign) {
                                                        setSelectedAssignment(assignmentToUnassign);
                                                        setShowConfirmation(true);
                                                    }
                                                }}
                                                disabled={isDeleting}
                                            >
                                                <FiTrash2 className='h-4 w-4'/>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        ) : (
            <div className='text-center py-16 text-gray-500 bg-gray-50 rounded-lg'>
                <FiUser className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                <h3 className="text-lg font-semibold text-gray-800">Tidak Ada Hasil</h3>
                <p>Tidak ada data penugasan yang cocok dengan pencarian Anda.</p>
            </div>
        )}
      </div>

       <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Unassign</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus penugasan pelayanan
              <strong className='text-gray-900'> {selectedAssignment?.pelayanan} </strong>
              untuk
              <strong className='text-gray-900'> {selectedAssignment?.person_name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAssignment(null)} disabled={isDeleting}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnassign}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Menghapus...' : 'Ya, Unassign'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
