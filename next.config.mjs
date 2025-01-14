/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Configure SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  },
  images: {
    domains: ['uhmqsszvollkbxcspyqe.supabase.co'], // Allow Supabase storage URLs
  }
};

export default nextConfig;
