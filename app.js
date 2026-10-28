// Owner-only page switcher. Visiting any page with ?me turns it on for this
// browser (or installed app); ?me=off turns it off. Guests never see it.
(function () {
  var KEY = '49me';
  var q = new URLSearchParams(location.search).get('me');
  try {
    if (q === 'off') localStorage.removeItem(KEY);
    else if (q !== null) localStorage.setItem(KEY, '1');
    if (localStorage.getItem(KEY) !== '1') return;
  } catch (e) {
    if (q === null || q === 'off') return;
  }

  // Only the owner gets the install manifest, so the installed app always
  // launches with ?me and keeps the switcher.
  var m = document.createElement('link');
  m.rel = 'manifest';
  m.href = '/app.webmanifest';
  document.head.appendChild(m);

  var pages = [['/', 'Grid'], ['/list.html', 'List'], ['/watch.html', 'Watchlist']];
  // Cloudflare serves /list.html as /list, so compare without the extension.
  var norm = function (p) { return p.replace(/(index)?\.html$/, ''); };
  var here = norm(location.pathname);

  function build() {
    var nav = document.createElement('nav');
    nav.setAttribute('style', 'position:fixed; left:0; right:0; bottom:0; z-index:9999; display:flex; justify-content:center; gap:3px; padding:8px 8px calc(8px + env(safe-area-inset-bottom)); background:rgba(5,5,5,.94); border-top:1px solid #221F1B; font-family:Oswald,sans-serif');
    pages.forEach(function (p) {
      var on = here === norm(p[0]);
      var a = document.createElement('a');
      a.href = p[0];
      a.textContent = p[1];
      a.setAttribute('style', 'flex:1; max-width:160px; text-align:center; padding:10px 6px; font-size:12px; letter-spacing:.24em; text-transform:uppercase; ' + (on ? 'background:#C9962C; color:#0A0A0A' : 'background:#0C0B0A; color:#8A8377'));
      nav.appendChild(a);
    });
    document.body.appendChild(nav);
  }
  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
