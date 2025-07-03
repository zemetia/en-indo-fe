'use client';
import {
  Church,
  HeartHandshake,
  Users,
  Cross,
  Globe,
  Star,
  BookOpen,
  Send,
  Sparkles,
  Award,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <div className="bg-white text-gray-800 overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-soft-blue-hsl pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="text-center md:text-left" variants={itemVariants}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-slate-800">
                Membangun Generasi Pengikut Kristus
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto md:mx-0">
                Every Nation Indonesia adalah gereja yang berkomitmen untuk menghormati Tuhan dengan menjadikan murid, melatih pemimpin, dan mengirim utusan Injil.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/about">Pelajari Lebih Lanjut</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 hover:text-primary">
                  <Link href="/contact">Terhubung</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Image
                src="https://placehold.co/600x400.png"
                alt="Church community"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                data-ai-hint="church worship"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <motion.section
        className="py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 className="text-3xl font-bold mb-4 text-slate-800" variants={itemVariants}>
            Nilai-Nilai Kami
          </motion.h2>
          <motion.p className="text-slate-600 mb-12 max-w-3xl mx-auto" variants={itemVariants}>
            Kami percaya pada kekuatan komunitas, pertumbuhan rohani, dan jangkauan global untuk membawa kemuliaan bagi Tuhan.
          </motion.p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[
              { icon: Cross, title: 'Berpusat pada Kristus' },
              { icon: Sparkles, title: 'Diberdayakan oleh Roh' },
              { icon: Users, title: 'Komunitas Otentik' },
              { icon: BookOpen, title: 'Fokus Pemuridan' },
              { icon: Globe, title: 'Jangkauan Global' },
              { icon: Award, title: 'Pengembangan Kepemimpinan' },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-6 h-full shadow-sm hover:shadow-lg transition-shadow border-slate-100">
                    <div className="bg-blue-100 p-4 rounded-lg inline-block mb-4">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-800">{item.title}</h3>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Working Process Section */}
      <motion.section
        className="py-20 bg-soft-blue-hsl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 className="text-3xl font-bold mb-12 text-slate-800" variants={itemVariants}>
            Perjalanan Iman Anda
          </motion.h2>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-300/70 -translate-y-1/2 hidden md:block"></div>
            <div className="grid md:grid-cols-4 gap-8 relative">
              {[
                { icon: HeartHandshake, title: 'Engage', description: 'Terhubung dengan Tuhan & komunitas gereja' },
                { icon: Church, title: 'Establish', description: 'Membangun dasar iman yang kuat' },
                { icon: Star, title: 'Equip', description: 'Diperlengkapi untuk melayani' },
                { icon: Send, title: 'Empower', description: 'Diutus untuk menjadikan murid' },
              ].map((step, index) => (
                <motion.div key={index} className="flex flex-col items-center" variants={itemVariants}>
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-primary font-bold text-lg shadow-lg mb-4 z-10 border-4 border-primary/20">
                    <step.icon className="w-10 h-10"/>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.h2 className="text-3xl font-bold text-center mb-12 text-slate-800" variants={itemVariants}>
            Kisah dari Komunitas Kami
          </motion.h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                quote: 'Saya menemukan tujuan dan komunitas yang tulus di sini. Pertumbuhan rohani saya sangat luar biasa.',
                name: 'Andi S.',
                role: 'Profesional Muda',
                image: 'https://placehold.co/100x100.png',
                dataAiHint: 'man portrait'
              },
              {
                quote: 'Sebagai sebuah keluarga, kami merasa diterima dan didukung. Anak-anak kami menyukai pelayanan anak.',
                name: 'Keluarga Budi',
                role: 'Keluarga',
                image: 'https://placehold.co/100x100.png',
                dataAiHint: 'family portrait'
              },
              {
                quote: 'Pelayanan kampus benar-benar mengubah hidup saya selama masa kuliah. Saya belajar menjadi seorang pemimpin.',
                name: 'Citra W.',
                role: 'Mahasiswa',
                image: 'https://placehold.co/100x100.png',
                dataAiHint: 'woman portrait'
              },
            ].map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full shadow-sm hover:shadow-lg transition-shadow border-slate-100">
                  <CardContent className="p-8 flex flex-col justify-between h-full bg-white rounded-lg">
                    <p className="text-slate-600 italic mb-6 text-lg">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={50}
                        height={50}
                        className="rounded-full mr-4"
                        data-ai-hint={testimonial.dataAiHint}
                      />
                      <div>
                        <p className="font-semibold text-slate-800">{testimonial.name}</p>
                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-primary text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Mengambil Langkah Selanjutnya?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Apakah Anda baru dalam iman atau sedang mencari gereja, kami siap menyambut Anda. Bergabunglah bersama kami dan temukan tempat Anda dalam keluarga Tuhan.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
            <Link href="/contact">Hubungi Kami</Link>
          </Button>
        </div>
      </motion.section>
    </div>
  );
}
