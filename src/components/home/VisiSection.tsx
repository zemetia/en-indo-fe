'use client';

import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

export default function VisiSection() {
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
    <section className="py-20 bg-sky-50">
      <motion.div
        className="container mx-auto px-4 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={containerVariants}
      >
        <motion.div className="inline-block p-4 rounded-full mb-4 bg-white shadow-md" variants={itemVariants}>
          <Eye className="w-10 h-10 text-blue-700" />
        </motion.div>
        <motion.h2 className="text-3xl font-bold mb-4 text-blue-900" variants={itemVariants}>
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
  );
}
