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

  // ── Webpack — fix @huggingface/transformers for browser ────
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Force browser build of transformers.js (not node build)
      config.resolve.alias = {
        ...config.resolve.alias,
        '@huggingface/transformers': '@huggingface/transformers/dist/transformers.web.js',
        // Exclude node-only packages
        'onnxruntime-node': false,
        'sharp': false,
      }

      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
      }
    }

    if (isServer) {
      // Also alias on server to avoid WASM resolution errors
      config.resolve.alias = {
        ...config.resolve.alias,
        '@huggingface/transformers': '@huggingface/transformers/dist/transformers.web.js',
        'onnxruntime-node': false,
        'sharp': false,
        'ort-wasm-simd-threaded.asyncify.wasm': false,
        'ort.webgpu.bundle.min.mjs': false,
      }

      // Treat as external to avoid bundling WASM on server
      const originalExternals = config.externals
      config.externals = [
        ...(Array.isArray(originalExternals) ? originalExternals : [originalExternals]),
        ({ request }, callback) => {
          if (request && (request.includes('ort-wasm') || request.includes('ort.webgpu'))) {
            return callback(null, `commonjs ${request}`)
          }
          callback()
        },
      ]
    }

    // Handle .wasm files as assets
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    })

    // Handle .mjs ESM files from onnxruntime
    config.module.rules.push({
      test: /\.m?js$/,
      include: /node_modules\/(onnxruntime-web|@huggingface)/,
      type: 'javascript/auto',
      resolve: { fullySpecified: false },
    })

    return config
  },

  // ── Headers ────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',         value: 'DENY' },
          { key: 'X-Content-Type-Options',   value: 'nosniff' },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // COOP/COEP required for SharedArrayBuffer (WASM threads)
      {
        source: '/tools/background-remover',
        headers: [
          { key: 'Cross-Origin-Opener-Policy',  value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control',          value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
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
