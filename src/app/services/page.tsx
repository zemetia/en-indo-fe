'use client';
import { useEffect } from 'react';
import { BookOpen, Users, Globe, Sparkles, HeartHandshake, Briefcase, Video, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

export default function ServicesPage() {
  useEffect(() => {
    document.title = 'Pelayanan - Every Nation Indonesia';
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const services = [
    {
      icon: BookOpen,
      title: 'Pelayanan Kampus',
      description: 'Menjangkau dan memuridkan mahasiswa untuk menjadi pemimpin masa depan.',
      image: 'https://placehold.co/800x600.png',
      dataAiHint: 'university campus'
    },
    {
      icon: Users,
      title: 'Life Group (Kelompok Sel)',
      description: 'Komunitas kecil untuk bertumbuh bersama dalam iman, persekutuan, dan pemuridan.',
      image: 'https://placehold.co/800x600.png',
      dataAiHint: 'small group meeting'
    },
    {
      icon: Globe,
      title: 'Misi Global & Lokal',
      description: 'Mengutus dan mendukung para misionaris untuk menyebarkan Injil ke seluruh dunia.',
      image: 'https://placehold.co/800x600.png',
      dataAiHint: 'world map'
    },
    {
      icon: Sparkles,
      title: 'EN Kids (Pelayanan Anak)',
      description: 'Menanamkan dasar iman yang kuat pada anak-anak dengan cara yang menyenangkan.',
      image: 'https://placehold.co/800x600.png',
      dataAiHint: 'children church'
    },
    {
      icon: Briefcase,
      title: 'Pelayanan Profesional',
      description: 'Menjadi garam dan terang di dunia kerja melalui integritas dan keunggulan.',
      image: 'https://placehold.co/800x600.png',
      dataAiHint: 'business meeting'
    },
    {
      icon: HeartHandshake,
      title: 'Pelayanan Keluarga',
      description: 'Membangun pernikahan dan keluarga yang sehat dan berpusat pada Kristus.',
      image: 'https://placehold.co/800x600.png',
      dataAiHint: 'happy family'
    },
    {
      icon: Music,
      title: 'Pelayanan Musik & Penyembahan',
      description: 'Memimpin jemaat dalam pujian dan penyembahan yang otentik dan penuh kuasa.',
      image: 'https://placehold.co/800x600.png',
      dataAiHint: 'worship band'
    },
    {
      icon: Video,
      title: 'Pelayanan Media & Kreatif',
      description: 'Menggunakan teknologi dan kreativitas untuk menyebarkan pesan Injil secara efektif.',
      image: 'https://placehold.co/800x600.png',
      dataAiHint: 'camera filming'
    },
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative py-32 md:py-48 bg-blue-50">
         <div 
          className="absolute inset-0 bg-cover bg-center opacity-10" 
          style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
          data-ai-hint="people serving community"
        ></div>
        <div className="container mx-auto px-4 text-center relative">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-blue-900 mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Pelayanan Kami
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Temukan tempat Anda untuk melayani dan bertumbuh dalam komunitas kami.
          </motion.p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl h-full transition-all duration-300 border-0 flex flex-col">
                  <div className="relative h-56">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={service.dataAiHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4 p-3 bg-white/20 backdrop-blur-sm rounded-full">
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="p-6 bg-white flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-blue-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed flex-grow">{service.description}</p>
                    <Link href="#" className="mt-4 text-blue-600 font-semibold inline-flex items-center group-hover:text-blue-800">
                      Pelajari Lebih Lanjut
                      <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
