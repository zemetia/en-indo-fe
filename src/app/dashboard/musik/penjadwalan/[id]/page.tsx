'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiMusic, FiPlus, FiTrash2, FiLink, FiSave, FiSearch } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/context/ToastContext';
import Skeleton from '@/components/Skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// MOCK DATA - Replace with actual data fetching
interface MockMusician {
  id: string;
  name: string;
  avatar: string;
  instruments: string[];
}
const MOCK_MUSICIANS: MockMusician[] = [
    { id: 'm1', name: 'Andi Suryo', avatar: 'https://placehold.co/100x100.png', instruments: ['Gitar Akustik', 'Vokal'] },
    { id: 'm2', name: 'Budi Santoso', avatar: 'https://placehold.co/100x100.png', instruments: ['Keyboard', 'Piano'] },
    { id: 'm3', name: 'Citra Lestari', avatar: 'https://placehold.co/100x100.png', instruments: ['Vokal', 'Worship Leader'] },
    { id: 'm4', name: 'Dewi Anggraini', avatar: 'https://placehold.co/100x100.png', instruments: ['Bass'] },
    { id: 'm5', name: 'Eko Prasetyo', avatar: 'https://placehold.co/100x100.png', instruments: ['Drum'] },
];

const MOCK_SONGS: {id: string, judul: string, penyanyi: string}[] = [
    { id: 's1', judul: 'Amazing Grace', penyanyi: 'John Newton' },
    { id: 's2', judul: 'How Great Thou Art', penyanyi: 'Carl Boberg' },
    { id: 's3', judul: '10,000 Reasons', penyanyi: 'Matt Redman' },
    { id: 's4', judul: 'What A Beautiful Name', penyanyi: 'Hillsong Worship' },
    { id: 's5', judul: 'Goodness of God', penyanyi: 'Bethel Music' },
];

const MOCK_EVENTS: Record<string, any> = {
    '1': { id: '1', tanggal: '2025-07-20', waktu: '09:00', event: 'Ibadah Minggu Pagi', lokasi: 'Gedung Utama' },
    '2': { id: '2', tanggal: '2025-07-25', waktu: '18:30', event: 'Youth Service', lokasi: 'Youth Hall' },
    '3': { id: '3', tanggal: '2025-08-01', waktu: '19:00', event: 'Malam Doa & Pujian', lokasi: 'Kapel Doa' },
};

