// ============================================================
//  ARQ_COMP — Service Worker
//  Estratégia: Cache First para assets estáticos,
//              Network First para data.json
// ============================================================

const CACHE_NAME = 'arq-comp-v1.0.0';
const DATA_CACHE = 'arq-comp-data-v1.0.0';

// Assets que serão cacheados no install
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './index.js',
  './data.json',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;600;700&display=swap'
];

// ============================================================
//  INSTALL — precache todos os assets
// ============================================================
self.addEventListener('install', event => {
  console.log('[SW] Installing ARQ_COMP Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precaching static assets');
        // Cache assets one by one to avoid total failure on one miss
        return Promise.allSettled(
          STATIC_ASSETS.map(url =>
            cache.add(url).catch(err => console.warn('[SW] Failed to cache:', url, err))
          )
        );
      })
      .then(() => {
        console.log('[SW] Install complete — skipping waiting');
        return self.skipWaiting();
      })
  );
});

// ============================================================
//  ACTIVATE — remove old caches
// ============================================================
self.addEventListener('activate', event => {
  console.log('[SW] Activating new Service Worker...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== DATA_CACHE)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// ============================================================
//  FETCH — estratégia de cache
// ============================================================
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignora chrome-extension e outros esquemas
  if (!event.request.url.startsWith('http')) return;

  // data.json: Network First (sempre tenta atualizar)
  if (url.pathname.endsWith('data.json')) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }

  // Google Fonts: Cache First (raramente mudam)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirstStrategy(event.request, CACHE_NAME));
    return;
  }

  // Todos os outros assets: Cache First
  event.respondWith(cacheFirstStrategy(event.request, CACHE_NAME));
});

// ============================================================
//  ESTRATÉGIA: Cache First
//  1. Tenta o cache
//  2. Se não encontrar, busca na rede e guarda no cache
// ============================================================
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    console.warn('[SW] Cache first: network failed for', request.url);
    return new Response('Offline — recurso não disponível', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// ============================================================
//  ESTRATÉGIA: Network First
//  1. Tenta a rede
//  2. Em caso de falha, usa o cache
// ============================================================
async function networkFirstStrategy(request) {
  const cache = await caches.open(DATA_CACHE);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    console.warn('[SW] Network first: offline, using cache for', request.url);
    const cached = await cache.match(request);
    if (cached) return cached;

    return new Response('{}', {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ============================================================
//  BACKGROUND SYNC — notifica clientes de update disponível
// ============================================================
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
