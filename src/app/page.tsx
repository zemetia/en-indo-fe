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
  Quote,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
  
  const pastors = [
    { name: 'Pdt. John Doe', branch: 'Every Nation Jakarta Pusat', image: 'https://placehold.co/400x400.png', dataAiHint: 'man portrait' },
    { name: 'Pdt. Jane Smith', branch: 'Every Nation Surabaya', image: 'https://placehold.co/400x400.png', dataAiHint: 'woman portrait' },
    { name: 'Pdt. Michael B.', branch: 'Every Nation Bandung', image: 'https://placehold.co/400x400.png', dataAiHint: 'man portrait smiling' },
  ];

  return (
    <div className="bg-white text-slate-800 overflow-x-hidden">
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-white">
        <motion.div
            className="container mx-auto px-4 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl mx-auto"
                variants={itemVariants}
            >
                Membangun Generasi Pengikut Kristus
            </motion.h1>
            <motion.p 
                className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto"
                variants={itemVariants}
            >
                Every Nation Indonesia adalah gereja yang berkomitmen untuk menghormati Tuhan dengan menjadikan murid, melatih pemimpin, dan mengirim utusan Injil.
            </motion.p>
            <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={itemVariants}
            >
                <Button asChild size="lg">
                    <Link href="/contact">Terhubung dengan Kami</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/about">Pelajari Visi Kami</Link>
                </Button>
            </motion.div>
        </motion.div>
      </section>
      
      {/* Visi Section */}
      <motion.section 
        className="py-20 bg-slate-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4 text-center">
            <motion.div className="inline-block bg-primary/10 p-4 rounded-full mb-4" variants={itemVariants}>
              <Eye className="w-10 h-10 text-primary" />
            </motion.div>
            <motion.h2 className="text-3xl font-bold mb-4" variants={itemVariants}>
                Visi Kami
            </motion.h2>
            <motion.p 
                className="text-slate-600 text-lg md:text-xl mb-12 max-w-3xl mx-auto"
                variants={itemVariants}
            >
                "Kami ada untuk menghormati Allah dengan mendirikan gereja-gereja dan pelayanan kampus yang berpusat pada Kristus, diberdayakan oleh Roh, dan bertanggung jawab secara sosial di setiap bangsa."
            </motion.p>
        </div>
      </motion.section>

      {/* Nilai-Nilai Kami Section */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.h2 className="text-3xl font-bold mb-12 text-center" variants={itemVariants}>
            Pilar Pelayanan Kami
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[
              { icon: Cross, title: 'Berpusat pada Kristus', description: 'Menjadikan Yesus sebagai pusat dari semua yang kami lakukan.' },
              { icon: Sparkles, title: 'Diberdayakan oleh Roh', description: 'Bergantung pada kuasa Roh Kudus dalam pelayanan.' },
              { icon: Users, title: 'Komunitas Otentik', description: 'Membangun hubungan yang tulus dan saling mendukung.' },
              { icon: BookOpen, title: 'Fokus Pemuridan', description: 'Berkomitmen untuk bertumbuh dan memuridkan.' },
              { icon: Globe, title: 'Jangkauan Global', description: 'Membawa Injil hingga ke ujung bumi.' },
              { icon: Award, title: 'Pengembangan Kepemimpinan', description: 'Melatih dan memperlengkapi pemimpin masa depan.' },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-6 h-full shadow-sm hover:shadow-lg transition-shadow bg-white border-slate-100">
                    <div className="flex items-start space-x-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-slate-600">{item.description}</p>
                        </div>
                    </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Pastors Section */}
      <motion.section 
        className="py-20 bg-slate-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.h2 className="text-3xl font-bold text-center mb-2" variants={itemVariants}>
            Gembala Sidang Kami
          </motion.h2>
          <motion.p className="text-center text-slate-600 mb-12" variants={itemVariants}>
            Para pemimpin yang berdedikasi dari berbagai cabang gereja kami.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastors.map((pastor, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center overflow-hidden group border-slate-100 shadow-sm">
                  <div className="relative h-64 bg-slate-200">
                    <Image 
                      src={pastor.image} 
                      alt={pastor.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={pastor.dataAiHint}
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold">{pastor.name}</h3>
                    <p className="text-primary">{pastor.branch}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.h2 className="text-3xl font-bold text-center mb-12" variants={itemVariants}>
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
                <Card className="h-full shadow-sm hover:shadow-lg transition-shadow border-slate-100 bg-slate-50">
                  <CardContent className="p-8 flex flex-col justify-between h-full rounded-lg">
                    <Quote className="w-8 h-8 text-primary/30 mb-4"/>
                    <p className="text-slate-600 mb-6 flex-grow">"{testimonial.quote}"</p>
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
                        <p className="font-semibold">{testimonial.name}</p>
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
        className="py-20 bg-slate-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 text-center">
            <Card className="max-w-4xl mx-auto p-8 md:p-12 shadow-lg bg-primary text-primary-foreground">
                <h2 className="text-3xl font-bold mb-4">Siap Mengambil Langkah Selanjutnya?</h2>
                <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                    Apakah Anda baru dalam iman atau sedang mencari gereja, kami siap menyambut Anda. Bergabunglah bersama kami dan temukan tempat Anda dalam keluarga Tuhan.
                </p>
                <div className="bg-white p-2 rounded-lg max-w-lg mx-auto flex items-center">
                    <Input type="email" placeholder="Masukkan email Anda" className="bg-transparent border-none text-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0"/>
                    <Button type="submit" size="lg" className="flex-shrink-0">
                        Berlangganan
                        <ArrowRight className="w-4 h-4 ml-2"/>
                    </Button>
                </div>
            </Card>
        </div>
      </motion.section>
    </div>
  );
}
