'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

export default function PastorsSection() {
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

    return (
        <section
        className="py-20 bg-white"
      >
        <motion.div
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2 className="text-3xl font-bold text-center mb-2 text-blue-900" variants={itemVariants}>
            Gembala Sidang Kami
          </motion.h2>
          <motion.p className="text-center text-gray-600 mb-12" variants={itemVariants}>
            Para pemimpin yang berdedikasi dari berbagai cabang gereja kami.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastors.map((pastor, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 h-full flex flex-col">
                  <div className="relative h-96">
                    <Image
                      src={pastor.image}
                      alt={pastor.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={pastor.dataAiHint}
                    />
                  </div>
                  <CardContent className="p-6 flex-grow flex flex-col justify-center bg-sky-50">
                    <h3 className="text-xl font-semibold text-blue-900">{pastor.name}</h3>
                    <p className="text-blue-700">{pastor.branch}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    );
}
