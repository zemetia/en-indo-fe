'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import MemberTabView from '@/components/dashboard/MemberTabView';
import { Users, MapPin, Church as ChurchIcon, Star, MessageSquare, Edit, Trash2, Crown } from 'lucide-react';
import Skeleton from '@/components/Skeleton';
import { lifeGroupApi, LifeGroup } from '@/lib/lifegroup';
import { getToken, canAddEditMembers, canDeleteMembers, canEditLifeGroup, canDeleteLifeGroup, getCurrentUserId, getUserRoleInLifeGroup } from '@/lib/helper';
import { useToast } from '@/context/ToastContext';


export default function LifeGroupDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const id = params?.id as string;
    const [lifeGroup, setLifeGroup] = useState<LifeGroup | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [personCount, setPersonCount] = useState(0);
    const [visitorCount, setVisitorCount] = useState(0);
    const [canManageMembers, setCanManageMembers] = useState(false);
    const [canAddEdit, setCanAddEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const [canEditGroup, setCanEditGroup] = useState(false);
    const [canDeleteGroup, setCanDeleteGroup] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [permissions, setPermissions] = useState({
        canEditPositions: false
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');
    
    useEffect(() => {
        if (!id) return;

        const fetchLifeGroup = async () => {
            const token = getToken();
            if (!token) {
                setError('Access denied. Please login again.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await lifeGroupApi.getById(id);
                console.log('LifeGroup API Response:', response); // Debug log
                
                if (!response) {
                    setError('Life Group data is empty.');
                    return;
                }
                
                setLifeGroup(response);
                console.log('Church Info from response:', response.church);
                console.log('Person Members from response:', response.person_members);

                // Check user permissions and role
                const userId = getCurrentUserId();
                const role = userId ? getUserRoleInLifeGroup(response, userId) : null;
                const canAddEditMembersPermission = userId ? canAddEditMembers(response, userId) : false;
                const canDeleteMembersPermission = userId ? canDeleteMembers(response, userId) : false;
                const canEditGroupPermission = userId ? canEditLifeGroup(response, userId) : false;
                const canDeleteGroupPermission = userId ? canDeleteLifeGroup(response, userId) : false;
                
                // Set all permissions and role
                setUserRole(role);
                setCanAddEdit(canAddEditMembersPermission);
                setCanDelete(canDeleteMembersPermission);
                setCanEditGroup(canEditGroupPermission);
                setCanDeleteGroup(canDeleteGroupPermission);
                setPermissions({
                    canEditPositions: role === 'pic' || role === 'leader' // CoLeader cannot edit positions
                });
                
                // Keep backward compatibility for canManageMembers
                setCanManageMembers(canAddEditMembersPermission);
            } catch (err: any) {
                console.error('Error fetching life group:', err);
                console.error('Error details:', err.response?.data);
                
                if (err.response?.status === 404) {
                    setError('Life Group tidak ditemukan.');
                } else if (err.response?.status === 401) {
                    setError('Akses ditolak. Silakan login kembali.');
                } else if (err.response?.status === 500) {
                    setError('Terjadi kesalahan server. Silakan coba lagi nanti.');
                } else {
                    setError('Gagal memuat data Life Group. Silakan coba lagi.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchLifeGroup();
    }, [id]);

    // Helper functions to get leader info from person_members
    const getLeader = () => {
        return lifeGroup?.person_members?.find(member => member.position === 'LEADER') || null;
    };

    const getCoLeader = () => {
        return lifeGroup?.person_members?.find(member => member.position === 'CO_LEADER') || null;
    };

    const handleMemberCountChange = (personCount: number, visitorCount: number) => {
        setPersonCount(personCount);
        setVisitorCount(visitorCount);
    };

    const handleDeleteLifeGroup = async () => {
        if (!lifeGroup) return;
        
        const expectedText = `hapus ${lifeGroup.name}`;
        if (confirmationText !== expectedText) {
            showToast(`Silakan ketik "${expectedText}" untuk mengonfirmasi penghapusan.`, 'error');
            return;
        }
        
        setIsDeleting(true);
        try {
            await lifeGroupApi.delete(id);
            showToast(`Life Group "${lifeGroup.name}" berhasil dihapus`, 'success');
            setShowDeleteConfirmation(false);
            setConfirmationText('');
            router.push('/dashboard/lifegroup/daftar');
        } catch (error: any) {
            console.error('Error deleting life group:', error);
            let errorMessage = 'Gagal menghapus Life Group. Silakan coba lagi.';
            
            if (error.response?.status === 403) {
                errorMessage = 'Anda tidak memiliki akses untuk menghapus Life Group ini.';
            } else if (error.response?.status === 404) {
                errorMessage = 'Life Group tidak ditemukan.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            showToast(errorMessage, 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-40 w-full rounded-xl" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <Skeleton className="h-64 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-12 w-1/3 rounded-xl" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <Skeleton className="h-48 w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return <div className="text-center text-red-500 py-10">{error}</div>;
    }

    if (!lifeGroup) {
        return <div className="text-center text-gray-500 py-10">Life Group tidak ditemukan.</div>;
    }


    // Note: We removed the church check here since we now fetch church data separately

    return (
        <div className="space-y-6">
            <FeaturedCard
                title={lifeGroup.name || 'Life Group'}
                description={`Kelompok sel di bawah naungan ${lifeGroup.church?.name || 'Gereja'}`}
                actionLabel="Kembali ke Daftar"
                onAction={() => router.push('/dashboard/lifegroup/daftar')}
                gradientFrom="from-emerald-500"
                gradientTo="to-emerald-700"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Column - Info */}
                <div className="lg:col-span-1 space-y-6">

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <ChurchIcon className="w-5 h-5 mr-2 text-blue-600" />
                                Informasi Life Group
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-sm">
                            {/* Church Information */}
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <div className="flex items-start">
                                    <ChurchIcon className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-blue-700 font-medium mb-1">Gereja</p>
                                        <p className="font-semibold text-blue-900 text-base">
                                            {lifeGroup.church?.name || 'Gereja tidak tersedia'}
                                        </p>
                                        {lifeGroup.church?.address && (
                                            <p className="text-blue-600 text-xs mt-1">{lifeGroup.church.address}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Leadership Information */}
                            <div className="space-y-3">
                                <h4 className="font-medium text-gray-900 flex items-center">
                                    <Users className="w-4 h-4 mr-2 text-gray-600" />
                                    Struktur Kepemimpinan
                                </h4>
                                
                                {/* Leader */}
                                {getLeader() ? (
                                    <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                                        <div className="flex items-center">
                                            <Crown className="w-4 h-4 mr-2 text-amber-600" />
                                            <div>
                                                <p className="text-amber-700 font-medium text-xs">Pemimpin</p>
                                                <p className="font-semibold text-amber-900">
                                                    {getLeader()?.person?.nama || 'Nama tidak tersedia'}
                                                </p>
                                                {getLeader()?.person?.nomor_telepon && (
                                                    <p className="text-amber-600 text-xs mt-1">
                                                        {getLeader()?.person?.nomor_telepon}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <div className="flex items-center">
                                            <Crown className="w-4 h-4 mr-2 text-gray-400" />
                                            <div>
                                                <p className="text-gray-500 font-medium text-xs">Pemimpin</p>
                                                <p className="text-gray-600">Belum ada pemimpin yang ditugaskan</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Co-Leader */}
                                {getCoLeader() && (
                                    <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 mr-2 text-green-600" />
                                            <div>
                                                <p className="text-green-700 font-medium text-xs">Co-Leader</p>
                                                <p className="font-semibold text-green-900">
                                                    {getCoLeader()?.person?.nama || 'Nama tidak tersedia'}
                                                </p>
                                                {getCoLeader()?.person?.nomor_telepon && (
                                                    <p className="text-green-600 text-xs mt-1">
                                                        {getCoLeader()?.person?.nomor_telepon}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* PIC Lifegroup Info */}
                                {lifeGroup.church?.name && (
                                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 mr-2 text-purple-600" />
                                            <div>
                                                <p className="text-purple-700 font-medium text-xs">PIC Lifegroup</p>
                                                <p className="font-medium text-purple-900 text-xs">
                                                    Dikelola oleh PIC Lifegroup {lifeGroup.church.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Location */}
                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-gray-500 font-medium">Lokasi Pertemuan</p>
                                    <p className="font-medium text-gray-800 mt-1">
                                        {lifeGroup.location || 'Lokasi tidak tersedia'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {lifeGroup.whatsapp_link && (
                        <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white">
                            <Link href={lifeGroup.whatsapp_link} target="_blank">
                                <MessageSquare className="w-5 h-5 mr-2" />
                                Join Grup WhatsApp
                            </Link>
                        </Button>
                    )}

                    {/* Action Buttons */}
                    {(canEditGroup || canDeleteGroup) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center">
                                    <Edit className="w-4 h-4 mr-2 text-gray-600" />
                                    Aksi Management
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {canEditGroup && (
                                    <Button 
                                        asChild 
                                        size="lg" 
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                                    >
                                        <Link href={`/dashboard/lifegroup/${id}/edit`}>
                                            <Edit className="w-5 h-5 mr-2" />
                                            Edit Life Group
                                        </Link>
                                    </Button>
                                )}
                                
                                {canDeleteGroup && (
                                    <Button 
                                        size="lg" 
                                        variant="destructive"
                                        className="w-full bg-red-600 hover:bg-red-700 text-white shadow-md"
                                        onClick={() => {
                                            setConfirmationText('');
                                            setShowDeleteConfirmation(true);
                                        }}
                                        disabled={isDeleting}
                                    >
                                        <Trash2 className="w-5 h-5 mr-2" />
                                        {isDeleting ? 'Menghapus...' : 'Hapus Life Group'}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column - Members */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Users className="w-5 h-5 mr-3 text-blue-600" />
                                    <span>Anggota Life Group</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {personCount + visitorCount} Total • {personCount} Person • {visitorCount} Pengunjung
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MemberTabView
                                lifeGroupId={id}
                                lifeGroupChurchId={lifeGroup.church_id || lifeGroup.church?.id || ''}
                                canManageMembers={canManageMembers}
                                canAddEditMembers={canAddEdit}
                                canDeleteMembers={canDelete}
                                canEditPositions={permissions.canEditPositions}
                                userRole={userRole}
                                lifeGroup={lifeGroup}
                                onMemberCountChange={handleMemberCountChange}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>⚠️ Peringatan: Hapus Life Group</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-4">
                            <p>
                                Anda akan menghapus Life Group
                                <strong className='text-red-700'> {lifeGroup?.name}</strong>.
                            </p>
                            <p className="text-red-600 font-medium">
                                Tindakan ini akan menghapus SEMUA data yang terkait dengan Life Group ini dan TIDAK DAPAT DIBATALKAN.
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm font-medium text-red-800 mb-2">
                                    Untuk melanjutkan, ketik persis seperti ini:
                                </p>
                                <code className="bg-red-100 text-red-800 px-2 py-1 rounded font-mono text-sm">
                                    hapus {lifeGroup?.name}
                                </code>
                            </div>
                            <Input
                                type="text"
                                placeholder={`Ketik: hapus ${lifeGroup?.name}`}
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
                                setShowDeleteConfirmation(false);
                                setConfirmationText('');
                            }} 
                            disabled={isDeleting}
                            className="bg-gray-200 text-gray-900 hover:bg-gray-300 border border-gray-300"
                        >
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteLifeGroup}
                            disabled={isDeleting || !confirmationText || confirmationText !== `hapus ${lifeGroup?.name}`}
                            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:bg-red-400"
                        >
                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus Life Group'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
