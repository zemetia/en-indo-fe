'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MemberTabView from '@/components/dashboard/MemberTabView';
import { Users, MapPin, Church as ChurchIcon, Star, MessageSquare } from 'lucide-react';
import Skeleton from '@/components/Skeleton';
import { lifeGroupApi, LifeGroup } from '@/lib/lifegroup';
import { getToken } from '@/lib/helper';


export default function LifeGroupDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [lifeGroup, setLifeGroup] = useState<LifeGroup | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [personCount, setPersonCount] = useState(0);
    const [visitorCount, setVisitorCount] = useState(0);
    const [canManageMembers, setCanManageMembers] = useState(false);
    
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
                setLifeGroup(response);

                // Check if current user can manage members
                // This is a simplified check - in real implementation, you might want to check
                // if the user is the leader, co-leader, or has special permissions
                const userId = localStorage.getItem('user_id'); // Assuming user_id is stored
                if (userId) {
                    const isLeaderOrCoLeader = response.leader_id === userId || 
                                             (response.co_leader_id && response.co_leader_id === userId);
                    setCanManageMembers(isLeaderOrCoLeader);
                }
            } catch (err) {
                console.error('Error fetching life group:', err);
                setError('Failed to load Life Group data.');
            } finally {
                setLoading(false);
            }
        };

        fetchLifeGroup();
    }, [id]);

    const handleMemberCountChange = (personCount: number, visitorCount: number) => {
        setPersonCount(personCount);
        setVisitorCount(visitorCount);
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

    return (
        <div className="space-y-6">
            <FeaturedCard
                title={lifeGroup.name}
                description={`Kelompok sel di bawah naungan ${lifeGroup.church.name}`}
                actionLabel="Kembali ke Daftar"
                onAction={() => router.push('/dashboard/lifegroup/daftar')}
                gradientFrom="from-emerald-500"
                gradientTo="to-emerald-700"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Column - Leader and Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="shadow-lg border-2 border-emerald-300 bg-emerald-50">
                        <CardHeader>
                            <CardTitle className="flex items-center text-emerald-800">
                                <Star className="w-5 h-5 mr-3 text-emerald-600" />
                                Pemimpin Life Group
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 border-4 border-white shadow-md">
                                {lifeGroup.leader.person.nama.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{lifeGroup.leader.person.nama}</h3>
                            <p className="text-sm text-gray-600">{lifeGroup.leader.email}</p>
                            <p className="text-sm text-gray-600">{lifeGroup.leader.person.nomor_telepon}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                Informasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center">
                                <ChurchIcon className="w-5 h-5 mr-3 text-gray-500" />
                                <div>
                                    <p className="text-gray-500">Gereja</p>
                                    <p className="font-medium text-gray-800">{lifeGroup.church.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                                <div>
                                    <p className="text-gray-500">Lokasi</p>
                                    <p className="font-medium text-gray-800">{lifeGroup.location}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Link href={lifeGroup.whatsapp_link} target="_blank">
                            <MessageSquare className="w-5 h-5 mr-2" />
                            Join Grup WhatsApp
                        </Link>
                    </Button>
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
                                lifeGroupChurchId={lifeGroup.church_id}
                                canManageMembers={canManageMembers}
                                onMemberCountChange={handleMemberCountChange}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
