/* Game Time service worker — makes the arcade + every game playable offline
 * once the site has been visited online at least once (e.g. after "Add to Home
 * Screen"). Strategy is NETWORK-FIRST so online users always get the freshest
 * deploy (preserving the in-game 🔄 refresh behaviour); when the network is
 * unavailable we fall back to the cached copy.
 *
 * To ship an update, bump CACHE_VERSION — the new worker precaches the fresh
 * files on install and deletes older caches on activate.
 */
'use strict';

var CACHE_VERSION = 'gametime-v8';

// Everything the site is made of. All games are self-contained single HTML
// files, so this list is just the pages plus the shared home-screen icons.
var ASSETS = [
  '/',
  '/index.html',
  '/apple-touch-icon.png',
  '/icon-512.png',
  '/animal-band/index.html',
  '/asteroids/index.html',
  '/bubble-pop/index.html',
  '/build-a-buddy/index.html',
  '/catch-the-splash/index.html',
  '/caterpillar-hop/index.html',
  '/crystal-hunt/index.html',
  '/doodle/index.html',
  '/fruit-splash/index.html',
  '/high-five-foxes/index.html',
  '/jumping-adventure/index.html',
  '/lane-runner/index.html',
  '/ocean-memory-match/index.html',
  '/octopus-maze/index.html',
  '/peekaboo-meadow/index.html',
  '/pigeon-patrol/index.html',
  '/shape-sort/index.html',
  '/simon-says/index.html',
  '/soccer/index.html',
  '/soccer-stars/index.html',
  '/surprise-eggs/index.html'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      // addAll is atomic; if one asset 404s the whole install fails, so add
      // them individually and ignore any single miss.
      return Promise.all(ASSETS.map(function (url) {
        return cache.add(url).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE_VERSION) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  // Only handle same-origin requests; let anything else pass through.
  if (new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    fetch(req).then(function (resp) {
      // Cache a fresh copy for offline use next time.
      if (resp && resp.status === 200 && resp.type === 'basic') {
        var copy = resp.clone();
        caches.open(CACHE_VERSION).then(function (cache) { cache.put(req, copy); });
      }
      return resp;
    }).catch(function () {
      // Offline: serve the cached page, falling back to the arcade home page
      // for navigations we've never cached.
      return caches.match(req).then(function (hit) {
        if (hit) return hit;
        if (req.mode === 'navigate') return caches.match('/index.html');
        return Response.error();
      });
    })
  );
});
