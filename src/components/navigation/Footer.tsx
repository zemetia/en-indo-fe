'use client';

import { Church, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Church className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Every Nation</span>
            </Link>
            <p className="text-sm max-w-sm text-muted-foreground">
              Membangun generasi pengikut Kristus di setiap bangsa, berkomitmen untuk menghormati Tuhan dan mengasihi sesama.
            </p>
            <div className="flex space-x-4 pt-2 text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors"><Facebook size={20} /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Instagram size={20} /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Youtube size={20} /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Tautan Cepat</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">Tentang Kami</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">Pelayanan</Link></li>
              <li><Link href="/events" className="text-muted-foreground hover:text-primary transition-colors">Acara</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Kontak</Link></li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Pelayanan</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services/youth" className="text-muted-foreground hover:text-primary transition-colors">Pelayanan Remaja</Link></li>
              <li><Link href="/services/campus" className="text-muted-foreground hover:text-primary transition-colors">Pelayanan Kampus</Link></li>
              <li><Link href="/services/lifegroup" className="text-muted-foreground hover:text-primary transition-colors">Life Groups</Link></li>
              <li><Link href="/services/missions" className="text-muted-foreground hover:text-primary transition-colors">Misi</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Berlangganan</h3>
            <p className="text-sm mb-4 text-muted-foreground">Dapatkan update terbaru dari kami langsung ke email Anda.</p>
            <form className="flex space-x-2">
              <Input type="email" placeholder="Email Anda" className="bg-background border-border placeholder:text-muted-foreground" />
              <Button type="submit">Kirim</Button>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-background border-t border-border py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Every Nation Indonesia. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