// Interfaces
interface AssignedMusician {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

interface AssignedSong {
  id: string;
  judul: string;
  penyanyi: string;
  youtubeLink: string;
}

export default function DetailPenjadwalanMusikPage() {
  const params = useParams();
  const eventId = params.id as string;
  const router = useRouter();
  const { showToast } = useToast();

  const [event, setEvent] = useState<any>(null);
  const [team, setTeam] = useState<AssignedMusician[]>([]);
  const [songList, setSongList] = useState<AssignedSong[]>([]);
  const [loading, setLoading] = useState(true);

  // States for modals
  const [isMusicianModalOpen, setIsMusicianModalOpen] = useState(false);
  const [musicianSearch, setMusicianSearch] = useState('');
  const [musicianRoles, setMusicianRoles] = useState<Record<string, string>>({});
  
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);
  const [songSearch, setSongSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    // Mock API call to fetch event details
    setTimeout(() => {
      const eventData = MOCK_EVENTS[eventId];
      if (eventData) {
        setEvent(eventData);
        // Mock existing team and song list if any
        if (eventId === '1') {
            setTeam([
                { id: 'm3', name: 'Citra Lestari', avatar: 'https://placehold.co/100x100.png', role: 'Worship Leader' },
                { id: 'm1', name: 'Andi Suryo', avatar: 'https://placehold.co/100x100.png', role: 'Gitaris Akustik' },
                { id: 'm2', name: 'Budi Santoso', avatar: 'https://placehold.co/100x100.png', role: 'Pianist' },
            ]);
            setSongList([
                { id: 's3', judul: '10,000 Reasons', penyanyi: 'Matt Redman', youtubeLink: '' },
                { id: 's5', judul: 'Goodness of God', penyanyi: 'Bethel Music', youtubeLink: 'https://www.youtube.com/watch?v=n0FBb6hnwTo' },
            ]);
        }
      }
      setLoading(false);
    }, 1000);
  }, [eventId]);

  const handleAddMusician = (musician: MockMusician, role: string) => {
    if (!role || !role.trim()) {
        showToast('Peran/instrumen harus dipilih.', 'error');
        return;
    }
    setTeam(prev => [...prev, { ...musician, role: role }]);
    setMusicianRoles(prev => {
        const newRoles = {...prev};
        delete newRoles[musician.id];
        return newRoles;
    });
    setIsMusicianModalOpen(false);
    showToast(`${musician.name} ditambahkan sebagai ${role}.`, 'success');
  };

  const handleRemoveMusician = (musicianId: string) => {
    setTeam(prev => prev.filter(m => m.id !== musicianId));
  };
  
  const handleAddSong = (song: { id: string; judul: string; penyanyi: string }) => {
    if (songList.some(s => s.id === song.id)) {
        showToast(`${song.judul} sudah ada di daftar lagu.`, 'warning');
        return;
    }
    setSongList(prev => [...prev, { ...song, youtubeLink: '' }]);
    setSongSearch('');
    setIsSongModalOpen(false);
    showToast(`${song.judul} ditambahkan ke daftar lagu.`, 'success');
  };

  const handleRemoveSong = (songId: string) => {
    setSongList(prev => prev.filter(s => s.id !== songId));
  };

  const handleYoutubeLinkChange = (songId: string, link: string) => {
    setSongList(prev => prev.map(s => s.id === songId ? { ...s, youtubeLink: link } : s));
  };

  const handleSaveSchedule = () => {
    console.log("Saving schedule for event:", eventId);
    console.log("Team:", team);
    console.log("Song List:", songList);
    showToast('Jadwal pelayanan musik berhasil disimpan!', 'success');
  };

  const filteredMusicians = MOCK_MUSICIANS.filter(
      m => !team.some(teamMember => teamMember.id === m.id) &&
      m.name.toLowerCase().includes(musicianSearch.toLowerCase())
  );
  const filteredSongs = MOCK_SONGS.filter(s => s.judul.toLowerCase().includes(songSearch.toLowerCase()) || s.penyanyi.toLowerCase().includes(songSearch.toLowerCase()));

  if (loading || !event) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='space-y-6'>
        <FeaturedCard
          title={`Penjadwalan: ${event.event}`}
          description={`${new Date(event.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - ${event.waktu}`}
          actionLabel='Simpan Jadwal'
          onAction={handleSaveSchedule}
          gradientFrom='from-amber-500'
          gradientTo='to-amber-700'
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Team Management */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center"><FiUsers className="w-5 h-5 mr-3 text-amber-600"/>Tim Pelayanan</CardTitle>
                <Dialog open={isMusicianModalOpen} onOpenChange={(isOpen) => { setIsMusicianModalOpen(isOpen); if(!isOpen) setMusicianRoles({}); }}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm"><FiPlus className="w-4 h-4 mr-2"/>Tambah Pelayan</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Pelayan Musik</DialogTitle>
                            <DialogDescription>Cari dan tambahkan pelayan musik ke dalam tim untuk acara ini.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="relative">
                               <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                               <Input placeholder="Cari nama pelayan..." className="pl-10" value={musicianSearch} onChange={e => setMusicianSearch(e.target.value)} />
                            </div>
                            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                               {filteredMusicians.length > 0 ? filteredMusicians.map(m => (
                                   <div key={m.id} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                                       <div className="flex items-center space-x-3">
                                           <Image src={m.avatar} alt={m.name} width={32} height={32} className="rounded-full" data-ai-hint="person portrait"/>
                                           <p className="text-sm font-medium">{m.name}</p>
                                       </div>
                                       <div className="flex items-center gap-2">
                                            <Select value={musicianRoles[m.id] || ''} onValueChange={(value) => setMusicianRoles(prev => ({...prev, [m.id]: value}))}>
                                                <SelectTrigger className="h-8 text-xs w-[140px]">
                                                    <SelectValue placeholder="Pilih Peran" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {m.instruments.map(instrument => (
                                                        <SelectItem key={instrument} value={instrument}>{instrument}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button size="sm" onClick={() => handleAddMusician(m, musicianRoles[m.id])} disabled={!musicianRoles[m.id]}>Tambah</Button>
                                       </div>
                                   </div>
                               )) : <p className="text-sm text-center text-gray-500 py-4">Semua pelayan sudah ditambahkan atau tidak ada hasil.</p>}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {team.length > 0 ? team.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <Image src={member.avatar} alt={member.name} width={40} height={40} className="rounded-full" data-ai-hint="person portrait"/>
                      <div>
                        <p className="font-semibold text-gray-800">{member.name}</p>
                        <p className="text-sm text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-1">{member.role}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleRemoveMusician(member.id)}>
                      <FiTrash2 className="w-4 h-4"/>
                    </Button>
                  </motion.div>
                )) : <p className="text-center text-gray-500 py-8">Belum ada pelayan yang ditugaskan.</p>}
              </div>
            </CardContent>
          </Card>

          {/* Song List Management */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                 <CardTitle className="flex items-center"><FiMusic className="w-5 h-5 mr-3 text-amber-600"/>Daftar Lagu</CardTitle>
                  <Dialog open={isSongModalOpen} onOpenChange={setIsSongModalOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm"><FiPlus className="w-4 h-4 mr-2"/>Tambah Lagu</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Lagu</DialogTitle>
                            <DialogDescription>Cari lagu dari database untuk ditambahkan ke acara ini.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="relative">
                               <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                               <Input placeholder="Cari judul atau penyanyi..." className="pl-10" value={songSearch} onChange={e => setSongSearch(e.target.value)} />
                            </div>
                            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                               {filteredSongs.map(s => (
                                   <div key={s.id} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                                       <div>
                                           <p className="text-sm font-medium">{s.judul}</p>
                                           <p className="text-xs text-gray-500">{s.penyanyi}</p>
                                       </div>
                                       <Button size="sm" onClick={() => handleAddSong(s)}>Tambah</Button>
                                   </div>
                               ))}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                {songList.length > 0 ? songList.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                       <div className="min-w-0">
                         <p className="font-semibold text-gray-800 truncate">{song.judul}</p>
                         <p className="text-sm text-gray-500 truncate">{song.penyanyi}</p>
                       </div>
                       <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleRemoveSong(song.id)}>
                         <FiTrash2 className="w-4 h-4"/>
                       </Button>
                    </div>
                    <div className="relative mt-2">
                       <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                       <Input 
                         placeholder="Tempel link YouTube referensi..." 
                         className="pl-10 h-9" 
                         value={song.youtubeLink}
                         onChange={(e) => handleYoutubeLinkChange(song.id, e.target.value)}
                       />
                    </div>
                  </motion.div>
                )) : <p className="text-center text-gray-500 py-8">Belum ada lagu yang ditambahkan.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
