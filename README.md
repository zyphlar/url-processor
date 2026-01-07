# Static resources and short links (ge0) decoder for CoMaps

The root domain redirects to https://comaps.app/.

URLs like `http(s)://comaps.at/ENCODEDCOORDINATES/PINNAME` are decoded to lat, lon and zoom level. Then the OSM
map is displayed and url schemes are opened on mobile apps.

For example:
https://comaps.at/B4srhdHVVt/Some+Name

## Requirements

Install CloudFlare's wrangler and other dev dependencies using npm:

```bash
npm i
```

## Development

Use `npx wrangler dev` for localhost development.

## Deployment

Currently, any commit to Codeberg is mirrored to github.com/zyphlar/url-processor and picked up via a Cloudflare-Github integration hook.

### Deprecated, consider reactivating

Deploy to prod manually using `npx wrangler publish --env comaps` or this
[action](https://codeberg.org/comaps/url-processor/actions/workflows/deploy-master-to-prod.yml).

## LICENSE

See the LICENSE file.