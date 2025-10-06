
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
  // Configuración extendida para grupos de rutas
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
  },
  // Agregar transpilePackages
  transpilePackages: ['next-auth', 'bcryptjs'],
}

module.exports = nextConfig