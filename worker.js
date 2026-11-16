// Only runs for "/" (see run_worker_first in wrangler.jsonc). On the
// ursh.vitalogy.au subdomain the root shows ursh.html; everywhere else the
// normal static site is served untouched.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname.startsWith('ursh.') && url.pathname === '/') {
      return env.ASSETS.fetch(new Request(new URL('/ursh', url), request));
    }
    return env.ASSETS.fetch(request);
  }
};
