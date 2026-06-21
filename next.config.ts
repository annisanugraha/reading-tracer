import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Supaya Turbopack tidak salah deteksi workspace root karena ada
  // lockfile lain di parent dir (sesuai warning Next.js 16).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;