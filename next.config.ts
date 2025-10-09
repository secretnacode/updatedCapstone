import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Add your Cloudinary domain to remotePatterns
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dtysh6wzg/**",
      },
      {
        protocol: "https",
        hostname: "cdn.weatherapi.com",
        port: "",
        pathname: "/weather/**",
      },
    ],
  },
};

module.exports = nextConfig;

export default nextConfig;
