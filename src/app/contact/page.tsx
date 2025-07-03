'use client';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

export default function ContactPage() {
  const geoUrl = "https://raw.githubusercontent.com/tvalentius/Indonesia-topojson/master/indonesiaprovince.json";
  const mainOffice = { name: 'EN Indonesia Office', coordinates: [106.8272, -6.1751] as [number, number] };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-32 md:py-48 bg-sky-50">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-blue-900 mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Hubungi Kami
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Kami ingin sekali mendengar dari Anda. Jangan ragu untuk menghubungi kami.
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-blue-900 mb-6">Kirim Pesan</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <Input id="name" type="text" placeholder="John Doe" className="bg-gray-50"/>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input id="email" type="email" placeholder="anda@email.com" className="bg-gray-50"/>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
                  <Input id="subject" type="text" placeholder="Subjek pesan Anda" className="bg-gray-50"/>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
                  <textarea id="message" rows={5} placeholder="Tuliskan pesan Anda di sini..." className="w-full rounded-md border-gray-300 bg-gray-50 p-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"></textarea>
                </div>
                <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  Kirim Pesan
                </Button>
              </form>
            </motion.div>

            {/* Contact Info & Map */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-sky-50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Informasi Kontak</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full"><MapPin className="w-5 h-5 text-blue-700"/></div>
                    <div>
                      <h4 className="font-semibold">Alamat Kantor Pusat</h4>
                      <p className="text-gray-600">Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan, Indonesia</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full"><Phone className="w-5 h-5 text-blue-700"/></div>
                    <div>
                      <h4 className="font-semibold">Telepon</h4>
                      <p className="text-gray-600">(021) 1234-5678</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full"><Mail className="w-5 h-5 text-blue-700"/></div>
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-gray-600">info@everynation.id</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-xl h-96">
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                      scale: 8000,
                      center: [106.8272, -6.1751],
                    }}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Geographies geography={geoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#D6EAF8"
                            stroke="#FFFFFF"
                          />
                        ))
                      }
                    </Geographies>
                    <Marker coordinates={mainOffice.coordinates}>
                      <circle r={10} fill="#1E40AF" stroke="#fff" strokeWidth={2} />
                    </Marker>
                </ComposableMap>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
