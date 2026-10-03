import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export keeps the MVP deployable anywhere (Vercel, S3, plain file server).
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
