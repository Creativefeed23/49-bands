// Keeps the home-screen app quick. Pages and scripts are fetched fresh whenever
// there is signal, so updates show straight away; images are served from the
// phone and refreshed in the background.
var CACHE = '49-v2';

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // Pages and our own scripts: network first, cached copy if offline, so
  // code changes show on the next load.
  var ownScript = url.origin === location.origin && /\.(js|webmanifest)$/.test(url.pathname);
  if (req.mode === 'navigate' || ownScript) {
    e.respondWith(fetch(req).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(req, copy); });
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true });
    }));
    return;
  }

  // React from unpkg is pinned to a version, so it never changes.
  if (url.hostname === 'unpkg.com') {
    e.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
        return res;
      });
    }));
    return;
  }

  // Own images (art, logos, photos) and fonts: serve the cached copy
  // now, fetch a fresh one for next time.
  if (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.open(CACHE).then(function (c) {
      return c.match(req).then(function (hit) {
        var fresh = fetch(req).then(function (res) {
          if (res.ok) c.put(req, res.clone());
          return res;
        });
        if (hit) { e.waitUntil(fresh.catch(function () {})); return hit; }
        return fresh;
      });
    }));
  }
});
