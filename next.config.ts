import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permite todos los dominios
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://ev3api-3fdk.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;