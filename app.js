// Owner-only page switcher. Visiting any page with ?me turns it on for this
// browser (or installed app); ?me=off turns it off. Guests never see it.
(function () {
  // Paint black straight away so there's no white flash before the page renders.
  document.documentElement.style.background = '#050505';

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

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(function () {});

  var pages = [['/', 'Grid'], ['/list.html', 'List'], ['/watch.html', 'Watchlist']];
  // Cloudflare serves /list.html as /list, so compare without the extension.
  var norm = function (p) { return p.replace(/(index)?\.html$/, ''); };
  var here = norm(location.pathname);

  // The installed app runs edge to edge, so leave room above the iPhone's
  // home-swipe area or taps get eaten by the system gesture.
  var app = navigator.standalone || matchMedia('(display-mode: standalone)').matches;
  var foot = app ? 'max(30px, env(safe-area-inset-bottom))' : 'env(safe-area-inset-bottom)';

  function build() {
    var nav = document.createElement('nav');
    nav.setAttribute('style', 'position:fixed; left:0; right:0; bottom:0; z-index:9999; display:flex; justify-content:center; gap:6px; padding:10px 10px calc(10px + ' + foot + '); background:rgba(5,5,5,.94); border-top:1px solid #221F1B; font-family:Oswald,sans-serif');
    pages.forEach(function (p) {
      var on = here === norm(p[0]);
      var a = document.createElement('a');
      a.href = p[0];
      a.textContent = p[1];
      a.setAttribute('style', 'flex:1; max-width:180px; text-align:center; padding:17px 6px; font-size:13px; letter-spacing:.24em; text-transform:uppercase; ' + (on ? 'background:#C9962C; color:#0A0A0A' : 'background:#0C0B0A; color:#8A8377'));
      nav.appendChild(a);
    });
    document.body.appendChild(nav);
    document.body.style.paddingBottom = nav.offsetHeight + 'px';
  }
  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
