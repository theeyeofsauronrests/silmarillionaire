import type { NextConfig } from "next";
import { getAllowedImageHosts } from "./lib/security/remote-images";

const allowedImageHosts = getAllowedImageHosts();

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: allowedImageHosts.map((hostname) => ({
      protocol: "https",
      hostname
    }))
  }
};

export default nextConfig;
