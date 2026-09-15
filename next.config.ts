import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },
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
