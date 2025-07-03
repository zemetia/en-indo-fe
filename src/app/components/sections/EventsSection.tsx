'use client';

import * as React from 'react';

import EventsCarousel from '@/components/carousels/EventsCarousel';

const sampleEvents = [
  {
    id: '1',
    title: 'Ibadah Raya Minggu',
    description: 'Bergabunglah dalam ibadah minggu kami yang penuh sukacita',
    imageSrc: '/images/events/sunday-service.jpg',
    imageAlt: 'Ibadah Minggu Every Nation',
    date: 'Setiap Minggu, 10:00 WIB',
    location: 'Every Nation Jakarta',
  },
  {
    id: '2',
    title: 'Youth Service',
    description: 'Ibadah khusus untuk pemuda dengan pujian yang dinamis',
    imageSrc: '/images/events/youth-service.jpg',
    imageAlt: 'Ibadah Pemuda Every Nation',
    date: 'Setiap Jumat, 19:00 WIB',
    location: 'Every Nation Jakarta',
  },
  {
    id: '3',
    title: 'Life Group',
    description: 'Kelompok kecil untuk bertumbuh bersama dalam iman',
    imageSrc: '/images/events/life-group.jpg',
    imageAlt: 'Life Group Every Nation',
    date: 'Jadwal Menyesuaikan',
    location: 'Berbagai Lokasi',
  },
];

export default function EventsSection() {
  return (
    <section className='py-12 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Acara Mendatang
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Bergabunglah dalam berbagai kegiatan kami untuk bertumbuh bersama
            dalam iman
          </p>
        </div>
        <EventsCarousel
          events={sampleEvents}
          className='rounded-xl shadow-xl'
        />
      </div>
    </section>
  );
}
