# VisionInspect website

Static marketing page for VisionInspect, in English and German. It is plain HTML, CSS and vanilla JavaScript, with no build step, no framework and no external requests (no CDNs, fonts, analytics or cookies).

Live at **https://visioninspect.de** (GitHub Pages).

## Run locally

Any static file server works. From this folder:

```bash
python -m http.server 4173 --bind 127.0.0.1
# open http://localhost:4173
```

Opening `index.html` directly from disk also works in most browsers.

## After changing text or config: rebuild the pages

The page text lives in `js/i18n.js`, but it is also written into the HTML so that search engines, link previews and AI crawlers see real content without running JavaScript. Each language gets its own URL (Google recommends this over switching by browser setting):

| URL | File |
|---|---|
| https://visioninspect.de/ (English, default) | `index.html` |
| https://visioninspect.de/de/ (German) | `de/index.html` |
| Solution pages, e.g. https://visioninspect.de/pcb-inspection/ and https://visioninspect.de/de/leiterplatten-pruefung/ | `<url>/index.html`, written from `tools/pages.mjs` |

After editing `js/i18n.js`, `js/config.js` or `index.html`, run (Node.js 18 or newer, no packages needed):

```bash
node tools/build.mjs
```

It updates `index.html` in place, regenerates `de/index.html` and `sitemap.xml`, and prints the title and description lengths (aim for about 60 and 155 characters). Edit `index.html`, never `de/index.html`. If you forget to run it, visitors still see the right text (JavaScript fills it in), but search engines see the old text.

What it writes into each page's `<head>`, between `<!-- seo:start -->` and `<!-- seo:end -->`: title, meta description, canonical URL, hreflang links for both languages, Open Graph / Twitter card tags (with `img/og-image.png`), and schema.org structured data (Organization, WebSite, SoftwareApplication, FAQPage built from the FAQ text).

## Where to change things

| What | Where |
|---|---|
| Product name, contact email, company, address, site URL, LinkedIn page | `js/config.js` (`SITE_CONFIG`) |
| Logo | `img/logo.svg` (also used as `img/favicon.svg` and, inline, as the `i-logo` symbol in `index.html`). Brand colours: navy `#0b2545`, teal `#0f766e`. |
| Solution pages (PCB inspection, assembly monitoring, inspection without defect images): text, titles, FAQs | `tools/pages.mjs`; URLs in `SITE_CONFIG.pages` in `js/config.js`. Then run `node tools/build.mjs`. Only write what the product really does. |
| All page text (EN + DE), including the search title and description (`meta.title`, `meta.description`) | `js/i18n.js`. Keep the same keys in both dictionaries. `{product}` and `{email}` are filled in from the config. Then run `node tools/build.mjs`. |
| Link preview image, logo for search engines | `img/og-image.png` (1200×630), `img/logo-512.png` |
| Screenshots | Put files in `img/screenshots/` and set the paths in `SITE_CONFIG.screenshots` in `js/config.js` (one per step of each module; the screenshot changes when a step is clicked). `null` shows a labelled placeholder. |
| "What it flags" carousel (in the hero) | `SITE_CONFIG.showcase` in `js/config.js`. Each slide has a `photo` and a `heatmap` image (same size, ideally 16:10). Set `example: false` to hide the "Example image" badge. Video slides are supported: `{ key, video, poster }`. |
| Colors, spacing | Tokens at the top of `css/styles.css` (`--accent` is the single accent colour, the teal from the logo) |
| Imprint / privacy policy | `imprint.html`, `privacy.html`. **TODO: have both pages reviewed by a lawyer.** |
| Domain | `CNAME` (used by GitHub Pages) and the canonical link in `index.html` |

The images in `img/showcase/` are drawn placeholder illustrations, not real inspection results. Replace them with real captures as soon as you have them.


### Language

`/de/` always opens in German. `/` opens in English, or in German if the visitor saved that choice or their browser prefers German. The EN/DE switch changes the language without reloading, saves the choice in `localStorage` and changes the address to `/` or `/de/`, so a copied link opens in the same language.

## Deploy

### GitHub Pages (current setup)

1. Push to the `main` branch of the GitHub repository.
2. In the repository, open **Settings → Pages**. Under **Source**, choose *Deploy from a branch*, then `main` and `/ (root)`.
3. **Custom domain:** `visioninspect.de` (already in the `CNAME` file).
4. At your domain registrar, set these DNS records for `visioninspect.de`:

   | Type | Host | Value |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | AAAA | @ | 2606:50c0:8000::153 |
   | AAAA | @ | 2606:50c0:8001::153 |
   | AAAA | @ | 2606:50c0:8002::153 |
   | AAAA | @ | 2606:50c0:8003::153 |
   | CNAME | www | `<github-username>.github.io` |

   Remove any old A, AAAA or CNAME records for `@` and `www` (for example the registrar's parking page).
5. Once DNS has propagated (minutes to a few hours), go back to **Settings → Pages** and enable **Enforce HTTPS**.
6. Recommended: verify the domain under **GitHub → Settings → Pages → Verified domains**, so no one else can claim it for their Pages site.

### Search engines

1. Add the site to [Google Search Console](https://search.google.com/search-console) (domain property `visioninspect.de`, verified with a TXT record at Namecheap) and submit `https://visioninspect.de/sitemap.xml`.
2. Do the same in [Bing Webmaster Tools](https://www.bing.com/webmasters) (it can import from Search Console). Bing also feeds other search engines and AI assistants.
3. Check the structured data with Google's [Rich Results Test](https://search.google.com/test/rich-results).

### Netlify / any static host

Upload the folder as is. There is no build command, and the publish directory is the repository root.

### Nginx

```nginx
server {
    server_name visioninspect.de www.visioninspect.de;
    root /var/www/visioninspect;
    index index.html;
}
```

## Files

```
index.html          landing page, English (template for all languages)
de/index.html       German page, generated by tools/build.mjs
tools/build.mjs     writes text, SEO tags and sitemap into the pages
sitemap.xml         generated
imprint.html        TODO: Impressum
privacy.html        TODO: Datenschutzerklärung
css/styles.css
js/config.js        name, email, screenshots, showcase images
js/i18n.js          EN + DE text
js/main.js          language switch, carousel, mailto form, mobile nav
img/                favicon, logo, link preview image, showcase images
CNAME               custom domain for GitHub Pages
```
