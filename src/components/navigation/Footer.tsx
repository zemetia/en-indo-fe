'use client';

import { Church, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Church className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">Every Nation</span>
            </Link>
            <p className="text-sm">
              Membangun generasi pengikut Kristus di setiap bangsa.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-white"><Facebook size={20} /></Link>
              <Link href="#" className="hover:text-white"><Twitter size={20} /></Link>
              <Link href="#" className="hover:text-white"><Instagram size={20} /></Link>
              <Link href="#" className="hover:text-white"><Youtube size={20} /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">Tentang Kami</Link></li>
              <li><Link href="/services" className="hover:text-white">Pelayanan</Link></li>
              <li><Link href="/events" className="hover:text-white">Acara</Link></li>
              <li><Link href="/contact" className="hover:text-white">Kontak</Link></li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Pelayanan</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services/youth" className="hover:text-white">Pelayanan Remaja</Link></li>
              <li><Link href="/services/campus" className="hover:text-white">Pelayanan Kampus</Link></li>
              <li><Link href="/services/lifegroup" className="hover:text-white">Life Groups</Link></li>
              <li><Link href="/services/missions" className="hover:text-white">Misi</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Berlangganan Nawala</h3>
            <p className="text-sm mb-4">Dapatkan update terbaru dari kami langsung ke email Anda.</p>
            <form className="flex space-x-2">
              <Input type="email" placeholder="Email Anda" className="bg-slate-700 border-slate-600 text-white placeholder-slate-400" />
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Kirim</Button>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-slate-900 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} Every Nation Indonesia. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
