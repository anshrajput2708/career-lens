import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["canvas", "pdfjs-dist"],
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  turbopack: {},
  typescript: {
    // Allow production builds to succeed even with TS type errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
