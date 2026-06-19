import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  experimental:{
    serverActions: {
      bodySizeLimit: '5mb',
    }
  },

  async redirects() {
    return [
      {
        source: "/admin/dashboard",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/admin/dashboard/:path*",
        destination: "/admin/:path*",
        permanent: true,
      },
      {
        source: "/user",
        destination: "/user/dashboard",
        permanent: true,
      },
    ];
  }
};

export default nextConfig;
