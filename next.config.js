/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Performance ────────────────────────────────────────────
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-tabs',
    ],
  },

  // ── Images ─────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
    remotePatterns: [],
  },

  // ── Build ──────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // ── Webpack — fix @imgly/background-removal WASM/ESM ───────
  webpack: (config, { isServer }) => {
    // Exclude ONNX Runtime node bindings from client bundle
    config.resolve.alias = {
      ...config.resolve.alias,
      'onnxruntime-node': false,
    }

    // Treat .mjs files from onnxruntime as ESM modules
    config.module.rules.push({
      test: /\.m?js$/,
      include: /node_modules\/(onnxruntime-web|@imgly)/,
      type: 'javascript/auto',
      resolve: { fullySpecified: false },
    })

    // Don't bundle WASM files — serve them as static assets
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    })

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }

    return config
  },

  // ── Headers ────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Required for SharedArrayBuffer (WASM multi-threading)
      {
        source: '/tools/background-remover',
        headers: [
          { key: 'Cross-Origin-Opener-Policy',   value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy',  value: 'require-corp' },
        ],
      },
      // Immutable cache for static assets
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // Service Worker — no cache
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      // Manifest
      {
        source: '/manifest.json',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
    ]
  },

  // ── Redirects ──────────────────────────────────────────────
  async redirects() {
    return [
      { source: '/tool/:slug', destination: '/tools/:slug', permanent: true },
    ]
  },
}

module.exports = nextConfig
