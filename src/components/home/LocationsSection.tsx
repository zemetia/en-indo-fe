'use client';
import { motion } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

export default function LocationsSection() {
    const locations = [
        { id: 1, name: 'EN Jakarta', coordinates: [106.8456, -6.2088] as [number, number] },
        { id: 2, name: 'EN Bandung', coordinates: [107.6191, -6.9175] as [number, number] },
        { id: 3, name: 'EN Surabaya', coordinates: [112.7521, -7.2575] as [number, number] },
        { id: 4, name: 'EN Medan', coordinates: [98.6722, 3.5952] as [number, number] },
        { id: 5, name: 'EN Makassar', coordinates: [119.4327, -5.1477] as [number, number] },
        { id: 6, name: 'EN Jayapura', coordinates: [140.7181, -2.5333] as [number, number] },
      ];
    
      const geoUrl =
    'https://raw.githubusercontent.com/tvalentius/Indonesia-topojson/refs/heads/master/indonesia-topojson-city-regency.json'; //never change this line
    
  return (
    <section className="w-full h-screen bg-white relative">
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 text-center px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-blue-900"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Hadir di Seluruh Indonesia
        </motion.h2>
        <motion.p
          className="text-gray-600 mt-2 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Temukan gereja Every Nation terdekat di kota Anda. Kami siap menyambut Anda dan keluarga.
        </motion.p>
      </div>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1200,
          center: [118, -2],
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#D6EAF8"
                stroke="#FFFFFF"
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { fill: '#A9CCE3', outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
        {locations.map(({ id, name, coordinates }) => (
          <Marker key={id} coordinates={coordinates}>
            <g className="group cursor-pointer">
              <circle
                r={8}
                fill="#1D4ED8"
                stroke="#fff"
                strokeWidth={2}
                className="transition-all duration-300 group-hover:r-12"
              />
              <text
                textAnchor="middle"
                y={-20}
                style={{ fontFamily: 'Roboto, system-ui', fill: '#1E3A8A', fontSize: 14, fontWeight: 'bold', pointerEvents: 'none' }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                {name}
              </text>
            </g>
          </Marker>
        ))}
      </ComposableMap>
    </section>
  );
}
