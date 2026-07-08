import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@paper-design/shaders-react"],
};

export default nextConfig;
