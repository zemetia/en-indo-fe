'use client';
import { Calendar, MapPin, Clock, Ticket, Users, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';

export default function EventsPage() {
  const [filter, setFilter] = useState('Semua');

  useEffect(() => {
    document.title = 'Acara - Every Nation Indonesia';
  }, []);

  const events = [
    {
      title: 'Konferensi Kepemimpinan Nasional',
      category: 'Konferensi',
      date: '15-17 Agustus 2025',
      location: 'Jakarta Convention Center',
      image: 'https://placehold.co/800x500.png',
      dataAiHint: 'conference audience'
    },
    {
      title: 'Ibadah Paskah Spesial',
      category: 'Ibadah',
      date: '20 April 2025',
      location: 'Semua Lokasi EN Indonesia',
      image: 'https://placehold.co/800x500.png',
      dataAiHint: 'church easter'
    },
    {
      title: 'Seminar Keuangan Sehat',
      category: 'Seminar',
      date: '10 Mei 2025',
      location: 'EN Jakarta Pusat',
      image: 'https://placehold.co/800x500.png',
      dataAiHint: 'finance seminar'
    },
    {
      title: 'Youth Camp "FIRE UP"',
      category: 'Anak Muda',
      date: '24-26 Juni 2025',
      location: 'Bumi Perkemahan Cibubur',
      image: 'https://placehold.co/800x500.png',
      dataAiHint: 'youth camp'
    },
    {
      title: 'Bakti Sosial & Donor Darah',
      category: 'Sosial',
      date: '12 Juli 2025',
      location: 'EN Surabaya',
      image: 'https://placehold.co/800x500.png',
      dataAiHint: 'charity event'
    },
    {
      title: 'Ibadah Natal',
      category: 'Ibadah',
      date: '24-25 Desember 2025',
      location: 'Semua Lokasi EN Indonesia',
      image: 'https://placehold.co/800x500.png',
      dataAiHint: 'church christmas'
    },
  ];

  const filteredEvents = filter === 'Semua' ? events : events.filter(e => e.category === filter);
  const categories = ['Semua', 'Ibadah', 'Konferensi', 'Seminar', 'Anak Muda', 'Sosial'];

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative py-32 md:py-48 bg-sky-50">
        <div className="container mx-auto px-4 text-center relative">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-blue-900 mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Kalender Acara
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Ikuti berbagai acara dan kegiatan yang akan memperkaya kehidupan rohani dan komunitas Anda.
          </motion.p>
        </div>
      </section>

      {/* Events Listing */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <motion.div 
            className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {categories.map(cat => (
              <Button
                key={cat}
                variant={filter === cat ? 'default' : 'outline'}
                className={`transition-all duration-200 ${filter === cat ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </motion.div>

          {/* Events Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {filteredEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                <Card className="group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl h-full transition-all duration-300 border-0 flex flex-col">
                  <div className="relative">
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={800}
                      height={500}
                      className="object-cover w-full h-56 group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={event.dataAiHint}
                    />
                     <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-blue-700 font-semibold text-xs px-3 py-1 rounded-full">
                        {event.category}
                     </div>
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-blue-900 mb-3 flex-grow">{event.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-blue-500"/>
                            <span>{event.date}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-blue-500"/>
                            <span>{event.location}</span>
                        </div>
                    </div>
                    <Button asChild className="w-full mt-auto bg-blue-600 hover:bg-blue-700">
                      <Link href="#">
                        <Ticket className="w-4 h-4 mr-2" />
                        Daftar Sekarang
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
