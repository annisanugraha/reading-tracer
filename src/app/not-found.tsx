"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex flex-1 w-full flex-col items-center justify-center px-4 pt-32 pb-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center"
      >
        <div className="eyebrow mb-6 opacity-60">Halaman Tidak Ditemukan</div>
        <h1 
          className="heading-display mb-4 text-balance flex gap-2"
          style={{ fontSize: "clamp(4rem, 12vw, 8rem)", color: "var(--navy)", lineHeight: 1 }}
        >
          <motion.span 
            className="inline-block"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            4
          </motion.span>
          <motion.span 
            className="inline-block"
            style={{ color: "var(--pink-soft)" }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          >
            0
          </motion.span>
          <motion.span 
            className="inline-block"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          >
            4
          </motion.span>
        </h1>
        
        <p 
          className="font-display italic mb-10 text-balance max-w-sm"
          style={{ fontSize: "1.1rem", color: "var(--ink-mid)" }}
        >
          Lembaran yang kamu cari sepertinya terlepas dari jilidnya, atau tidak pernah diletakkan di rak ini.
        </p>
        
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link href="/" className="btn btn-ink">
            <i className="ri-arrow-left-line mr-2" />
            Kembali ke Atelier
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
