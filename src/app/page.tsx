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
  User,
  Heart,
  MapPin,
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
    { name: 'Pdt. John Doe', branch: 'Every Nation Jakarta Pusat', image: 'https://placehold.co/400x500.png', dataAiHint: 'man portrait' },
    { name: 'Pdt. Jane Smith', branch: 'Every Nation Surabaya', image: 'https://placehold.co/400x500.png', dataAiHint: 'woman portrait' },
    { name: 'Pdt. Michael B.', branch: 'Every Nation Bandung', image: 'https://placehold.co/400x500.png', dataAiHint: 'man portrait smiling' },
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

  const ministries = [
    { title: "Pelayanan Kampus", icon: BookOpen, image: "https://placehold.co/600x800.png", dataAiHint: "university students" },
    { title: "Grup Sel (Life Group)", icon: Users, image: "https://placehold.co/600x800.png", dataAiHint: "small group" },
    { title: "Misi Global", icon: Globe, image: "https://placehold.co/600x800.png", dataAiHint: "world map" },
    { title: "Pelayanan Anak", icon: Sparkles, image: "https://placehold.co/600x800.png", dataAiHint: "children playing" },
  ];

  const locations = [
    { id: 1, name: 'EN Jakarta', top: '55%', left: '20%' },
    { id: 2, name: 'EN Bandung', top: '58%', left: '23%' },
    { id: 3, name: 'EN Surabaya', top: '62%', left: '35%' },
    { id: 4, name: 'EN Medan', top: '25%', left: '5%' },
    { id: 5, name: 'EN Makassar', top: '52%', left: '55%' },
    { id: 6, name: 'EN Jayapura', top: '45%', left: '90%' },
  ];

  return (
    <div className="bg-white text-gray-800 overflow-x-hidden">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-white">
        <motion.div
            className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <motion.div className="text-center md:text-left" variants={itemVariants}>
            <h1 
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                style={{ color: '#002D62' }}
            >
                Membangun Generasi Pengikut Kristus
            </h1>
            <p 
                className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0"
            >
                Every Nation Indonesia adalah gereja yang berkomitmen untuk menghormati Tuhan dengan menjadikan murid, melatih pemimpin, dan mengirim utusan Injil.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700 transition-transform duration-300 hover:scale-105">
                  <Link href="/contact">Temukan Lokasi</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-300">
                  <Link href="/about">Tentang Kami</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div className="relative h-[500px] w-full" variants={itemVariants}>
              <motion.div 
                className="absolute top-0 left-10 w-[60%] h-[70%] shadow-2xl rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.05, zIndex: 10 }}
              >
                <Image src="https://placehold.co/600x800.png" alt="Church community" data-ai-hint="church community" fill className="object-cover"/>
              </motion.div>
              <motion.div 
                className="absolute bottom-0 right-0 w-[55%] h-[60%] shadow-2xl rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.05, zIndex: 10 }}
              >
                <Image src="https://placehold.co/600x600.png" alt="Worship service" data-ai-hint="worship concert" fill className="object-cover"/>
              </motion.div>
               <motion.div 
                className="absolute top-20 right-10 w-[30%] h-[25%] shadow-2xl rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.05, zIndex: 10 }}
              >
                <Image src="https://placehold.co/400x400.png" alt="Youth group" data-ai-hint="youth group" fill className="object-cover"/>
              </motion.div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Visi Section */}
      <section 
        className="py-20"
        style={{ backgroundColor: '#F0F8FF' }}
      >
        <motion.div 
          className="container mx-auto px-4 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
        >
            <motion.div className="inline-block p-4 rounded-full mb-4" style={{ backgroundColor: 'rgba(173, 216, 230, 0.5)' }} variants={itemVariants}>
              <Eye className="w-10 h-10 text-blue-700" />
            </motion.div>
            <motion.h2 className="text-3xl font-bold mb-4" style={{ color: '#002D62' }} variants={itemVariants}>
                Visi Kami
            </motion.h2>
            <motion.p 
                className="text-gray-600 text-lg md:text-xl mb-12 max-w-3xl mx-auto"
                variants={itemVariants}
            >
                "Kami ada untuk menghormati Allah dengan mendirikan gereja-gereja dan pelayanan kampus yang berpusat pada Kristus, diberdayakan oleh Roh, dan bertanggung jawab secara sosial di setiap bangsa."
            </motion.p>
        </motion.div>
      </section>

      {/* Locations Map Section */}
      <section className="py-20 bg-white">
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#002D62' }} variants={itemVariants}>
            Hadir di Seluruh Indonesia
          </motion.h2>
          <motion.p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto" variants={itemVariants}>
            Temukan gereja Every Nation terdekat di kota Anda. Kami siap menyambut Anda dan keluarga.
          </motion.p>
          <motion.div className="relative w-full max-w-5xl mx-auto aspect-[2/1] rounded-2xl p-4" variants={itemVariants}>
            <svg viewBox="0 0 1000 500" className="w-full h-full drop-shadow-sm">
              <path 
                d="M2,255L82,242L116,193L153,205L194,149L245,213L320,195L383,235L382,259L432,271L465,243L544,244L564,288L627,272L678,321L717,294L715,264L764,257L771,221L825,233L852,203L903,212L941,162L995,153L993,212L943,243L942,285L994,302L952,357L883,348L848,375L814,357L745,368L708,392L654,383L621,411L571,399L545,431L480,419L445,445L401,424L372,447L314,429L262,459L170,447L124,472L88,443L31,438L2,382L2,255Z"
                fill="#D6EAF8"
                stroke="#A9CCE3"
                strokeWidth="1"
              />
            </svg>
            {locations.map((location) => (
              <div
                key={location.id}
                className="absolute group transform -translate-x-1/2 -translate-y-1/2"
                style={{ top: location.top, left: location.left }}
              >
                <motion.div
                  whileHover={{ scale: 1.5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <MapPin className="w-6 h-6 text-blue-700 fill-current drop-shadow-lg cursor-pointer" style={{ color: '#0053A0', fill: 'white' }} />
                </motion.div>
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                  {location.name}
                  <div className="absolute top-full mt-[-1px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Ministries Section */}
      <section className="py-20 bg-white">
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#002D62' }} variants={itemVariants}>
            Pelayanan Kami
          </motion.h2>
          <motion.p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto" variants={itemVariants}>
            Terlibat dalam komunitas dan bertumbuh bersama melalui berbagai pelayanan yang kami sediakan.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {ministries.map((ministry, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="overflow-hidden group text-center shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-2xl border-0">
                  <div className="relative h-64">
                    <Image src={ministry.image} alt={ministry.title} data-ai-hint={ministry.dataAiHint} fill className="object-cover group-hover:scale-105 transition-transform duration-300"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-left text-white">
                       <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full inline-block mb-2">
                        <ministry.icon className="w-6 h-6 text-white"/>
                       </div>
                       <h3 className="text-xl font-bold">{ministry.title}</h3>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Perkenalan Pendeta Section */}
      <section 
        className="py-20"
        style={{ backgroundColor: '#F0F8FF' }}
      >
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#002D62' }} variants={itemVariants}>
            Gembala Sidang Kami
          </motion.h2>
          <motion.p className="text-center text-gray-600 mb-12" variants={itemVariants}>
            Para pemimpin yang berdedikasi dari berbagai cabang gereja kami.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastors.map((pastor, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 h-full flex flex-col bg-white">
                  <div className="relative h-96">
                    <Image 
                      src={pastor.image} 
                      alt={pastor.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={pastor.dataAiHint}
                    />
                  </div>
                  <CardContent className="p-6 flex-grow flex flex-col justify-center">
                    <h3 className="text-xl font-semibold" style={{ color: '#002D62' }}>{pastor.name}</h3>
                    <p className="text-blue-600">{pastor.branch}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
        data-ai-hint="church congregation"
      >
        <div style={{ backgroundColor: 'rgba(0, 45, 98, 0.8)' }} className="py-20">
            <motion.div 
                className="container mx-auto px-4 text-center text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
            >
                <Heart className="w-12 h-12 mx-auto mb-4 text-blue-400"/>
                <h2 className="text-4xl font-bold mb-4">Bergabunglah Dengan Keluarga Kami</h2>
                <p className="mb-8 max-w-2xl mx-auto text-lg text-blue-100">
                    Kami ingin sekali terhubung dengan Anda. Temukan komunitas, tujuan, dan tempat di mana Anda dapat bertumbuh.
                </p>
                <Button size="lg" asChild className="bg-blue-500 hover:bg-blue-400 text-white transition-transform duration-300 hover:scale-105">
                  <Link href="/contact">
                    Saya Baru <ArrowRight className="w-4 h-4 ml-2"/>
                  </Link>
                </Button>
            </motion.div>
        </div>
      </section>
    </div>
  );
}
