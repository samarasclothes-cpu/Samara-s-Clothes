/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permite mostrar las fotos guardadas en Supabase Storage.
    // Reemplaza el hostname si tu proyecto usa otro dominio (se ajusta solo con la variable de entorno).
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
