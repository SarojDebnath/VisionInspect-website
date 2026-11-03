/*
 * Blog posts: reads content/blog/*.md, checks them and turns the Markdown
 * into HTML. Used by tools/build.mjs. The file format is described in
 * content/blog/README.md. No dependencies.
 *
 * Any problem in a post stops the build with a message naming the file and
 * the field, so a broken post never goes live.
 */
import fs from "node:fs";
import path from "node:path";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const LANGS = ["en", "de"];

const escText = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => escText(s).replace(/"/g, "&quot;");

// ---------- front matter (a small YAML subset) ----------
// key: value, "quoted", 'quoted', [a, b, "c"], true/false. One key per line.
function parseValue(raw) {
  const v = raw.trim();
  if (v === "") return "";
  if (v === "true") return true;
  if (v === "false") return false;
  if (v.startsWith("[") && v.endsWith("]")) {
    const inner = v.slice(1, -1).trim();
    if (!inner) return [];
    const items = inner.match(/"(?:[^"\\]|\\.)*"|'[^']*'|[^,]+/g) || [];
    return items.map((s) => parseValue(s)).map(String).filter((s) => s !== "");
  }
  if (v.startsWith('"') && v.endsWith('"')) return JSON.parse(v);
  if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1).replace(/''/g, "'");
  return v.replace(/\s+#.*$/, "");
}

