# Personal Business — personalbusiness.net

Static site. No build step, no dependencies. Open `index.html` or serve the folder.

## Files

```
index.html            Latest — intro line + newest 10 pieces
conversations.html    Every piece, filterable by format
about.html
search.html           In-browser search over posts.json
<slug>/index.html     One folder per piece → clean URL /<slug>/
posts.json            Single source of truth: metadata + text for lists and search
style.css             Design system (tokens in :root)
site.js               Lists, filters, search, scroll reveal, progress line
```

## Adding an article

Every piece is an article. Its flagship is one of three mediums: `written`, `audio`, `video`.

1. Add an entry to `posts.json`: `date`, `medium`, `minutes`, `title`, `deck`, `url`, `text` (the body or transcript — it drives search).
2. Copy `what-else-could-be-true/` to `<slug>/`, edit, keep `data-root="../"` and the `../` paths.
3. For audio or video, drop the file in `media/` and uncomment the matching `<figure class="media">` block in the template. The body below it is the transcript or notes.
4. The share line (LinkedIn · Facebook · Email) at the end fills its URLs automatically.
5. Update the `<title>`, description, canonical, Open Graph tags and the JSON-LD `Article` block in the new page's `<head>`, and add the URL to `sitemap.xml`.

`minutes` renders as `4 min read`, `32 min listen` or `18 min watch` from the medium.

## Deploy

GitHub Pages from `main`, root. `CNAME` is in place; point DNS at GitHub.

## Search / findability

- Every page has a canonical URL, Open Graph tags and JSON-LD. About carries a `Person` schema whose `sameAs` lists LinkedIn and Birdhouse; article pages carry `Article` with Eric as author.
- `robots.txt` and `sitemap.xml` at the root. Submit the sitemap in Google Search Console after the first deploy.
- Put `https://personalbusiness.net` in the LinkedIn profile's website field and link it from the Birdhouse site. The `rel="me"` links here point back, which is what ties the identity together.

## Later (not built)

`/library`, `/people/<name>`, `/timeline`, `/birdhouse`. Clean URLs for `conversations`, `about`, `search` (currently `.html`). Move search to Pagefind or a platform once the archive outgrows `posts.json`. Host large audio/video elsewhere (R2, Bunny, YouTube unlisted) once `media/` gets heavy — GitHub Pages has a 1 GB soft limit.
