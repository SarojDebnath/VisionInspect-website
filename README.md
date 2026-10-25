# VisionInspect website

Static marketing page for VisionInspect, in English and German. It is plain HTML, CSS and vanilla JavaScript, with no build step, no framework and no external requests (no CDNs, fonts, analytics or cookies).

Live at **https://visioninspect.de** (GitHub Pages).

## Run locally

Any static file server works. From this folder:

```bash
python -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly from disk also works in most browsers.

## Where to change things

| What | Where |
|---|---|
| Product name, contact email, company, address | `js/config.js` (`SITE_CONFIG`) |
| All page text (EN + DE) | `js/i18n.js`. Keep the same keys in both dictionaries. `{product}` and `{email}` are filled in from the config. |
| Screenshots | Put files in `img/screenshots/` and set the paths in `SITE_CONFIG.screenshots` in `js/config.js`. `null` shows a labelled placeholder. |
| "What it flags" carousel | `SITE_CONFIG.showcase` in `js/config.js`. Each slide has a `photo` and a `heatmap` image (same size, ideally 16:10). Set `example: false` to hide the "Example image" badge. Video slides are supported: `{ key, video, poster }`. |
| Colors, spacing | Tokens at the top of `css/styles.css` (`--accent` is the single blue) |
| Imprint / privacy policy | `imprint.html`, `privacy.html`. **TODO: the legal text is still missing.** |
| Domain | `CNAME` (used by GitHub Pages) and the canonical link in `index.html` |

The images in `img/showcase/` are drawn placeholder illustrations, not real inspection results. Replace them with real captures as soon as you have them.

The product name in `index.html` (`<title>`, meta description) is also set at runtime from the config. The static values in the file are only fallbacks for crawlers, so update them too when the name changes.

### Language

The page opens in German if the visitor's browser prefers German, otherwise in English. The EN/DE switch changes the language without reloading and saves the choice in `localStorage`. A saved choice always wins over the browser setting.

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
index.html          single landing page
imprint.html        TODO: Impressum
privacy.html        TODO: Datenschutzerklärung
css/styles.css
js/config.js        name, email, screenshots, showcase images
js/i18n.js          EN + DE text
js/main.js          language switch, carousel, mailto form, mobile nav
img/                favicon, showcase images
CNAME               custom domain for GitHub Pages
```