function splitFrontMatter(text, file) {
  const m = text.replace(/^﻿/, "").match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: must start with front matter between two "---" lines`);
  const data = {};
  m[1].split(/\r?\n/).forEach((line, i) => {
    if (!line.trim() || line.trim().startsWith("#")) return;
    const kv = line.match(/^([A-Za-z][A-Za-z0-9_]*)\s*:(.*)$/);
    if (!kv) throw new Error(`${file}: front matter line ${i + 2} is not "key: value": ${line}`);
    data[kv[1]] = parseValue(kv[2]);
  });
  return { data, body: m[2] };
}

// ---------- image size (PNG, JPEG, WebP, GIF) for width/height attributes ----------
export function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b.length > 24 && b.toString("ascii", 1, 4) === "PNG") return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b.toString("ascii", 0, 3) === "GIF") return { w: b.readUInt16LE(6), h: b.readUInt16LE(8) };
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const kind = b.toString("ascii", 12, 16);
    if (kind === "VP8 ") return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (kind === "VP8L") {
      const n = b.readUInt32LE(21);
      return { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 };
    }
    if (kind === "VP8X") return { w: b.readUIntLE(24, 3) + 1, h: b.readUIntLE(27, 3) + 1 };
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
  }
  throw new Error(`${file}: unsupported image type (use .webp, .png, .jpg or .gif)`);
}

// ---------- Markdown (subset) ----------
// Headings ## and ###, paragraphs, **bold**, *italic* (not _italic_), `code`, [links](url),
// images ![alt](/img/blog/... "caption"), - and 1. lists, > quotes, ``` code,
// | tables |, ---. Raw HTML is shown as text, never run.
function inline(s, ctx) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (m, c) => `\u0000${codes.push(c) - 1}\u0000`);
  s = escText(s);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, href) => {
    const h = href.replace(/&amp;/g, "&");
    if (!/^(https?:\/\/|\/|#|mailto:)/.test(h)) throw new Error(`${ctx.file}: link "${h}" must start with https://, / , # or mailto:`);
    const ext = /^https?:\/\//.test(h) && !h.startsWith(ctx.site);
    return `<a href="${escAttr(h)}"${ext ? ' rel="noopener"' : ""}>${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, "$1<em>$2</em>");
  return s.replace(/\u0000(\d+)\u0000/g, (m, i) => `<code>${escText(codes[i])}</code>`);
}

function imageHtml(alt, src, caption, ctx) {
  if (!src.startsWith("/img/")) throw new Error(`${ctx.file}: image "${src}" must be a site path starting with /img/ (e.g. /img/blog/${ctx.slug}/photo.webp)`);
  const file = path.join(ctx.root, src);
  if (!fs.existsSync(file)) throw new Error(`${ctx.file}: image ${src} does not exist`);
  if (!alt.trim()) throw new Error(`${ctx.file}: image ${src} needs alt text: ![what it shows](${src})`);
  const { w, h } = imageSize(file);
  ctx.images.push(src);
  const img = `<img src="${escAttr(src)}" alt="${escAttr(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async">`;
  return `<figure>${img}${caption ? `<figcaption>${inline(caption, ctx)}</figcaption>` : ""}</figure>`;
}

export function markdown(src, ctx) {
  const lines = src.replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  let i = 0;
  const isBlank = (l) => !l.trim();
  const startsBlock = (l) => /^(#{1,6}\s|```|>\s?|[-*]\s|\d+\.\s|\|.*\||---+\s*$|!\[)/.test(l);

  while (i < lines.length) {
    const line = lines[i];
    if (isBlank(line)) { i++; continue; }

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      out.push(`<pre><code${lang ? ` class="language-${escAttr(lang)}"` : ""}>${escText(code.join("\n"))}</code></pre>`);
      continue;
    }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      if (h[1].length < 2) throw new Error(`${ctx.file}: "# ${h[2]}" — the title is the only H1; start headings with ## or ###`);
      if (h[1].length > 3) throw new Error(`${ctx.file}: use ## or ### for headings, not ${h[1]}`);
      const text = h[2].replace(/\s+#+\s*$/, "");
      const id = text.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      out.push(`<h${h[1].length} id="${id}">${inline(text, ctx)}</h${h[1].length}>`);
      i++;
      continue;
    }

    if (/^---+\s*$/.test(line)) { out.push("<hr>"); i++; continue; }

    const img = line.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/);
    if (img) { out.push(imageHtml(img[1], img[2], img[3], ctx)); i++; continue; }

    if (/^>\s?/.test(line)) {
      const q = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ""));
      out.push(`<blockquote>${markdown(q.join("\n"), ctx)}</blockquote>`);
      continue;
    }

    const ul = /^[-*]\s+/, ol = /^\d+\.\s+/;
    if (ul.test(line) || ol.test(line)) {
      const re = ul.test(line) ? ul : ol;
      const tag = re === ul ? "ul" : "ol";
      const items = [];
      while (i < lines.length && (re.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        if (re.test(lines[i])) items.push(lines[i].replace(re, ""));
        else items[items.length - 1] += " " + lines[i].trim();
        i++;
      }
      out.push(`<${tag}>${items.map((it) => `<li>${inline(it, ctx)}</li>`).join("")}</${tag}>`);
      continue;
    }

    if (/^\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const cells = (l) => l.trim().slice(1, -1).split("|").map((c) => c.trim());
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) rows.push(cells(lines[i++]));
      out.push(`<div class="table-wrap"><table class="article-table"><thead><tr>${head.map((c) => `<th scope="col">${inline(c, ctx)}</th>`).join("")}</tr></thead><tbody>${rows
        .map((r) => `<tr>${r.map((c) => `<td>${inline(c, ctx)}</td>`).join("")}</tr>`)
        .join("")}</tbody></table></div>`);
      continue;
    }

    const para = [];
    while (i < lines.length && !isBlank(lines[i]) && !(para.length && startsBlock(lines[i]))) para.push(lines[i++].trim());
    out.push(`<p>${inline(para.join(" "), ctx)}</p>`);
  }
  return out.join("\n");
}

