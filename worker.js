// Only runs for "/" (see run_worker_first in wrangler.jsonc). On the
// kingspark.vitalogy.au subdomain the root shows kingspark.html; everywhere else the
// normal static site is served untouched.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname.startsWith('kingspark.') && url.pathname === '/') {
      return env.ASSETS.fetch(new Request(new URL('/kingspark', url), request));
    }
    return env.ASSETS.fetch(request);
  }
};
