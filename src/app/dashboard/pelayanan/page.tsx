'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';
import { FiAward, FiHome, FiPlus, FiSearch, FiTrash2, FiUser } from 'react-icons/fi';

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

interface Assignment {
  id: string;
  personName: string;
  pelayananName: string;
  churchName: string;
  isPic: boolean;
}

const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: 'a1', personName: 'Andi Suryo', pelayananName: 'Pemusik', churchName: 'EN Jakarta', isPic: false },
  { id: 'a2', personName: 'Budi Santoso', pelayananName: 'Pemusik', churchName: 'EN Jakarta', isPic: true },
  { id: 'a3', personName: 'Citra Lestari', pelayananName: 'Singer', churchName: 'EN Bandung', isPic: false },
  { id: 'a4', personName: 'Dewi Anggraini', pelayananName: 'Usher', churchName: 'EN Surabaya', isPic: true },
  { id: 'a5', personName: 'Eko Prasetyo', pelayananName: 'Media', churchName: 'EN Jakarta', isPic: false },
  { id: 'a6', personName: 'Fitri Handayani', pelayananName: 'Kids', churchName: 'EN Bandung', isPic: false },
];

export default function ManagePelayananPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const handleUnassign = () => {
    if (!selectedAssignment) return;
    
    setAssignments(prev => prev.filter(a => a.id !== selectedAssignment.id));
    showToast(`Pelayanan untuk ${selectedAssignment.personName} berhasil dihapus.`, 'success');
    setShowConfirmation(false);
    setSelectedAssignment(null);
  };
  
  const filteredAssignments = assignments.filter(
    (a) =>
      a.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.pelayananName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.churchName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <p className='text-sm text-gray-500 mt-1'>Total {filteredAssignments.length} penugasan ditemukan.</p>
            </div>
            <div className='flex w-full md:w-auto space-x-4'>
                <div className='relative flex-grow'>
                    <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <Input
                        placeholder='Cari nama, pelayanan, atau gereja...'
                        className='pl-10'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button asChild>
                    <Link href="/dashboard/pelayanan/assign">
                        <FiPlus className='mr-2 h-4 w-4'/>
                        Assign
                    </Link>
                </Button>
            </div>
        </div>

        <div className='overflow-x-auto'>
            <table className='w-full text-sm text-left text-gray-500'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                    <tr>
                        <th scope='col' className='px-6 py-3 font-medium'>Nama Jemaat</th>
                        <th scope='col' className='px-6 py-3 font-medium'>Pelayanan</th>
                        <th scope='col' className='px-6 py-3 font-medium'>Gereja</th>
                        <th scope='col' className='px-6 py-3 font-medium'>Status PIC</th>
                        <th scope='col' className='px-6 py-3 font-medium text-right'>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAssignments.length > 0 ? (
                        filteredAssignments.map((assignment, index) => (
                        <motion.tr 
                            key={assignment.id} 
                            className='bg-white border-b last:border-b-0 hover:bg-gray-50'
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <td className='px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex items-center'>
                                <FiUser className='mr-3 text-gray-400'/>
                                {assignment.personName}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='flex items-center'>
                                    <FiAward className='mr-3 text-gray-400'/>
                                    {assignment.pelayananName}
                                </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='flex items-center'>
                                    <FiHome className='mr-3 text-gray-400'/>
                                    {assignment.churchName}
                                </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${assignment.isPic ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {assignment.isPic ? 'Ya' : 'Tidak'}
                                </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-right'>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className='text-red-500 hover:text-red-700 hover:bg-red-50'
                                    onClick={() => {
                                        setSelectedAssignment(assignment);
                                        setShowConfirmation(true);
                                    }}
                                >
                                    <FiTrash2 className='h-4 w-4'/>
                                </Button>
                            </td>
                        </motion.tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className='text-center py-10 text-gray-500'>
                                Tidak ada data penugasan yang cocok dengan pencarian Anda.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

       <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Unassign</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus penugasan pelayanan
              <strong className='text-gray-900'> {selectedAssignment?.pelayananName} </strong>
              untuk
              <strong className='text-gray-900'> {selectedAssignment?.personName}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAssignment(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnassign}
              className="bg-red-600 hover:bg-red-700"
            >
              Ya, Unassign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
