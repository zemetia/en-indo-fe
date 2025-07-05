'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { FiEdit2, FiMusic, FiPlus, FiTrash2, FiYoutube, FiTag, FiKey, FiCalendar } from 'react-icons/fi';
import { Search } from 'lucide-react';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SongFormDialog, { SongFormData } from '@/components/dashboard/SongFormDialog';
import SongDetailDialog from '@/components/dashboard/SongDetailDialog';

interface Song {
  id: string;
  judul: string;
  penyanyi: string;
  genre: string;
  durasi: string;
  youtubeLink?: string;
  lirik: string;
  tags?: string;
  nadaDasar?: string;
  tahunRilis?: number;
}

const MOCK_SONGS: Song[] = [
    { id: 's1', judul: 'Amazing Grace', penyanyi: 'John Newton', genre: 'Hymn', durasi: '04:30', lirik: 'Amazing grace, how sweet the sound...\nThat saved a wretch like me.\nI once was lost, but now am found,\nWas blind, but now I see.', nadaDasar: 'G', tahunRilis: 1779, tags: 'hymn, classic' },
    { id: 's2', judul: 'How Great Thou Art', penyanyi: 'Carl Boberg', genre: 'Hymn', durasi: '05:15', lirik: 'O Lord my God, when I in awesome wonder...\nConsider all the worlds Thy Hands have made.\nI see the stars, I hear the rolling thunder,\nThy power throughout the universe displayed.', nadaDasar: 'Bb', tahunRilis: 1885, tags: 'hymn, worship' },
    { id: 's3', judul: '10,000 Reasons (Bless the Lord)', penyanyi: 'Matt Redman', genre: 'Penyembahan', durasi: '05:45', lirik: 'Bless the Lord, O my soul...\nO my soul, worship His holy name.\nSing like never before, O my soul.\nI\'ll worship Your holy name.', nadaDasar: 'G', tahunRilis: 2011, tags: 'worship, modern' },
    { id: 's4', judul: 'What A Beautiful Name', penyanyi: 'Hillsong Worship', genre: 'Penyembahan', durasi: '05:20', lirik: 'You were the Word at the beginning...\nOne with God the Lord Most High.\nYour hidden glory in creation,\nNow revealed in You our Christ.', nadaDasar: 'D', tahunRilis: 2016, tags: 'worship, hillsong' },
    { id: 's5', judul: 'This is Amazing Grace', penyanyi: 'Phil Wickham', genre: 'Pujian', durasi: '04:50', lirik: 'Who breaks the power of sin and darkness...\nWhose love is mighty and so much stronger?\nThe King of Glory, the King above all kings.', nadaDasar: 'B', tahunRilis: 2013, tags: 'praise, upbeat' },
    { id: 's6', judul: 'Goodness of God', penyanyi: 'Bethel Music', genre: 'Penyembahan', durasi: '04:55', lirik: 'I love you, Lord...\nFor your mercy never fails me.\nAll my days, I\'ve been held in your hands.\nFrom the moment that I wake up\nUntil I lay my head\nOh, I will sing of the goodness of God.', nadaDasar: 'Ab', tahunRilis: 2019, tags: 'worship, bethel' },
];

