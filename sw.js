// Service worker v2 — limpia todo y se elimina
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k))))
    .then(()=>self.registration.unregister())
  );
  self.clients.claim();
});
