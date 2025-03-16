import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    // 外部画像の許可
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "picsum.photos",
        },
      ],
    },
};

export default nextConfig;
