# Blog posts

Each post is one Markdown file in this folder. Push it to `main` and the
GitHub Action (`.github/workflows/deploy.yml`) builds and publishes the site
within a few minutes. Nothing else needs to change: the blog overview, the
RSS feeds, the sitemap and the menu link are all generated.

If anything in a post is wrong, the build stops with a message naming the
file and the problem, and the live site stays as it was. To check a post
before pushing, run `node tools/build.mjs` (Node 22, no install needed).

## File

- Path: `content/blog/<slug>.md`
- `<slug>` becomes the URL: `https://visioninspect.de/blog/<slug>/` for English,
  `https://visioninspect.de/de/blog/<slug>/` for German.
- Lowercase letters, digits and hyphens only, e.g. `bent-led-ir-sensor-board.md`.
  Use the main search phrase of the article. German slugs replace umlauts:
  `leiterplatte-fehlende-bohrung.md` (ae, oe, ue, ss are fine too).
- Never rename or delete a published post: its URL would break. To correct
  one, edit it and set `updated`.

## Images

- Put them in `img/blog/<slug>/` (WebP preferred, PNG or JPG fine), max. 1600 px
  wide, ideally under 300 KB each.
- Refer to them with the site path: `/img/blog/<slug>/heatmap.webp`.
  Existing site images (`/img/showcase/...`, `/img/screenshots/...`) may be reused.
- The cover (`image`) is also the preview picture on LinkedIn and in search,
  so a landscape image (about 1.9:1 or 16:10) works best.
- Only use images you may publish: your own captures, or datasets whose licence
  allows commercial use (e.g. VisA, CC BY 4.0), with the source named in the text.

## Front matter

The file starts with these fields between two `---` lines:

```markdown
---
title: "Bent LED on an IR sensor board, caught at the first try"
description: "How anomaly detection flagged a bent LED on an IR sensor board: the setup, the score against the limit, and what the heat map shows."
date: 2026-11-10
lang: en
translationKey: bent-led-ir-sensor
image: /img/blog/bent-led-ir-sensor-board/heatmap.webp
imageAlt: "Heat map of an IR sensor board with the bent LED outlined"
tags: [pcb inspection, anomaly detection]
related: pcb
---
```

| Field | Required | Rules |
|---|---|---|
| `title` | yes | At most 70 characters. Contains the main search phrase. Not in the body again. |
| `description` | yes | 70–170 characters. Shown by Google under the title and in link previews. |
| `date` | yes | `YYYY-MM-DD`. A future date schedules the post: it goes live on that day (the site rebuilds daily at 05:15 UTC). |
| `lang` | yes | `en` or `de`. |
| `image` | yes | Cover image, site path (see Images). |
| `imageAlt` | yes | What the cover shows, one sentence. |
| `translationKey` | no | Same value in an English and a German post links them as translations (language switch and hreflang). Lowercase with hyphens. |
| `tags` | no | List: `[pcb inspection, anomaly detection]`. 1–4 short topics. |
| `related` | no | Links the post to a solution page: `pcb`, `assembly` or `anomaly`. |
| `updated` | no | `YYYY-MM-DD`, when a published post was changed. |
| `author` | no | A person's name. Without it, VisionInspect is the author. |
| `draft` | no | `true` keeps the post off the site. Note: the repository is public, so drafts are visible on GitHub. |

Strings with a colon, `#` or quotes should be in double quotes.

## Body (Markdown)

At least 150 words. Supported:

- `## Heading` and `### Subheading` (no `#`: the title is the page's only H1)
- Paragraphs, `**bold**`, `*italic*`, `` `code` ``
- Links: `[text](https://...)`, `[text](/pcb-inspection/)`. Link to the solution
  pages where it fits: `/pcb-inspection/`, `/assembly-monitoring/`,
  `/visual-inspection-without-defect-images/` (German: `/de/leiterplatten-pruefung/`,
  `/de/montageueberwachung/`, `/de/sichtpruefung-ohne-fehlerbilder/`).
- Images on their own line: `![alt text](/img/blog/<slug>/x.webp "Optional caption")`
- Lists with `-` or `1.`, quotes with `>`, tables with `| a | b |`, code with three backticks, `---` for a line.

HTML in the body is shown as text, not run.

## Feeds

- English: `https://visioninspect.de/blog/feed.xml`
- German: `https://visioninspect.de/de/blog/feed.xml`

Each item has the title, link, description, tags and cover image, which is
enough for an automation to post new articles to LinkedIn.
