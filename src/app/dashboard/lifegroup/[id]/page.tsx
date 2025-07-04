'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PersonCard from '@/components/dashboard/PersonCard';
import { Users, MapPin, Church as ChurchIcon, Star, MessageSquare } from 'lucide-react';
import Skeleton from '@/components/Skeleton';


// Interfaces
interface IChurch {
  id: string;
  nama: string;
}

interface ILeader {
  id: string;
  nama: string;
  image_url: string;
  email: string;
  nomor_telepon: string;
}

interface IPerson {
  id: string;
  nama: string;
  church: string;
  email: string | null;
  nomor_telepon: string | null;
  is_aktif: boolean;
}

interface ILifeGroupDetail {
  id: string;
  name: string;
  location: string;
  whatsapp_link: string;
  church: IChurch;
  leader: ILeader;
  persons: IPerson[];
}


export default function LifeGroupDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [lifeGroup, setLifeGroup] = useState<ILifeGroupDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (!id) return;

        const fetchLifeGroup = async () => {
            setLoading(true);
            
            // This is a mock API call. Replace with your actual API endpoint.
            // For example:
            // const token = getToken();
            // if (!token) { /* handle error */ }
            // try {
            //     const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/lifegroup/${id}`, {
            //         headers: { Authorization: `Bearer ${token}` },
            //     });
            //     setLifeGroup(response.data.data);
            // } catch (err) {
            //     setError('Gagal memuat data Life Group.');
            // } finally {
            //     setLoading(false);
            // }

            // MOCK DATA for demonstration
            const mockData: ILifeGroupDetail = {
                id: '1',
                name: 'Life Group Alpha',
                location: 'Jakarta Selatan',
                whatsapp_link: 'https://wa.me/1234567890',
                church: { id: '1', nama: 'EN Jakarta Pusat' },
                leader: {
                    id: 'leader1',
                    nama: 'Pdt. John Doe',
                    image_url: 'https://placehold.co/100x100.png',
                    email: 'john.doe@example.com',
                    nomor_telepon: '0812-3456-7890'
                },
                persons: [
                    { id: 'person1', nama: 'Andi Suryo', church: 'EN Jakarta Pusat', email: 'andi@mail.com', nomor_telepon: '08111', is_aktif: true },
                    { id: 'person2', nama: 'Budi Santoso', church: 'EN Jakarta Pusat', email: 'budi@mail.com', nomor_telepon: '08222', is_aktif: true },
                    { id: 'person3', nama: 'Citra Lestari', church: 'EN Jakarta Pusat', email: 'citra@mail.com', nomor_telepon: '08333', is_aktif: false },
                    { id: 'person4', nama: 'Dewi Anggraini', church: 'EN Jakarta Pusat', email: 'dewi@mail.com', nomor_telepon: '08444', is_aktif: true },
                ]
            };

            // Simulate API delay
            setTimeout(() => {
                setLifeGroup(mockData);
                setLoading(false);
            }, 1000);

        };

        fetchLifeGroup();
    }, [id]);

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
                description={`Kelompok sel di bawah naungan ${lifeGroup.church.nama}`}
                actionLabel="Kembali ke Daftar"
                onAction={() => router.push('/dashboard/lifegroup/daftar')}
                gradientFrom="from-emerald-500"
                gradientTo="to-emerald-700"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Column - Leader and Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="shadow-lg border-2 border-amber-300 bg-amber-50">
                        <CardHeader>
                            <CardTitle className="flex items-center text-amber-800">
                                <Star className="w-5 h-5 mr-3 text-amber-600" />
                                Pemimpin Life Group
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center text-center">
                            <Image
                                src={lifeGroup.leader.image_url}
                                alt={lifeGroup.leader.nama}
                                width={100}
                                height={100}
                                data-ai-hint="leader portrait"
                                className="rounded-full mb-4 border-4 border-white shadow-md"
                            />
                            <h3 className="text-xl font-bold text-gray-900">{lifeGroup.leader.nama}</h3>
                            <p className="text-sm text-gray-600">{lifeGroup.leader.email}</p>
                            <p className="text-sm text-gray-600">{lifeGroup.leader.nomor_telepon}</p>
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
                                    <p className="font-medium text-gray-800">{lifeGroup.church.nama}</p>
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

                    <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700">
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
                            <CardTitle className="flex items-center">
                                <Users className="w-5 h-5 mr-3 text-blue-600" />
                                Anggota ({lifeGroup.persons.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {lifeGroup.persons.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {lifeGroup.persons.map((person, index) => (
                                        <PersonCard key={person.id} person={person} index={index} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">Belum ada anggota di life group ini.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}