'use client';

import { Church, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-slate-50 text-slate-600">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Church className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-slate-800">Every Nation</span>
            </Link>
            <p className="text-sm max-w-sm">
              Membangun generasi pengikut Kristus di setiap bangsa, berkomitmen untuk menghormati Tuhan dan mengasihi sesama.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link href="#" className="hover:text-primary"><Facebook size={20} /></Link>
              <Link href="#" className="hover:text-primary"><Twitter size={20} /></Link>
              <Link href="#" className="hover:text-primary"><Instagram size={20} /></Link>
              <Link href="#" className="hover:text-primary"><Youtube size={20} /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">Tautan Cepat</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-primary">Tentang Kami</Link></li>
              <li><Link href="/services" className="hover:text-primary">Pelayanan</Link></li>
              <li><Link href="/events" className="hover:text-primary">Acara</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Kontak</Link></li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">Pelayanan</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services/youth" className="hover:text-primary">Pelayanan Remaja</Link></li>
              <li><Link href="/services/campus" className="hover:text-primary">Pelayanan Kampus</Link></li>
              <li><Link href="/services/lifegroup" className="hover:text-primary">Life Groups</Link></li>
              <li><Link href="/services/missions" className="hover:text-primary">Misi</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">Berlangganan</h3>
            <p className="text-sm mb-4">Dapatkan update terbaru dari kami langsung ke email Anda.</p>
            <form className="flex space-x-2">
              <Input type="email" placeholder="Email Anda" className="bg-white border-slate-300 placeholder-slate-400" />
              <Button type="submit">Kirim</Button>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-slate-100 border-t border-slate-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Every Nation Indonesia. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
