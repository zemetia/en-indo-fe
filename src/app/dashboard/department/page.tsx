'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiRefreshCw, FiEdit3, FiTrash2, FiUsers, FiStar, FiHome } from 'react-icons/fi';
import { RiBuilding2Line } from 'react-icons/ri';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/context/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { departmentService, Department } from '@/lib/department-service';
import { pelayananService } from '@/lib/pelayanan-service';
import Skeleton from '@/components/Skeleton';
import DepartmentFormDialog from '@/components/dashboard/DepartmentFormDialog';
import DeleteDepartmentModal from '@/components/dashboard/DeleteDepartmentModal';

interface DepartmentWithStats extends Department {
  pelayananCount: number;
  picCount: number;
}

export default function DepartmentPage() {
  const { showToast } = useToast();
  const [departments, setDepartments] = useState<DepartmentWithStats[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const deptData = await departmentService.getAll();
      
      // Get pelayanan count for each department
      const departmentsWithStats = await Promise.all(
        deptData.map(async (dept) => {
          try {
            const pelayananList = await pelayananService.getAllPelayanan(dept.id);
            const picCount = pelayananList.filter(p => p.pelayanan.toLowerCase() === 'pic').length;
            return {
              ...dept,
              pelayananCount: pelayananList.length,
              picCount
            };
          } catch (error) {
            return {
              ...dept,
              pelayananCount: 0,
              picCount: 0
            };
          }
        })
      );
      
      setDepartments(departmentsWithStats);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      setError('Gagal memuat data departemen. Silakan coba lagi.');
      showToast('Gagal memuat data departemen.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setShowFormDialog(true);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowFormDialog(true);
  };

  const handleDeleteDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (data: { name: string; description: string }) => {
    try {
      setIsSubmitting(true);
      
      if (selectedDepartment) {
        await departmentService.update(selectedDepartment.id, data);
        showToast('Departemen berhasil diperbarui.', 'success');
      } else {
        await departmentService.create(data);
        // Auto-create PIC pelayanan for new department would be handled by backend
        showToast('Departemen berhasil dibuat.', 'success');
      }
      
      setShowFormDialog(false);
      await fetchDepartments();
    } catch (error) {
      console.error('Failed to save department:', error);
      showToast('Gagal menyimpan departemen.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDepartment) return;
    
    try {
      setIsSubmitting(true);
      await departmentService.delete(selectedDepartment.id);
      showToast(`Departemen "${selectedDepartment.name}" berhasil dihapus.`, 'success');
      setShowDeleteModal(false);
      setSelectedDepartment(null);
      await fetchDepartments();
    } catch (error) {
      console.error('Failed to delete department:', error);
      showToast('Gagal menghapus departemen.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    fetchDepartments();
  };

  const filteredDepartments = React.useMemo(() => {
    if (!searchTerm) return departments;
    
    const lowercasedFilter = searchTerm.toLowerCase();
    return departments.filter(
      (dept) =>
        dept.name.toLowerCase().includes(lowercasedFilter) ||
        dept.description.toLowerCase().includes(lowercasedFilter)
    );
  }, [departments, searchTerm]);

  if (error) {
    return (
      <div className='space-y-6'>
        <FeaturedCard
          title='Manajemen Departemen'
          description='Kelola departemen dan Person In Charge (PIC) untuk setiap departemen.'
          actionLabel='Tambah Departemen'
          onAction={handleAddDepartment}
          gradientFrom='from-indigo-500'
          gradientTo='to-purple-500'
        />
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
          <div className='text-center py-16 text-red-500 bg-red-50 rounded-lg border border-red-200'>
            <RiBuilding2Line className='mx-auto h-12 w-12 text-red-400 mb-4' />
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
        title='Manajemen Departemen'
        description='Kelola departemen dan Person In Charge (PIC) untuk setiap departemen.'
        actionLabel='Tambah Departemen'
        onAction={handleAddDepartment}
        gradientFrom='from-indigo-500'
        gradientTo='to-purple-500'
      />

      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>Daftar Departemen</h2>
            <p className='text-sm text-gray-500 mt-1'>
              {isLoading ? 'Memuat data...' : `Total ${filteredDepartments.length} departemen ditemukan.`}
            </p>
          </div>
          <div className='flex w-full md:w-auto space-x-4'>
            <div className='relative flex-grow'>
              <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Cari nama atau deskripsi departemen...'
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
            <Button onClick={handleAddDepartment}>
              <FiPlus className='mr-2 h-4 w-4'/>
              Tambah
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDepartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((department, index) => (
              <motion.div 
                key={department.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <RiBuilding2Line className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{department.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {new Date(department.created_at).toLocaleDateString('id-ID')}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 mb-4 line-clamp-3">{department.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <FiUsers className="h-4 w-4 text-blue-600 mr-1" />
                          <span className="text-sm font-medium text-blue-600">Pelayanan</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-800">{department.pelayananCount}</span>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <FiStar className="h-4 w-4 text-amber-600 mr-1" />
                          <span className="text-sm font-medium text-amber-600">PIC</span>
                        </div>
                        <span className="text-2xl font-bold text-amber-800">{department.picCount}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDepartment(department)}
                        className="flex-1"
                      >
                        <FiEdit3 className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDepartment(department)}
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <FiTrash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className='text-center py-16 text-gray-500 bg-gray-50 rounded-lg'>
            <RiBuilding2Line className='mx-auto h-12 w-12 text-gray-400 mb-4' />
            <h3 className="text-lg font-semibold text-gray-800">Tidak Ada Departemen</h3>
            <p>Belum ada departemen yang terdaftar. Tambahkan departemen pertama Anda.</p>
            <Button onClick={handleAddDepartment} className="mt-4">
              <FiPlus className="mr-2 h-4 w-4" />
              Tambah Departemen
            </Button>
          </div>
        )}
      </div>

      <DepartmentFormDialog
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        department={selectedDepartment}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <DeleteDepartmentModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        department={selectedDepartment}
        onConfirm={handleDeleteConfirm}
        isDeleting={isSubmitting}
      />
    </div>
  );
}