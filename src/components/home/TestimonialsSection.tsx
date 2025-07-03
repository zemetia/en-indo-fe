'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function TestimonialsSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
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
        <section className="py-20 bg-sky-50">
            <motion.div
                className="container mx-auto px-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
            >
                <motion.h2 className="text-3xl font-bold text-center mb-2 text-blue-900" variants={itemVariants}>
                    Apa Kata Mereka
                </motion.h2>
                <motion.p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto" variants={itemVariants}>
                    Dengarkan cerita dari mereka yang telah menjadi bagian dari keluarga Every Nation Indonesia.
                </motion.p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card className="h-full bg-white shadow-lg rounded-2xl border-0 flex flex-col p-8">
                                <Quote className="w-8 h-8 text-blue-300 mb-4" />
                                <p className="text-gray-600 italic flex-grow">"{testimonial.quote}"</p>
                                <div className="flex items-center mt-6">
                                    <Image 
                                        src={testimonial.image} 
                                        alt={testimonial.name}
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                        data-ai-hint={testimonial.dataAiHint}
                                    />
                                    <div className="ml-4">
                                        <p className="font-semibold text-blue-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
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
