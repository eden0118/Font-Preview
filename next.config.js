/** @type {import('next').NextConfig} */
export const nextConfig = {
  output: 'standalone',
  compress: true,
  optimizeFonts: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,

  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    },
  ],

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },

  onDemandEntries: {
    // 增加條目保活時間以改善熱更新穩定性
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },

  // 圖片最佳化配置
  images: {
    unoptimized: true, // Font Preview 無需外部圖片，可禁用
  },

  // 實驗性功能
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
