'use client';
import { BookOpen, Users, Globe, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

export default function MinistriesSection() {
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

    const ministries = [
        { title: "Pelayanan Kampus", icon: BookOpen, image: "https://placehold.co/600x800.png", dataAiHint: "university students" },
        { title: "Grup Sel (Life Group)", icon: Users, image: "https://placehold.co/600x800.png", dataAiHint: "small group" },
        { title: "Misi Global", icon: Globe, image: "https://placehold.co/600x800.png", dataAiHint: "world map" },
        { title: "Pelayanan Anak", icon: Sparkles, image: "https://placehold.co/600x800.png", dataAiHint: "children playing" },
      ];

  return (
    <section className="py-20 bg-sky-50">
      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 className="text-3xl font-bold text-center mb-2 text-blue-900" variants={itemVariants}>
          Pelayanan Kami
        </motion.h2>
        <motion.p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto" variants={itemVariants}>
          Terlibat dalam komunitas dan bertumbuh bersama melalui berbagai pelayanan yang kami sediakan.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {ministries.map((ministry, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="overflow-hidden group text-center shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-2xl border-0 h-full flex flex-col">
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
  );
}
