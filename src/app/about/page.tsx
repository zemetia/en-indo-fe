'use client';
import { Building, Milestone, Users, Eye, Target, Heart, Handshake, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  const team = [
    { name: 'Pdt. Budi Santoso', role: 'Gembala Sidang Senior', image: 'https://placehold.co/400x400.png', dataAiHint: 'man portrait' },
    { name: 'Pdt. Rina Wijaya', role: 'Direktur Pelayanan', image: 'https://placehold.co/400x400.png', dataAiHint: 'woman portrait' },
    { name: 'Ev. Michael Tan', role: 'Koordinator Misi', image: 'https://placehold.co/400x400.png', dataAiHint: 'man portrait smiling' },
  ];

  const values = [
    { icon: Heart, title: 'Mengasihi Tuhan', description: 'Menempatkan Tuhan sebagai pusat dari segalanya.' },
    { icon: Handshake, title: 'Mengasihi Sesama', description: 'Membangun komunitas yang tulus dan peduli.' },
    { icon: BrainCircuit, title: 'Menjadi Murid', description: 'Bertumbuh dalam pengenalan akan Kristus setiap hari.' },
    { icon: Users, title: 'Membuat Murid', description: 'Membagikan Injil dan membimbing orang lain.' },
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative py-32 md:py-48 bg-blue-50">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10" 
          style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
          data-ai-hint="church building"
        ></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-blue-900 mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Tentang Every Nation Indonesia
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Sebuah keluarga rohani yang berdedikasi untuk menghormati Tuhan dan membuat murid di seluruh bangsa.
          </motion.p>
        </div>
      </section>

      {/* Sejarah Kami Section */}
      <section className="py-20">
        <motion.div
          className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Image
              src="https://placehold.co/800x600.png"
              alt="Sejarah Every Nation"
              data-ai-hint="old paper map"
              width={800}
              height={600}
              className="rounded-xl shadow-2xl"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Milestone className="w-6 h-6 text-blue-700" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900">Sejarah Kami</h2>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Every Nation didirikan pada tahun 1994 ketika para pemimpin gereja dari berbagai negara bersatu dengan visi bersama untuk menjangkau setiap bangsa dalam satu generasi. Di Indonesia, perjalanan kami dimulai pada awal tahun 2000-an, dengan sekelompok kecil orang percaya yang bersemangat untuk membawa pesan Injil ke kota-kota besar.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Sejak saat itu, dengan kasih karunia Tuhan, kami telah bertumbuh menjadi gerakan multi-gereja yang dinamis, mendirikan gereja dan pelayanan kampus di berbagai pulau, dari Jakarta hingga Jayapura, dengan komitmen yang tak tergoyahkan untuk melatih para pemimpin dan mengubah kehidupan.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Visi, Misi, Nilai Section */}
      <section className="py-20 bg-sky-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid lg:grid-cols-3 gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {/* Visi */}
            <motion.div variants={itemVariants} className="text-center">
              <div className="inline-block p-4 bg-white rounded-full shadow-md mb-4">
                <Eye className="w-10 h-10 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">Visi Kami</h3>
              <p className="text-gray-600">Menghormati Tuhan dengan mendirikan gereja yang berpusat pada Kristus dan bertanggung jawab secara sosial di setiap bangsa.</p>
            </motion.div>

            {/* Misi */}
            <motion.div variants={itemVariants} className="text-center">
              <div className="inline-block p-4 bg-white rounded-full shadow-md mb-4">
                <Target className="w-10 h-10 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">Misi Kami</h3>
              <p className="text-gray-600">Untuk menjadikan murid, melatih pemimpin, dan mengutus utusan Injil yang diberdayakan oleh Roh Kudus.</p>
            </motion.div>

            {/* Nilai-nilai */}
            <motion.div variants={itemVariants} className="text-center">
              <div className="inline-block p-4 bg-white rounded-full shadow-md mb-4">
                <Heart className="w-10 h-10 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">Nilai-Nilai Kami</h3>
              <p className="text-gray-600">Mengasihi Tuhan, Mengasihi Sesama, Menjadi Murid, Membuat Murid.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Meet The Team Section */}
      <section className="py-20 bg-white">
        <motion.div
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2 className="text-3xl font-bold text-center mb-12 text-blue-900" variants={itemVariants}>
            Temui Tim Kepemimpinan Kami
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 h-full flex flex-col">
                  <div className="relative h-80">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={member.dataAiHint}
                    />
                  </div>
                  <CardContent className="p-6 flex-grow flex flex-col justify-center bg-sky-50">
                    <h3 className="text-xl font-semibold text-blue-900">{member.name}</h3>
                    <p className="text-blue-700">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
