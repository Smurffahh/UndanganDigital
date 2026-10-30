import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/admin/dashboard",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/admin/dashboard/:path*",
        destination: "/dashboard/:path*",
        permanent: true,
      },
      {
        source: "/admin/login",
        destination: "/dashboard/login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
