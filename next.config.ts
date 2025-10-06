const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tse1.mm.bing.net",
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
