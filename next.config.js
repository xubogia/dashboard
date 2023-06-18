/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['picsum.photos','loremflickr.com'],
  },
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.module.rules.push(
      { test: /\.svg$/, use: ['@svgr/webpack'] },
      {
        test: /\.(heic|hif)$/i,
        use: [
          {
            loader: 'heic2any',
            options: {
              toType: 'jpeg',
              quality: 0.8,
              force: true,
            },
          },
        ],
      }
    );
    return config;
  },
};

module.exports = nextConfig;
