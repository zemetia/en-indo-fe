'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <section className="py-20 md:py-32 bg-white">
      <motion.div
        className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center md:text-left" variants={itemVariants}>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-blue-900">
            Membangun Generasi Pengikut Kristus
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
            Every Nation Indonesia adalah gereja yang berkomitmen untuk menghormati Tuhan dengan menjadikan murid, melatih pemimpin, dan mengirim utusan Injil.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700 transition-transform duration-300 hover:scale-105">
              <Link href="/contact">Temukan Lokasi</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300">
              <Link href="/about">Tentang Kami</Link>
            </Button>
          </div>
        </motion.div>
        <motion.div className="relative h-[500px] w-full" variants={itemVariants}>
          <motion.div
            className="absolute top-0 left-10 w-[60%] h-[70%] shadow-2xl rounded-2xl overflow-hidden"
            whileHover={{ scale: 1.05, zIndex: 10 }}
          >
            <Image src="https://placehold.co/600x800.png" alt="Church community" data-ai-hint="church community" fill className="object-cover" />
          </motion.div>
          <motion.div
            className="absolute bottom-0 right-0 w-[55%] h-[60%] shadow-2xl rounded-2xl overflow-hidden"
            whileHover={{ scale: 1.05, zIndex: 10 }}
          >
            <Image src="https://placehold.co/600x600.png" alt="Worship service" data-ai-hint="worship concert" fill className="object-cover" />
          </motion.div>
          <motion.div
            className="absolute top-20 right-10 w-[30%] h-[25%] shadow-2xl rounded-2xl overflow-hidden"
            whileHover={{ scale: 1.05, zIndex: 10 }}
          >
            <Image src="https://placehold.co/400x400.png" alt="Youth group" data-ai-hint="youth group" fill className="object-cover" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
