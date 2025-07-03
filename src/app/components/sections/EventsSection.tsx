'use client';

import * as React from 'react';

import EventsCarousel from '@/components/carousels/EventsCarousel';

const sampleEvents = [
  {
    id: '1',
    title: 'Sunday Worship Service',
    description: 'Join us for a joyful time of worship and community.',
    imageSrc: 'https://placehold.co/1200x800.png',
    imageAlt: 'Sunday Service at Every Nation',
    date: 'Every Sunday, 10:00 AM',
    location: 'Main Sanctuary',
    dataAiHint: 'worship concert',
  },
  {
    id: '2',
    title: 'Youth Night',
    description: 'A dynamic service for young people with powerful worship.',
    imageSrc: 'https://placehold.co/1200x800.png',
    imageAlt: 'Youth Service at Every Nation',
    date: 'Every Friday, 7:00 PM',
    location: 'Youth Hall',
    dataAiHint: 'youth group',
  },
  {
    id: '3',
    title: 'Life Group Connect',
    description: 'Small groups to grow together in faith and fellowship.',
    imageSrc: 'https://placehold.co/1200x800.png',
    imageAlt: 'Life Group at Every Nation',
    date: 'Various Times',
    location: 'Various Locations',
    dataAiHint: 'small group bible study',
  },
];

export default function EventsSection() {
  return (
    <section className='py-20 md:py-28 bg-background'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-primary mb-4 font-headline'>
            Upcoming Events
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Get involved and grow with us in faith through our various
            activities.
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