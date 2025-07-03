'use client';

import { Church, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-blue-100">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Church className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">Every Nation</span>
            </Link>
            <p className="text-sm max-w-sm text-blue-200">
              Membangun generasi pengikut Kristus di setiap bangsa, berkomitmen untuk menghormati Tuhan dan mengasihi sesama.
            </p>
            <div className="flex space-x-4 pt-2 text-blue-300">
              <Link href="#" className="hover:text-white transition-colors"><Facebook size={20} /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Twitter size={20} /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Instagram size={20} /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Youtube size={20} /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Tautan Cepat</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-blue-200 hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link href="/services" className="text-blue-200 hover:text-white transition-colors">Pelayanan</Link></li>
              <li><Link href="/events" className="text-blue-200 hover:text-white transition-colors">Acara</Link></li>
              <li><Link href="/contact" className="text-blue-200 hover:text-white transition-colors">Kontak</Link></li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Pelayanan</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services/youth" className="text-blue-200 hover:text-white transition-colors">Pelayanan Remaja</Link></li>
              <li><Link href="/services/campus" className="text-blue-200 hover:text-white transition-colors">Pelayanan Kampus</Link></li>
              <li><Link href="/services/lifegroup" className="text-blue-200 hover:text-white transition-colors">Life Groups</Link></li>
              <li><Link href="/services/missions" className="text-blue-200 hover:text-white transition-colors">Misi</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Berlangganan</h3>
            <p className="text-sm mb-4 text-blue-200">Dapatkan update terbaru dari kami langsung ke email Anda.</p>
            <form className="flex space-x-2">
              <Input type="email" placeholder="Email Anda" className="bg-blue-800 border-blue-700 text-white placeholder:text-blue-300 focus:ring-blue-500" />
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-500 transition-colors">Kirim</Button>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-blue-950 border-t border-blue-800 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-blue-300">
          <p>&copy; {new Date().getFullYear()} Every Nation Indonesia. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
