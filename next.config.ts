import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
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
  async headers() {
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://s.ytimg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://i.pinimg.com https://images.unsplash.com https://*.public.blob.vercel-storage.com https://*.google.com https://*.googleapis.com https://*.gstatic.com",
      "media-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
      "connect-src 'self' https://*.public.blob.vercel-storage.com https://*.neon.tech https://*.vercel-storage.com",
      "frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com https://youtube.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: cspDirectives },
        ],
      },
    ];
  },
};

export default nextConfig;
