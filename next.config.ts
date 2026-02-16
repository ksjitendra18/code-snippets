import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cssChunking: true,
    optimizeCss: true,
  },
  cacheComponents: true,
};

export default nextConfig;
