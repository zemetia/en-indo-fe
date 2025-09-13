'use client';
import { ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CtaSection() {
    return (
        <section
        className="py-20 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
        data-ai-hint="church congregation"
      >
        <div className="backdrop-brightness-75 py-20 bg-blue-900/80">
          <motion.div
            className="container mx-auto px-4 text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <Heart className="w-12 h-12 mx-auto mb-4 text-blue-200" />
            <h2 className="text-4xl font-bold mb-4">Bergabunglah Dengan Keluarga Kami</h2>
            <p className="mb-8 max-w-2xl mx-auto text-lg text-blue-100">
              Kami ingin sekali terhubung dengan Anda. Temukan komunitas, tujuan, dan tempat di mana Anda dapat bertumbuh.
            </p>
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-500 text-white transition-transform duration-300 hover:scale-105">
              <Link href="/contact">
                Saya Baru <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    );
}
