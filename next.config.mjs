/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uhmqsszvollkbxcspyqe.supabase.co',
      },
    ],
  },
  // Allow all static files
  experimental: {
    appDir: true,
  },
  // Disable strict mode for development
  reactStrictMode: false,
}

export default nextConfig;
