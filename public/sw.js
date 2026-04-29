/**
 * Toolify Service Worker
 * Strategy: Cache First for static assets, Network First for pages
 */

const CACHE_NAME = 'toolify-v2'
const STATIC_CACHE = 'toolify-static-v2'
const PAGES_CACHE  = 'toolify-pages-v2'

// Assets to cache immediately on install
const PRECACHE_URLS = [
  '/',
  '/tools',
  '/tools/word-counter',
  '/tools/bmi-calculator',
  '/tools/pdf-merge',
  '/tools/unit-converter',
  '/offline',
]

// Install — precache critical pages
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch(() => {})
    ).then(() => self.skipWaiting())
  )
})

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== PAGES_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET & cross-origin
  if (request.method !== 'GET' || url.origin !== location.origin) return

  // Static assets — Cache First
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname === '/manifest.json'
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) => cached || fetch(request).then((res) => {
          const clone = res.clone()
          caches.open(STATIC_CACHE).then((c) => c.put(request, clone))
          return res
        })
      )
    )
    return
  }

  // HTML pages — Network First, fallback to cache
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone()
          caches.open(PAGES_CACHE).then((c) => c.put(request, clone))
          return res
        })
        .catch(() =>
          caches.match(request).then(
            (cached) => cached || caches.match('/offline') || new Response(
              '<h1>You are offline</h1><p>Please check your internet connection.</p>',
              { headers: { 'Content-Type': 'text/html' } }
            )
          )
        )
    )
    return
  }

  // Everything else — Network First
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  )
})

// Background sync placeholder
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag)
})
