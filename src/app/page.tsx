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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  
  const testimonials = [
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
  ];

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <motion.div
            className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <motion.div className="text-center md:text-left" variants={itemVariants}>
            <h1 
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
                Membangun Generasi Pengikut Kristus
            </h1>
            <p 
                className="text-lg text-muted-foreground mb-8"
            >
                Every Nation Indonesia adalah gereja yang berkomitmen untuk menghormati Tuhan dengan menjadikan murid, melatih pemimpin, dan mengirim utusan Injil.
            </p>
            <Button asChild size="lg">
                <Link href="/contact">Temukan Lokasi Terdekat</Link>
            </Button>
          </motion.div>
          <motion.div className="grid grid-cols-2 grid-rows-2 gap-4 h-[450px]" variants={itemVariants}>
              <div className="col-span-1 row-span-2 relative">
                <Image src="https://placehold.co/600x800.png" alt="Church community" data-ai-hint="church community" fill className="object-cover rounded-lg shadow-lg"/>
              </div>
              <div className="col-span-1 row-span-1 relative">
                <Image src="https://placehold.co/600x400.png" alt="Worship service" data-ai-hint="worship concert" fill className="object-cover rounded-lg shadow-lg"/>
              </div>
              <div className="col-span-1 row-span-1 relative">
                <Image src="https://placehold.co/600x400.png" alt="Youth group" data-ai-hint="youth group" fill className="object-cover rounded-lg shadow-lg"/>
              </div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Visi Section */}
      <section 
        className="py-20 bg-secondary"
      >
        <motion.div 
          className="container mx-auto px-4 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
        >
            <motion.div className="inline-block bg-primary/10 p-4 rounded-full mb-4" variants={itemVariants}>
              <Eye className="w-10 h-10 text-primary" />
            </motion.div>
            <motion.h2 className="text-3xl font-bold mb-4" variants={itemVariants}>
                Visi Kami
            </motion.h2>
            <motion.p 
                className="text-muted-foreground text-lg md:text-xl mb-12 max-w-3xl mx-auto"
                variants={itemVariants}
            >
                "Kami ada untuk menghormati Allah dengan mendirikan gereja-gereja dan pelayanan kampus yang berpusat pada Kristus, diberdayakan oleh Roh, dan bertanggung jawab secara sosial di setiap bangsa."
            </motion.p>
        </motion.div>
      </section>

      {/* Perkenalan Pendeta Section */}
      <section 
        className="py-20 bg-background"
      >
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2 className="text-3xl font-bold text-center mb-2" variants={itemVariants}>
            Gembala Sidang Kami
          </motion.h2>
          <motion.p className="text-center text-muted-foreground mb-12" variants={itemVariants}>
            Para pemimpin yang berdedikasi dari berbagai cabang gereja kami.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastors.map((pastor, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center overflow-hidden group border-border shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-80 bg-slate-200">
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
        </motion.div>
      </section>

      {/* Kisah Komunitas (Testimonials) Section */}
      <section
        className="py-20 bg-secondary"
      >
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2 className="text-3xl font-bold text-center mb-12" variants={itemVariants}>
            Kisah dari Komunitas Kami
          </motion.h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full shadow-sm hover:shadow-lg transition-shadow border-border bg-card">
                  <CardContent className="p-8 flex flex-col justify-between h-full rounded-lg">
                    <Quote className="w-8 h-8 text-primary/30 mb-4"/>
                    <p className="text-muted-foreground mb-6 flex-grow">"{testimonial.quote}"</p>
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
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 bg-cover bg-center"
        style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
      >
        <div className="bg-black/50 py-20">
            <motion.div 
                className="container mx-auto px-4 text-center text-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold mb-4">Dapatkan Update Terbaru</h2>
                <p className="mb-8 max-w-2xl mx-auto">
                    Berlangganan untuk menerima berita, acara, dan renungan terbaru langsung ke kotak masuk Anda.
                </p>
                <div className="bg-white/90 p-2 rounded-lg max-w-lg mx-auto flex items-center shadow-lg">
                    <Input type="email" placeholder="Masukkan email Anda" className="bg-transparent border-none text-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-500"/>
                    <Button type="submit" size="lg" className="flex-shrink-0">
                        Berlangganan
                        <ArrowRight className="w-4 h-4 ml-2"/>
                    </Button>
                </div>
            </motion.div>
        </div>
      </section>
    </div>
  );
}
