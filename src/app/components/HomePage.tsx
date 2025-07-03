'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import {
  ArrowRight,
  Church,
  Cross,
  HeartHandshake,
  MapPin,
  Mic,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import EventsSection from '@/app/components/sections/EventsSection';

export default function HomePage() {
  const testimonials = [
    {
      quote:
        "This church has been a true blessing for my family. We've found a loving community and grown so much in our faith.",
      name: 'The Johnson Family',
    },
    {
      quote:
        "The youth ministry is amazing! It's a fun and safe place for teenagers to connect and learn about God.",
      name: 'Sarah L.',
    },
    {
      quote:
        "I love the worship here. It's powerful, authentic, and always helps me connect with God on a deeper level.",
      name: 'David M.',
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className='bg-background text-foreground'>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className='relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden'
      >
        <div className='absolute inset-0 z-0'>
          <Image
            src='https://placehold.co/1920x1080.png'
            alt='Worship service'
            fill
            className='object-cover'
            priority
            data-ai-hint='worship concert'
          />
          <div className='absolute inset-0 bg-black/50' />
        </div>
        <div className='relative z-10 p-4'>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight font-headline'
          >
            Welcome to Every Nation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='mt-4 text-lg md:text-xl max-w-2xl mx-auto text-white/90'
          >
            Honoring God. Making Disciples.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='mt-8'
          >
            <Button asChild size='lg' className='rounded-full'>
              <Link href='/about'>
                Learn More <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* About Us Section */}
      <section className='py-20 md:py-28 bg-secondary/20'>
        <div className='container mx-auto px-4 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className='text-3xl md:text-4xl font-bold text-primary mb-4 font-headline'>
              A Place to Belong
            </h2>
            <p className='max-w-3xl mx-auto text-lg text-muted-foreground leading-relaxed'>
              Every Nation is a global family of churches and ministries that
              exists to honor God by establishing Christ-centered,
              Spirit-empowered, socially responsible churches and campus
              ministries in every nation. We are here to help you find your
              place in God's family.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events Section - Reusing existing component */}
      <EventsSection />

      {/* Ministries Section */}
      <section className='py-20 md:py-28'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2 className='text-3xl md:text-4xl font-bold text-primary mb-4 font-headline'>
              Our Ministries
            </h2>
            <p className='max-w-2xl mx-auto text-lg text-muted-foreground'>
              Find a community to grow with.
            </p>
          </motion.div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[
              {
                icon: Users,
                title: 'Youth Ministry',
                description:
                  'Engaging the next generation with the love of Christ.',
              },
              {
                icon: HeartHandshake,
                title: 'Community Outreach',
                description:
                  'Serving our city and sharing God’s love in practical ways.',
              },
              {
                icon: Mic,
                title: 'Worship Team',
                description:
                  'Leading the congregation in authentic, Spirit-led worship.',
              },
              {
                icon: Church,
                title: 'Life Groups',
                description:
                  'Small groups for fellowship, support, and spiritual growth.',
              },
              {
                icon: Cross,
                title: 'Missions',
                description:
                  'Taking the gospel to our city, our nation, and the world.',
              },
              {
                icon: MapPin,
                title: 'Campus Ministry',
                description: 'Reaching students and faculty on university campuses.',
              },
            ].map((ministry, index) => (
              <motion.div
                key={ministry.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: '-100px' }}
              >
                <Card className='text-center h-full hover:shadow-xl transition-shadow duration-300'>
                  <CardHeader>
                    <div className='mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit'>
                      <ministry.icon className='w-8 h-8' />
                    </div>
                    <CardTitle className='mt-4'>{ministry.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground'>
                      {ministry.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-20 md:py-28 bg-secondary/20'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-primary mb-12 font-headline'>
            What Our Family Says
          </h2>
          <div className='relative max-w-3xl mx-auto h-48'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className='absolute inset-0 flex flex-col items-center justify-center'
              >
                <blockquote className='text-xl italic text-foreground'>
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                <p className='mt-4 font-semibold text-primary'>
                  — {testimonials[currentTestimonial].name}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className='py-20 md:py-32'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className='text-3xl md:text-4xl font-bold text-primary mb-4 font-headline'>
                Join Us This Sunday
              </h2>
              <p className='text-lg text-muted-foreground mb-6'>
                We can't wait to meet you. Join us for a time of worship,
                community, and an inspiring message.
              </p>
              <div className='space-y-4 text-lg'>
                <p>
                  <strong className='font-semibold text-foreground'>
                    Service Times:
                  </strong>{' '}
                  9:00 AM & 11:00 AM
                </p>
                <p>
                  <strong className='font-semibold text-foreground'>
                    Location:
                  </strong>{' '}
                  123 Main Street, Anytown, USA
                </p>
              </div>
              <Button asChild size='lg' className='mt-8'>
                <Link href='/contact'>Get Directions</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className='h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl'
            >
              <Image
                src='https://placehold.co/800x600.png'
                alt='Church building'
                width={800}
                height={600}
                className='w-full h-full object-cover'
                data-ai-hint='church building modern'
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className='bg-primary text-primary-foreground py-20'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold mb-4 font-headline'>
            Ready to Take the Next Step?
          </h2>
          <p className='text-lg max-w-2xl mx-auto mb-8 text-primary-foreground/90'>
            Whether you're new to faith or looking for a church to call home,
            we're here for you.
          </p>
          <div className='flex justify-center gap-4'>
            <Button asChild size='lg' variant='secondary'>
              <Link href='/connect'>Connect With Us</Link>
            </Button>
            <Button
              asChild
              size='lg'
              variant='outline'
              className='text-white border-white/50 hover:bg-white/10 hover:text-white'
            >
              <Link href='/watch'>Watch Online</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}