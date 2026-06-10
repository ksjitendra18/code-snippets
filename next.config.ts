import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    cssChunking: true,
    optimizeCss: true,
  },
  cacheComponents: true,
};

export default nextConfig;
