import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler';
import { onGe0Decode } from './ge0';

const NOT_FOUND_REDIRECT_URL = 'https://comaps.app';
const GE0_TEMPLATE_PATH = '/ge0.html';
const APPSTORE = 'fixme';//TODO: Update'https://apps.apple.com/app/organic-maps/id1567437057';
const GOOGLE = 'https://play.google.com/store/apps/details?id=app.comaps.google';
const HUAWEI = 'fixme';//TODO: Update'https://appgallery.huawei.com/#/app/C104325611';
const FDROID = 'https://f-droid.org/en/packages/app.comaps.fdroid/';
const COMAPS_REWRITE_RULES: Record<string, string> = {
  '/api': '/test.html',
  '/apple-touch-icon.png': '/icons/apple-touch-icon.png',
  '/apple-touch-icon-precomposed.png': '/icons/apple-touch-icon.png',
  '/apple-app-site-association': '/apple-app-site-association.json',
  // Hidden files and symlinks are not uploaded by wrangler.
  // See https://developers.cloudflare.com/workers/cli-wrangler/configuration#default-ignored-entries
  '/.well-known/apple-app-site-association': '/apple-app-site-association.json',
  '/.well-known/assetlinks.json': '/assetlinks.json',
  '/': 'https://comaps.app/download',
  '/app': 'https://comaps.app/download',
  '/get': 'https://comaps.app/download',
  '/im_get': 'https://comaps.app/download',
  '/install': 'https://comaps.app/download',
  '/f': FDROID,
  '/fd': FDROID,
  '/fdroid': FDROID,
  '/g': GOOGLE,
  '/gp': GOOGLE,
  '/google': GOOGLE,
  '/googleplay': GOOGLE,
  '/h': HUAWEI,
  '/hw': HUAWEI,
  '/huawei': HUAWEI,
  '/i': APPSTORE,
  '/ios': APPSTORE,
  '/iphone': APPSTORE,
  '/ipad': APPSTORE,
  '/ipod': APPSTORE,
  '/matrix': 'https://matrix.to/#/%23comaps:matrix.org',
  '/news': 'https://comaps.app/news',
  '/test': '/test.html',
  '/test/': '/test.html',
};

addEventListener('fetch', (event) => {
  try {
    event.respondWith(handleFetchEvent(event));
  } catch (e: any) {
    if (DEBUG) {
      event.respondWith(new Response(e.message || e.toString(), { status: 500 }));
    } else {
      // In case of unexpected errors, always redirect to the default url.
      event.respondWith(Response.redirect(NOT_FOUND_REDIRECT_URL, 302));
    }
  }
});

async function handleFetchEvent(event: FetchEvent) {
  const { hostname, pathname } = new URL(event.request.url);

  // First, process all known redirects.
  if ((DEBUG || hostname === 'comaps.app') && pathname in COMAPS_REWRITE_RULES) {
    if (COMAPS_REWRITE_RULES[pathname].startsWith('http')) return Response.redirect(COMAPS_REWRITE_RULES[pathname], 302);
  }

  // See https://github.com/cloudflare/kv-asset-handler#optional-arguments
  const getAssetOptions = {
    cacheControl: { bypassCache: DEBUG },
    mapRequestToAsset: (request: Request) => {
      if ((DEBUG || hostname === 'comaps.app') && pathname in COMAPS_REWRITE_RULES) {
        const url = new URL(request.url);
        url.pathname = COMAPS_REWRITE_RULES[pathname];
        request = new Request(url.toString(), request);
      }
      return mapRequestToAsset(request);
    },
  };

  // Try to return a static resource first.
  try {
    return await getAssetFromKV(event, getAssetOptions);
  } catch (_) {}
  // No static resource were found, try to handle a specific dynamic request.
  getAssetOptions.mapRequestToAsset = (request: Request) => {
    const url = new URL(request.url);
    url.pathname = GE0_TEMPLATE_PATH;
    return mapRequestToAsset(new Request(url.toString(), request));
  };
  const resp = await getAssetFromKV(event, getAssetOptions);
  const ge0HtmlTemplate = await resp.text();
  try {
    // await to catch exceptions.
    const htmlResponse = await onGe0Decode(ge0HtmlTemplate, event.request.url);
    return htmlResponse;
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }
}
