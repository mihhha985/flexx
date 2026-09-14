import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      // One avatar plus several gallery images can be submitted in a single product form.
      bodySizeLimit: "60mb",
    },
  },
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
