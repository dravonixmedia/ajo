import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Cloudflare Workers routes /_next/image through the Images binding
    // (env.IMAGES), which requires Cloudflare Images to be provisioned on
    // the account. Until that's confirmed set up, serve photos unoptimized
    // (straight from static assets) so they render reliably; re-enable
    // optimization once Images is confirmed working.
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
