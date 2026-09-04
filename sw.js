const CACHE='pellbella-v47';
const ASSETS=[
  '/pellbella/pellbella_v47.html',
  '/pellbella/manifest.json',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap'
];

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS.filter(u=>!u.startsWith('http'))))
  );
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  // Solo cachear recursos propios, no la API de Anthropic ni Google
  if(e.request.url.includes('api.anthropic.com')||
     e.request.url.includes('googleapis.com')||
     e.request.url.includes('accounts.google.com')){
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached=>{
      if(cached)return cached;
      return fetch(e.request).then(resp=>{
        if(resp&&resp.status===200&&resp.type==='basic'){
          const clone=resp.clone();
          caches.open(CACHE).then(c=>c.put(e.request,clone));
        }
        return resp;
      }).catch(()=>caches.match('/pellbella/pellbella_v47.html'));
    })
  );
});
