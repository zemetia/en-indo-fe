'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';
import { FiAward, FiHome, FiPlus, FiSearch, FiTrash2, FiUser, FiStar, FiTag } from 'react-icons/fi';
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

interface Assignment {
  id: string;
  personId: string;
  personName: string;
  personAvatar: string;
  pelayananName: string;
  churchName: string;
  isPic: boolean;
}

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

const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: 'a1', personId: 'p1', personName: 'Andi Suryo', personAvatar: 'https://placehold.co/100x100.png', pelayananName: 'Pemusik', churchName: 'EN Jakarta', isPic: false },
  { id: 'a2', personId: 'p1', personName: 'Andi Suryo', personAvatar: 'https://placehold.co/100x100.png', pelayananName: 'Usher', churchName: 'EN Bandung', isPic: true },
  { id: 'a3', personId: 'p2', personName: 'Budi Santoso', personAvatar: 'https://placehold.co/100x100.png', pelayananName: 'Pemusik', churchName: 'EN Jakarta', isPic: true },
  { id: 'a4', personId: 'p3', personName: 'Citra Lestari', personAvatar: 'https://placehold.co/100x100.png', pelayananName: 'Singer', churchName: 'EN Bandung', isPic: false },
  { id: 'a5', personId: 'p3', personName: 'Citra Lestari', personAvatar: 'https://placehold.co/100x100.png', pelayananName: 'Media', churchName: 'EN Jakarta', isPic: true },
  { id: 'a6', personId: 'p4', personName: 'Dewi Anggraini', personAvatar: 'https://placehold.co/100x100.png', pelayananName: 'Usher', churchName: 'EN Surabaya', isPic: false },
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
  
  const filteredAndGroupedArray = React.useMemo(() => {
      const groupedByPerson = assignments.reduce((acc, assignment) => {
          const { personId, personName, personAvatar } = assignment;
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
              pelayananName: assignment.pelayananName,
              churchName: assignment.churchName,
              isPic: assignment.isPic,
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
              <p className='text-sm text-gray-500 mt-1'>Total {filteredAndGroupedArray.length} pelayan ditemukan.</p>
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

        {filteredAndGroupedArray.length > 0 ? (
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
