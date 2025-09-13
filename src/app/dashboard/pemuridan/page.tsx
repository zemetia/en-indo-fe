'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { User, Search, UserPlus, Users, Trash2, ShieldCheck, UserCheck } from 'lucide-react';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Mock Data
interface Murid {
  id: string;
  nama: string;
  tipe: 'Jemaat' | 'Visitor';
}

interface PemuridanRelation {
  pemuridId: string;
  pemuridNama: string;
  pemuridAvatar: string;
  murid: Murid[];
}

const mockPemuridanData: PemuridanRelation[] = [
  {
    pemuridId: 'pdt1',
    pemuridNama: 'Pdt. Budi Santoso',
    pemuridAvatar: 'https://placehold.co/100x100.png',
    murid: [
      { id: 'm1', nama: 'Andi Wijaya', tipe: 'Jemaat' },
      { id: 'm2', nama: 'Michael Tan', tipe: 'Jemaat' },
      { id: 'v1', nama: 'Sarah (Visitor)', tipe: 'Visitor' },
    ],
  },
  {
    pemuridId: 'ev1',
    pemuridNama: 'Ev. Rina Wijaya',
    pemuridAvatar: 'https://placehold.co/100x100.png',
    murid: [
      { id: 'm3', nama: 'Citra Lestari', tipe: 'Jemaat' },
      { id: 'm4', nama: 'Dewi Anggraini', tipe: 'Jemaat' },
    ],
  },
  {
    pemuridId: 'ldr1',
    pemuridNama: 'Andi Wijaya',
    pemuridAvatar: 'https://placehold.co/100x100.png',
    murid: [
      { id: 'v2', nama: 'David (Visitor)', tipe: 'Visitor' },
    ],
  },
];


export default function PemuridanPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [relations, setRelations] = useState(mockPemuridanData);

    const filteredRelations = relations.filter(relation => 
        relation.pemuridNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        relation.murid.some(murid => murid.nama.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleRemoveMurid = (pemuridId: string, muridId: string) => {
        setRelations(prev => 
            prev.map(rel => {
                if (rel.pemuridId === pemuridId) {
                    return {
                        ...rel,
                        murid: rel.murid.filter(m => m.id !== muridId)
                    };
                }
                return rel;
            }).filter(rel => rel.murid.length > 0) // Optional: remove pemurid if they have no murid left
        );
    };

    return (
        <div className="space-y-6">
            <FeaturedCard
                title="Manajemen Pemuridan"
                description="Pantau dan kelola hubungan pemuridan di dalam gereja untuk memastikan setiap orang bertumbuh."
                actionLabel="Tambah Relasi Baru"
                gradientFrom="from-cyan-500"
                gradientTo="to-blue-500"
                onAction={() => { /* router.push('/dashboard/pemuridan/tambah') */ }}
            />

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Relasi Pemuridan</CardTitle>
                            <CardDescription>Daftar pemurid dan orang yang mereka muridkan.</CardDescription>
                        </div>
                         <div className='flex w-full md:w-auto space-x-4'>
                            <div className='relative flex-grow'>
                                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                                <Input
                                    placeholder='Cari pemurid atau murid...'
                                    className='pl-10 w-full md:w-64'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button asChild>
                                <Link href="#">
                                    <UserPlus className='mr-2 h-4 w-4'/>
                                    Tambah Relasi
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredRelations.length > 0 ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {filteredRelations.map((relation, index) => (
                                <motion.div 
                                    key={relation.pemuridId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className="h-full flex flex-col bg-gray-50/50">
                                        <CardHeader>
                                             <div className="flex items-center space-x-4">
                                                <Image src={relation.pemuridAvatar} alt={relation.pemuridNama} width={48} height={48} className="rounded-full" data-ai-hint="person portrait" />
                                                <div>
                                                    <p className="text-xs text-cyan-600 font-semibold">PEMURID</p>
                                                    <CardTitle className="text-base">{relation.pemuridNama}</CardTitle>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <p className="text-sm font-medium text-gray-500 mb-3 ml-1">Memuridkan ({relation.murid.length}):</p>
                                            <div className="space-y-3">
                                                {relation.murid.map(murid => (
                                                    <div key={murid.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                                        <div className="flex items-center space-x-3 min-w-0">
                                                            <div className="p-2 bg-blue-100 rounded-full">
                                                                <User className="h-4 w-4 text-blue-600" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-medium text-gray-800 truncate">{murid.nama}</p>
                                                                {murid.tipe === 'Jemaat' ? (
                                                                     <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                        <ShieldCheck className="h-3 w-3 mr-1"/>
                                                                        Jemaat
                                                                    </span>
                                                                ) : (
                                                                     <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                        <UserCheck className="h-3 w-3 mr-1"/>
                                                                        Visitor
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className='text-gray-400 hover:text-red-500 hover:bg-red-50 ml-2 flex-shrink-0 h-8 w-8'
                                                            onClick={() => handleRemoveMurid(relation.pemuridId, murid.id)}
                                                        >
                                                            <Trash2 className='h-4 w-4'/>
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
                            <Users className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                            <h3 className="text-lg font-semibold text-gray-800">Tidak Ada Hasil</h3>
                            <p>Tidak ada data pemuridan yang cocok dengan pencarian Anda.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
