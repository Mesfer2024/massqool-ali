import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    localPatterns: [
      { pathname: "/media/**" },
    ],
  },
};

export default nextConfig;