export default function ListLaguPage() {
  const { showToast } = useToast();
  const [songs, setSongs] = React.useState<Song[]>(MOCK_SONGS);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedSongForEdit, setSelectedSongForEdit] = React.useState<Partial<SongFormData> | null>(null);

  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [viewingSong, setViewingSong] = React.useState<Song | null>(null);


   const filteredSongs = songs.filter(song =>
    song.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.penyanyi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (song.tags && song.tags.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewSong = (song: Song) => {
    setViewingSong(song);
    setIsDetailOpen(true);
  };

  const handleEditSong = (song: Song) => {
    setSelectedSongForEdit({
      id: song.id,
      judul: song.judul,
      artis: song.penyanyi,
      youtubeLink: song.youtubeLink,
      genre: song.genre,
      lirik: song.lirik,
      tags: song.tags,
      nadaDasar: song.nadaDasar,
      tahunRilis: song.tahunRilis,
    });
    setIsFormOpen(true);
  };
  
  const handleAddSong = () => {
    setSelectedSongForEdit(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: SongFormData) => {
    console.log("Submitting song data:", data);
    if (data.id) {
        setSongs(prev => prev.map(s => s.id === data.id ? { ...s, judul: data.judul, penyanyi: data.artis, genre: data.genre, youtubeLink: data.youtubeLink, lirik: data.lirik, tags: data.tags, nadaDasar: data.nadaDasar, tahunRilis: Number(data.tahunRilis) } : s));
        showToast('Lagu berhasil diperbarui!', 'success');
    } else {
        const newSong: Song = {
            id: `s${Date.now()}`,
            judul: data.judul,
            penyanyi: data.artis,
            genre: data.genre,
            youtubeLink: data.youtubeLink,
            lirik: data.lirik,
            tags: data.tags,
            nadaDasar: data.nadaDasar,
            tahunRilis: Number(data.tahunRilis),
            durasi: '00:00',
        };
        setSongs(prev => [newSong, ...prev]);
        showToast('Lagu baru berhasil ditambahkan!', 'success');
    }
    setIsFormOpen(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse">
                    <div className="space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                         <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                     <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                        <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                        <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                    </div>
                </div>
            ))}
        </div>
      );
    }

    if (error) {
      return <p className='text-center text-red-500'>{error}</p>;
    }

    if (filteredSongs.length === 0) {
      return (
        <div className='text-center py-10 bg-gray-50 rounded-xl'>
          <FiMusic className='w-10 h-10 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Tidak ada lagu ditemukan
          </h3>
          <p className='text-gray-600 max-w-md mx-auto mb-6'>
            {searchTerm
              ? `Tidak ada hasil yang cocok dengan "${searchTerm}"`
              : 'Belum ada lagu yang tersedia. Silakan tambahkan lagu baru.'}
          </p>
           <Button onClick={handleAddSong} className="bg-amber-600 text-white hover:bg-amber-700">
              <FiPlus className='w-5 h-5 mr-2' />
              Tambah Lagu Baru
          </Button>
        </div>
      );
    }

    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredSongs.map((song, index) => (
          <motion.div
            key={song.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
            onClick={() => handleViewSong(song)}
          >
            <div className='p-6 flex-grow'>
                <div className='flex justify-between items-start'>
                    <div className='min-w-0'>
                        <h3 className='font-bold text-lg text-gray-900 truncate'>{song.judul}</h3>
                        <p className='text-sm text-gray-500 truncate'>Oleh {song.penyanyi}</p>
                    </div>
                </div>

                <div className='mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm'>
                    <div className='flex items-center text-gray-600'>
                        <FiKey className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span>Chord Asli: {song.nadaDasar || '-'}</span>
                    </div>
                     <div className='flex items-center text-gray-600'>
                        <FiCalendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span>Tahun: {song.tahunRilis || '-'}</span>
                    </div>
                    {song.tags && (
                        <div className='flex items-start text-gray-600'>
                            <FiTag className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0 mt-1" />
                            <div className='flex flex-wrap gap-1.5'>
                                {song.tags.split(',').map(tag => (
                                    <span key={tag} className='px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full'>
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className='bg-gray-50 p-3 flex justify-between items-center border-t'>
                {song.youtubeLink ? (
                    <a href={song.youtubeLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                        <FiYoutube className='w-4 h-4 mr-1.5' />
                        YouTube
                    </a>
                ) : <div />}
                <div className='flex items-center space-x-1'>
                    <button onClick={(e) => { e.stopPropagation(); handleEditSong(song); }} className='p-2 text-gray-500 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors'>
                        <FiEdit2 className='w-4 h-4' />
                    </button>
                    <button onClick={(e) => e.stopPropagation()} className='p-2 text-gray-500 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors'>
                        <FiTrash2 className='w-4 h-4' />
                    </button>
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className='space-y-6'>
        <FeaturedCard
          title='Daftar Lagu'
          description='Kelola daftar lagu untuk pelayanan musik gereja.'
          actionLabel='Kembali ke Dashboard Musik'
          gradientFrom='from-amber-500'
          gradientTo='to-amber-700'
        />

        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0'>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>Database Lagu</h2>
              <p className='text-sm text-gray-500 mt-1'>
                Kelola dan lihat semua lagu yang tersedia.
              </p>
            </div>
            <div className="flex items-center space-x-2 w-full md:w-auto">
                <div className='relative flex-grow'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <Input
                        placeholder='Cari judul, penyanyi, tag...'
                        className='pl-10 w-full md:w-64'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={handleAddSong} className='bg-amber-600 text-white hover:bg-amber-700'>
                    <FiPlus className='w-5 h-5 mr-2' />
                    <span>Tambah Lagu</span>
                </Button>
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
      <SongFormDialog 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedSongForEdit}
      />
      <SongDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        song={viewingSong}
      />
    </>
  );
}
