'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { FiAward, FiHome, FiPlus, FiSearch, FiTrash2, FiUser, FiStar, FiTag, FiRefreshCw, FiEye, FiUserPlus, FiUserCheck, FiUserX, FiUsers } from 'react-icons/fi';
import Image from 'next/image';
import Select from 'react-select';

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/context/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { pelayananService, PelayananAssignment, PelayananInfo } from '@/lib/pelayanan-service';
import { churchService, Church } from '@/lib/church-service';
import { departmentService, Department } from '@/lib/department-service';
import { userService } from '@/lib/user-service';
import Skeleton from '@/components/Skeleton';

interface GroupedAssignment {
    personId: string;
    personName: string;
    personAvatar: string;
    hasUserAccount: boolean;
    isUserActive: boolean;
    roles: {
        id: string;
        pelayananName: string;
        churchName: string;
        departmentName: string;
        isPic: boolean;
    }[];
}

interface SelectOption {
    value: string;
    label: string;
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
  
  // Show More Modal states
  const [showAllRolesModal, setShowAllRolesModal] = useState(false);
  const [selectedPersonRoles, setSelectedPersonRoles] = useState<GroupedAssignment | null>(null);
  
  // Direct Assignment Modal states
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPersonForAssign, setSelectedPersonForAssign] = useState<GroupedAssignment | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [churches, setChurches] = useState<Church[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [pelayananList, setPelayananList] = useState<PelayananInfo[]>([]);
  const [selectedChurch, setSelectedChurch] = useState<SelectOption | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<SelectOption | null>(null);
  const [selectedPelayanan, setSelectedPelayanan] = useState<SelectOption | null>(null);
  const [isPic, setIsPic] = useState(false);
  
  // Account management states
  const [isManagingAccount, setIsManagingAccount] = useState(false);

  // Fetch assignments from API
  useEffect(() => {
    fetchAssignments();
    fetchChurches();
    fetchDepartments();
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

  const fetchChurches = async () => {
    try {
      const churchData = await churchService.getSimpleList();
      setChurches(churchData);
    } catch (error) {
      console.error('Failed to fetch churches:', error);
    }
  };
  
  const fetchDepartments = async () => {
    try {
      const departmentData = await departmentService.getAll();
      setDepartments(departmentData);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };
  
  const fetchPelayanan = async (departmentId: string) => {
    try {
      const pelayananData = await pelayananService.getAllPelayanan(departmentId);
      setPelayananList(pelayananData);
    } catch (error) {
      console.error('Failed to fetch pelayanan:', error);
    }
  };

  const handleRefresh = () => {
    fetchAssignments();
  };
  
  const handleShowAllRoles = (personGroup: GroupedAssignment) => {
    setSelectedPersonRoles(personGroup);
    setShowAllRolesModal(true);
  };
  
  const handleDirectAssign = (personGroup: GroupedAssignment) => {
    setSelectedPersonForAssign(personGroup);
    setShowAssignModal(true);
    setSelectedChurch(null);
    setSelectedDepartment(null);
    setSelectedPelayanan(null);
    setIsPic(false);
  };
  
  const handleChurchChange = (option: SelectOption | null) => {
    setSelectedChurch(option);
    setSelectedDepartment(null);
    setSelectedPelayanan(null);
    setPelayananList([]);
  };
  
  const handleDepartmentChange = async (option: SelectOption | null) => {
    setSelectedDepartment(option);
    setSelectedPelayanan(null);
    if (option) {
      await fetchPelayanan(option.value);
    } else {
      setPelayananList([]);
    }
  };
  
  const handleSubmitAssignment = async () => {
    if (!selectedPersonForAssign || !selectedChurch || !selectedDepartment || !selectedPelayanan) {
      showToast('Semua field harus diisi', 'error');
      return;
    }
    
    try {
      setIsAssigning(true);
      await pelayananService.assignPelayanan({
        person_id: selectedPersonForAssign.personId,
        pelayanan_id: selectedPelayanan.value,
        church_id: selectedChurch.value,
        is_pic: isPic
      });
      
      showToast(`Pelayanan berhasil ditambahkan untuk ${selectedPersonForAssign.personName}`, 'success');
      setShowAssignModal(false);
      fetchAssignments(); // Refresh data
    } catch (error) {
      console.error('Failed to assign pelayanan:', error);
      showToast('Gagal menambahkan pelayanan', 'error');
    } finally {
      setIsAssigning(false);
    }
  };
  
  const handleAccountAction = async (personGroup: GroupedAssignment, actionType: 'create' | 'activate' | 'deactivate') => {
    try {
      setIsManagingAccount(true);
      
      switch (actionType) {
        case 'create':
          // For creating account, use ToggleUserActivationStatus which handles account creation
          await userService.toggleActivationStatus(personGroup.personId, true);
          showToast(`Akun berhasil dibuat dan diaktifkan untuk ${personGroup.personName}`, 'success');
          break;
        case 'activate':
          await userService.toggleActivationStatus(personGroup.personId, true);
          showToast(`Akun ${personGroup.personName} berhasil diaktifkan`, 'success');
          break;
        case 'deactivate':
          await userService.toggleActivationStatus(personGroup.personId, false);
          showToast(`Akun ${personGroup.personName} berhasil dinonaktifkan`, 'success');
          break;
      }
      
      // Refresh pelayanan assignments data to get updated account status
      fetchAssignments();
    } catch (error: any) {
      console.error('Account management failed:', error);
      const errorMessage = error.response?.data?.message || 'Gagal melakukan aksi akun';
      showToast(errorMessage, 'error');
    } finally {
      setIsManagingAccount(false);
    }
  };

  const filteredAndGroupedArray = React.useMemo(() => {
      if (!assignments || assignments.length === 0) return [];
      
      const groupedByPerson = assignments.reduce((acc, assignment) => {
          const personId = assignment.person_id;
          const personName = assignment.person_name;
          const personAvatar = 'https://placehold.co/100x100.png'; // Default avatar
          
          if (!acc[personId]) {
              acc[personId] = {
                  personId,
                  personName,
                  personAvatar,
                  hasUserAccount: assignment.has_user_account,
                  isUserActive: assignment.is_user_active,
                  roles: [],
              };
          }
          acc[personId].roles.push({
              id: assignment.id,
              pelayananName: assignment.pelayanan,
              churchName: assignment.church_name,
              departmentName: assignment.department_name,
              isPic: assignment.pelayanan_is_pic,
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
                      role.churchName.toLowerCase().includes(lowercasedFilter) ||
                      role.departmentName.toLowerCase().includes(lowercasedFilter)
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
                        placeholder='Cari nama, pelayanan, gereja, atau departemen...'
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
                                    <div className="flex-grow">
                                        <CardTitle>{personGroup.personName}</CardTitle>
                                        <CardDescription>{personGroup.roles?.length || 0} peran pelayanan</CardDescription>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDirectAssign(personGroup)}
                                        className="shrink-0"
                                    >
                                        <FiPlus className="w-4 h-4 mr-1" />
                                        Assign
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="space-y-3">
                                    {/* Show maximum 1 pelayanan initially */}
                                    {personGroup.roles?.slice(0, 1).map(role => (
                                        <div key={role.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className='min-w-0'>
                                                <p className="font-semibold text-gray-800 flex items-center gap-2">
                                                    <FiAward className="text-indigo-500 w-4 h-4"/>
                                                    <span className='truncate'>{role.pelayananName}</span>
                                                </p>
                                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                    <FiUsers className="text-gray-400 w-4 h-4"/>
                                                    <span className='truncate'>{role.departmentName}</span>
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
                                    
                                    {/* Show More button if person has multiple roles */}
                                    {personGroup.roles?.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleShowAllRoles(personGroup)}
                                            className="w-full mt-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                        >
                                            <FiEye className="w-4 h-4 mr-2" />
                                            Lihat Semua ({personGroup.roles?.length || 0} pelayanan)
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                            
                            {/* Account Management Buttons */}
                            <CardFooter className="pt-0">
                                <div className="w-full">
                                    {(() => {
                                        if (!personGroup.hasUserAccount) {
                                            return (
                                                <Button
                                                    onClick={() => handleAccountAction(personGroup, 'create')}
                                                    disabled={isManagingAccount}
                                                    className="w-full bg-green-600 hover:bg-green-700"
                                                    size="sm"
                                                >
                                                    <FiUserPlus className="w-4 h-4 mr-2" />
                                                    Buat & Aktifkan Akun
                                                </Button>
                                            );
                                        } else if (!personGroup.isUserActive) {
                                            return (
                                                <Button
                                                    onClick={() => handleAccountAction(personGroup, 'activate')}
                                                    disabled={isManagingAccount}
                                                    className="w-full bg-green-600 hover:bg-green-700"
                                                    size="sm"
                                                >
                                                    <FiUserCheck className="w-4 h-4 mr-2" />
                                                    Aktifkan Akun
                                                </Button>
                                            );
                                        } else {
                                            return (
                                                <Button
                                                    onClick={() => handleAccountAction(personGroup, 'deactivate')}
                                                    disabled={isManagingAccount}
                                                    variant="destructive"
                                                    className="w-full"
                                                    size="sm"
                                                >
                                                    <FiUserX className="w-4 h-4 mr-2" />
                                                    Nonaktifkan Akun
                                                </Button>
                                            );
                                        }
                                    })()}
                                </div>
                            </CardFooter>
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
      
      {/* Show All Roles Modal */}
      <Dialog open={showAllRolesModal} onOpenChange={setShowAllRolesModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Semua Pelayanan - {selectedPersonRoles?.personName}</DialogTitle>
            <DialogDescription>
              Daftar lengkap pelayanan yang dijalankan oleh {selectedPersonRoles?.personName}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {selectedPersonRoles?.roles?.map(role => (
                <div key={role.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className='min-w-0 flex-grow'>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <FiAward className="text-indigo-500 w-4 h-4"/>
                      <span className='truncate'>{role.pelayananName}</span>
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <FiUsers className="text-gray-400 w-4 h-4"/>
                      <span className='truncate'>{role.departmentName}</span>
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
                        setShowAllRolesModal(false);
                      }
                    }}
                    disabled={isDeleting}
                  >
                    <FiTrash2 className='h-4 w-4'/>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Direct Assignment Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Pelayanan - {selectedPersonForAssign?.personName}</DialogTitle>
            <DialogDescription>
              Pilih pelayanan untuk ditambahkan ke {selectedPersonForAssign?.personName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gereja
              </label>
              <Select
                value={selectedChurch}
                onChange={handleChurchChange}
                options={churches?.map(church => ({ value: church.id, label: church.name })) || []}
                placeholder="Pilih Gereja..."
                isSearchable
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departemen
              </label>
              <Select
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                options={departments?.map(dept => ({ value: dept.id, label: dept.name })) || []}
                placeholder="Pilih Departemen..."
                isSearchable
                isDisabled={!selectedChurch}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pelayanan
              </label>
              <Select
                value={selectedPelayanan}
                onChange={setSelectedPelayanan}
                options={pelayananList?.map(pelayanan => ({ value: pelayanan.id, label: pelayanan.pelayanan })) || []}
                placeholder="Pilih Pelayanan..."
                isSearchable
                isDisabled={!selectedDepartment}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPic"
                checked={isPic}
                onChange={(e) => setIsPic(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="isPic" className="text-sm font-medium text-gray-700">
                Sebagai PIC (Person In Charge)
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAssignModal(false)}
              disabled={isAssigning}
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmitAssignment}
              disabled={isAssigning || !selectedChurch || !selectedDepartment || !selectedPelayanan}
            >
              {isAssigning ? 'Menambahkan...' : 'Assign Pelayanan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <style jsx global>{`
        .react-select-container .react-select__control {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          min-height: 2.5rem;
        }
        
        .react-select-container .react-select__control:hover {
          border-color: #9ca3af;
        }
        
        .react-select-container .react-select__control--is-focused {
          border-color: #6366f1;
          box-shadow: 0 0 0 1px #6366f1;
        }
        
        .react-select-container .react-select__option--is-focused {
          background-color: #eef2ff;
          color: #1e40af;
        }
        
        .react-select-container .react-select__option--is-selected {
          background-color: #6366f1;
        }
      `}</style>
    </div>
  );
}
