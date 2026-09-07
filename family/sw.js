const CACHE_NAME = 'sonaelog-fam-v1';
const STATIC_URLS = ['./manifest.json', './icon.svg', './firebase-config.js'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Firebase など外部ホストへの通信は素通し（キャッシュしない）
  if (url.origin !== self.location.origin) return;

  // index.html はネットワーク優先（オフライン時のみキャッシュ）
  if (url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 同一オリジンの静的ファイルはキャッシュ優先
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
