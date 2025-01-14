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
  // Ensure static assets are copied to the build output
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/i,
      type: 'asset/resource'
    });
    return config;
  },
}

export default nextConfig;