// ---------- load and check all posts ----------
export function loadPosts({ root, site, relatedKeys, today }) {
  const dir = path.join(root, "content", "blog");
  if (!fs.existsSync(dir)) return { posts: [], skipped: [] };
  const posts = [];
  const skipped = [];
  const errors = [];

  for (const name of fs.readdirSync(dir).sort()) {
    if (!name.endsWith(".md") || name.toLowerCase() === "readme.md") continue;
    const file = "content/blog/" + name;
    try {
      const slug = name.slice(0, -3);
      if (!SLUG.test(slug)) throw new Error(`${file}: file name must be lowercase words joined by hyphens, e.g. bent-pin-on-sensor-board.md`);
      const { data: d, body } = splitFrontMatter(fs.readFileSync(path.join(dir, name), "utf8"), file);

      const need = (k) => { if (d[k] === undefined || d[k] === "") throw new Error(`${file}: "${k}" is required`); return d[k]; };
      const known = ["title", "description", "date", "updated", "lang", "translationKey", "image", "imageAlt", "tags", "related", "author", "draft"];
      for (const k of Object.keys(d)) if (!known.includes(k)) throw new Error(`${file}: unknown field "${k}" (allowed: ${known.join(", ")})`);

      const title = String(need("title"));
      const description = String(need("description"));
      const date = String(need("date"));
      const lang = String(need("lang"));
      const image = String(need("image"));
      const imageAlt = String(need("imageAlt"));
      if (title.length > 70) throw new Error(`${file}: title is ${title.length} characters, keep it at 70 or fewer`);
      if (description.length < 70 || description.length > 170) throw new Error(`${file}: description is ${description.length} characters, use 70–170`);
      if (!DATE.test(date) || isNaN(Date.parse(date))) throw new Error(`${file}: date must be YYYY-MM-DD`);
      if (d.updated !== undefined && (!DATE.test(String(d.updated)) || String(d.updated) < date)) throw new Error(`${file}: updated must be YYYY-MM-DD and not before date`);
      if (!LANGS.includes(lang)) throw new Error(`${file}: lang must be one of ${LANGS.join(", ")}`);
      if (d.tags !== undefined && !Array.isArray(d.tags)) throw new Error(`${file}: tags must be a list, e.g. [pcb, anomaly detection]`);
      if (d.related !== undefined && !relatedKeys.includes(d.related)) throw new Error(`${file}: related must be one of ${relatedKeys.join(", ")}`);
      if (d.draft !== undefined && typeof d.draft !== "boolean") throw new Error(`${file}: draft must be true or false`);
      if (d.translationKey !== undefined && !SLUG.test(String(d.translationKey))) throw new Error(`${file}: translationKey must be lowercase words joined by hyphens`);

      const ctx = { file, slug, root, site, images: [] };
      const cover = imageHtml(imageAlt, image, "", ctx); // checks existence and alt
      const html = markdown(body, ctx);
      const words = body.replace(/```[\s\S]*?```/g, "").split(/\s+/).filter(Boolean).length;
      if (words < 150) throw new Error(`${file}: the article has ${words} words; write at least 150`);

      const post = {
        file, slug, title, description, date, updated: d.updated ? String(d.updated) : date, lang, image, imageAlt,
        imageSize: imageSize(path.join(root, image)), cover, html, words,
        tags: d.tags || [], related: d.related || null, author: d.author ? String(d.author) : null,
        translationKey: d.translationKey ? String(d.translationKey) : null,
      };
      if (d.draft === true) skipped.push(`${file} (draft)`);
      else if (date > today) skipped.push(`${file} (scheduled for ${date})`);
      else posts.push(post);
    } catch (e) {
      errors.push(e.message);
    }
  }

  // Slugs must be unique per language; a translationKey pairs at most one post per language.
  for (const lang of LANGS) {
    const seen = new Map();
    for (const p of posts.filter((p) => p.lang === lang && p.translationKey)) {
      if (seen.has(p.translationKey)) errors.push(`${p.file}: translationKey "${p.translationKey}" is also used by ${seen.get(p.translationKey)}`);
      seen.set(p.translationKey, p.file);
    }
  }
  if (errors.length) throw new Error("Blog posts have problems:\n  " + errors.join("\n  "));

  posts.sort((a, b) => (b.date + b.slug).localeCompare(a.date + a.slug));
  for (const p of posts) {
    // Language -> post, always including the post itself (EN first).
    p.translations = {};
    for (const lang of LANGS) {
      const q = lang === p.lang ? p : p.translationKey && posts.find((x) => x.lang === lang && x.translationKey === p.translationKey);
      if (q) p.translations[lang] = q;
    }
  }
  return { posts, skipped };
}
