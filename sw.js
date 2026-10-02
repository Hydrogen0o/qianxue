/* 潜学离线缓存。页面本身优先走网络（保证拿到最新版），数据和图片包按版本号缓存，载过一次后没网也能用。 */
const VER = '8ffe01cd5b', C = 'qianxue-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
async function put(req, res) {
  if (!res || !(res.ok || res.type === 'opaque')) return;
  const c = await caches.open(C), u = new URL(req.url);
  if (u.search) { for (const k of await c.keys()) { const ku = new URL(k.url); if (ku.origin === u.origin && ku.pathname === u.pathname && ku.search !== u.search) await c.delete(k); } }
  await c.put(req, res);
}
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const u = new URL(req.url), same = u.origin === location.origin;
  const pack = same && /\/(d|t|f)\//.test(u.pathname);
  if (pack || /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname) || (same && /\.(png|webmanifest)$/.test(u.pathname))) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { put(req, res.clone()); return res; })));
  } else if (same) {
    e.respondWith(fetch(req).then(async res => {
      if (res.redirected) res = new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers: res.headers });
      put(req, res.clone()); return res;
    }).catch(() => caches.match(req).then(hit => hit || caches.match('./')).then(hit => hit || new Response('离线，且还没有缓存。请联网后再打开一次。', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }))));
  }
});
