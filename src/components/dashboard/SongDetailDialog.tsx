'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FiMusic, FiYoutube, FiTag, FiKey, FiCalendar, FiAlignLeft } from 'react-icons/fi';
import { Button } from "@/components/ui/button";

interface Song {
  id: string;
  judul: string;
  penyanyi: string;
  genre: string;
  youtubeLink?: string;
  lirik?: string;
  tags?: string;
  nadaDasar?: string;
  tahunRilis?: number;
}

interface SongDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  song: Song | null;
}

const InfoPill = ({ icon: Icon, text }: { icon: React.ElementType, text: string | number }) => (
    <div className="flex items-center text-sm text-gray-700 bg-gray-100 rounded-full px-3 py-1">
        <Icon className="w-4 h-4 mr-2 text-gray-500" />
        <span className="font-medium">{text}</span>
    </div>
);

export default function SongDetailDialog({ open, onOpenChange, song }: SongDetailDialogProps) {
  if (!song) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">{song.judul}</DialogTitle>
          <DialogDescription className="text-md text-gray-500">
            Oleh {song.penyanyi}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto pr-4 -mr-2 space-y-6 py-4">
            <div className="flex flex-wrap gap-3">
                {song.nadaDasar && <InfoPill icon={FiKey} text={`Nada: ${song.nadaDasar}`} />}
                {song.tahunRilis && <InfoPill icon={FiCalendar} text={`Rilis: ${song.tahunRilis}`} />}
                {song.genre && <InfoPill icon={FiMusic} text={`Genre: ${song.genre}`} />}
            </div>

            {song.tags && (
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><FiTag className="w-4 h-4 mr-2" /> Tags</h4>
                     <div className='flex flex-wrap gap-2'>
                        {song.tags.split(',').map(tag => (
                            <span key={tag} className='px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full'>
                                {tag.trim()}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            
            {song.youtubeLink && (
                 <Button asChild variant="outline" className="w-full">
                     <a href={song.youtubeLink} target="_blank" rel="noopener noreferrer">
                        <FiYoutube className="w-4 h-4 mr-2" /> Tonton di YouTube
                     </a>
                 </Button>
            )}

            <div>
                 <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><FiAlignLeft className="w-4 h-4 mr-2" /> Lirik</h4>
                 <div className="p-4 bg-gray-50 rounded-lg border max-h-80 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-gray-800 text-sm leading-relaxed">
                        {song.lirik || 'Lirik tidak tersedia.'}
                    </pre>
                 </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
