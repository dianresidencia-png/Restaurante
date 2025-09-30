/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tse1.mm.bing.net",
      },
    ],
  },
};

module.exports = nextConfig;
