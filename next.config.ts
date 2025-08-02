import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Add your Cloudinary domain to remotePatterns
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "", // Keep empty string if no specific port
        // IMPORTANT: The pathname should reflect your Cloudinary configuration.
        // It typically starts with your cloud_name and then the folder structure if any.
        // For example, if your cloud_name is 'my-cool-app-123' and you upload to a 'my-app-images' folder:
        pathname: "/dtysh6wzg/**", // Replace 'your_cloud_name_here' with your actual Cloud name!
      },
    ],
  },
};

module.exports = nextConfig;

export default nextConfig;
