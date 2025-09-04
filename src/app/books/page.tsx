'use client';
import { useEffect } from 'react';
import { Book, Download, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function BooksPage() {
  useEffect(() => {
    document.title = 'Buku - Every Nation Indonesia';
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const books = [
    {
      title: 'Dasar-Dasar Iman',
      author: 'Pdt. Budi Santoso',
      description: 'Sebuah panduan komprehensif untuk memahami dasar-dasar kekristenan.',
      image: 'https://placehold.co/400x600.png',
      dataAiHint: 'book cover'
    },
    {
      title: 'Hidup Dalam Panggilan',
      author: 'Pdt. Rina Wijaya',
      description: 'Menemukan dan menjalani tujuan Tuhan untuk hidup Anda.',
      image: 'https://placehold.co/400x600.png',
      dataAiHint: 'book cover abstract'
    },
    {
      title: 'Kepemimpinan yang Melayani',
      author: 'Ev. Michael Tan',
      description: 'Belajar menjadi pemimpin seperti Kristus di setiap area kehidupan.',
      image: 'https://placehold.co/400x600.png',
      dataAiHint: 'book cover minimalist'
    },
    {
      title: 'Kemenangan Setiap Hari',
      author: 'Pdt. Budi Santoso',
      description: 'Kumpulan renungan harian untuk memperkuat iman Anda.',
      image: 'https://placehold.co/400x600.png',
      dataAiHint: 'book cover inspirational'
    },
    {
      title: 'Panduan Life Group',
      author: 'Tim Every Nation',
      description: 'Materi diskusi mingguan untuk kelompok sel Anda.',
      image: 'https://placehold.co/400x600.png',
      dataAiHint: 'book cover modern'
    },
    {
      title: 'Doa yang Mengubah',
      author: 'Pdt. Rina Wijaya',
      description: 'Membangun kehidupan doa yang lebih dalam dan berdampak.',
      image: 'https://placehold.co/400x600.png',
      dataAiHint: 'book cover spiritual'
    },
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative py-32 md:py-48 bg-sky-50">
        <div className="container mx-auto px-4 text-center relative">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-blue-900 mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Pusat Materi & Buku
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Perlengkapi diri Anda dengan sumber daya untuk bertumbuh dalam iman dan pengetahuan.
          </motion.p>
        </div>
      </section>

      {/* Books Grid Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {books.map((book, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl h-full transition-all duration-300 border-0 flex flex-col">
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={book.image}
                      alt={book.title}
                      fill
                      className="object-cover"
                      data-ai-hint={book.dataAiHint}
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-blue-900 mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">oleh {book.author}</p>
                    <p className="text-sm text-gray-600 leading-relaxed flex-grow">{book.description}</p>
                    <div className="mt-4 flex gap-2">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <ShoppingCart className="w-4 h-4 mr-2" /> Beli
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" /> Unduh Sampel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
