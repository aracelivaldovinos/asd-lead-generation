import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@asd/domain", "@asd/services", "@asd/ui"],
  allowedDevOrigins: ["192.168.4.128"],
};

export default nextConfig;
