import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "next-articles.s3.ap-south-1.amazonaws.com", // "**" for whitelisting all domains
      },
    ],
  },
};

export default nextConfig;
