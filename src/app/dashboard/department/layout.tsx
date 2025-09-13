'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

export default function DepartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {children}
    </motion.div>
  );
}