// Keeps the home-screen app quick. Pages are fetched fresh whenever there is
// signal, so updates still show straight away; everything else is served from
// the phone and refreshed in the background.
var CACHE = '49-v1';

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // Pages: network first, cached copy if offline.
  if (req.mode === 'navigate') {
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

  // Own files (support.js, art, logos, photos) and fonts: serve the cached copy
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
