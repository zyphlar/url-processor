# Static resources and short links (ge0) decoder for CoMaps

Root domain redirects to https://comaps.app/.

URLs like `http(s)://comaps.app/ENCODEDCOORDINATES/PINNAME` are decoded to lat, lon and zoom level. Then the OSM
map is displayed and url schemes are opened on mobile apps.

Add some query parameters to test:

- For prod environment:
  - [https](https://comaps.app/B4srhdHVVt/Some+Name)
  - [https ru](https://comaps.app/AwAAAAAAAA/%d0%9c%d0%b8%d0%bd%d1%81%d0%ba_%d1%83%d0%bb._%d0%9b%d0%b5%d0%bd%d0%b8%d0%bd%d0%b0_9)

## Requirements

Install CloudFlare's wrangler and other dev dependencies using npm:

```bash
npm i
```

## Development

Use `npx wrangler dev` for localhost development.

## Deployment

Deploy to prod manually using `npx wrangler publish --env comaps` or this
[action](https://codeberg.org/comaps/url-processor/actions/workflows/deploy-master-to-prod.yml).
