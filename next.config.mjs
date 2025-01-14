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
  webpack(config) {
    // SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack']
    });
    return config;
  },
}

export default nextConfig;
