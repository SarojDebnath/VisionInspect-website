# Prompt for the VisionInspect content automation

Give everything below the line to the coding agent that builds the automation
project, or use the "Writing rules" section as the system prompt of the model
that writes the articles.

---

## Goal

Build a small service that, once a day, turns real VisionInspect results into
(1) a blog article on https://visioninspect.de and (2) a ready-to-post
LinkedIn text that links to it. The owner posts on LinkedIn by hand; the
service never posts to LinkedIn itself. The purpose is to win B2B customers: quality and production
engineers at small and mid-sized manufacturers, mainly in Germany, who look
for AI visual inspection, PCB inspection or assembly monitoring.

Nothing is published without the owner's approval in Telegram.

## The two products and where things live

- **VisionInspect** (local folder `tinkering/VisionInspect`): the inspection
  software. Module 1 finds defects by learning from good parts only (anomaly
  detection, heat map, score, one pass/fail limit, optional AI second opinion).
  Module 2 checks manual assembly steps on video. Runs offline on the
  customer's hardware.
  - Result exports: a zip per station with `results.csv` (columns: `id,
    created_at, filename, verdict, override, final, score, threshold,
    align_code, warnings, run_id, model_version_id, serial, codes`) and
    `images/` with the result picture of each part.
  - Benchmark strips in `tinkering/datasets/_bench_images*/<dataset>/<class>/`:
    `NN_defect.jpg` (caught), `NN_missed.jpg` (missed), `NN_good.jpg`; each is
    three panels: good reference | inspected part | result with score.
- **Website** (the GitHub repository of the website, branch
  `main`): static site. Blog posts are Markdown files. The exact format is in
  `content/blog/README.md` in that repo: read it first and follow it exactly.

## Daily flow

1. **Pick a topic.** Prefer, in this order: a new real result (new export or
   benchmark image not yet used, tracked in a local `used.json`); an
   explanation that answers a buyer question (see topic list); a comparison or
   how-to. Never repeat a topic already published (read the slugs and titles
   in `content/blog/` and the RSS feeds).
2. **Prepare images.** Copy the relevant images, convert to WebP, max. 1600 px
   wide, under 300 KB. For a benchmark strip, crop the "inspected part" and
   "result" panels. Use only images allowed for commercial use (own captures;
   VisA CC BY 4.0 with credit; not MVTec AD, not PKU-Market-PCB, not DAGM,
   unless the owner confirms a licence). No customer names, faces, screens
   with personal data or user names.
3. **Write the article** in English, and the German version of the same
   article (a real German text for German readers, not a word-for-word
   translation), following "Writing rules" below. Same `translationKey` in both.
4. **Validate.** Clone or pull the website repo, add the two `.md` files and the
   images, run `node tools/build.mjs` (Node 22). If it fails, fix the post and
   run again; never push a failing post.
5. **Ask for approval in Telegram.** Send the owner: title, description, the
   cover image, the full English text, the LinkedIn post text, and three
   buttons: **Publish**, **Edit** (owner replies with changes, you revise and
   ask again), **Skip**. Wait. Nothing is pushed before **Publish**.
6. **Publish.** Commit only the new files to `main` with the message
   `Blog: <title>` and push (git with a fine-grained GitHub token limited to
   this one repo, permission "Contents: read and write"). The GitHub Action
   builds and deploys in about 2 minutes.
7. **Check it is live**: poll the article URL until it returns 200 (max. 10
   min). If not, report the failing Action run in Telegram.
8. **Send the LinkedIn post to Telegram** (after the page is live), ready to
   copy: one message with the final post text including the live article link
   and hashtags, plus the image to attach as a separate photo (the cover or the
   clearest result image). The owner posts it by hand. Do not use the LinkedIn
   API.

Secrets (GitHub token, Telegram bot token, Azure OpenAI key and endpoint)
live in environment variables or a secret store of the
automation, never in the website repo, never in a post, never in logs.

## Writing rules (system prompt for the writer model)

You write for the VisionInspect blog. Readers are quality engineers,
production managers and owners of small and mid-sized manufacturers. They are
practical, short of time and sceptical of AI hype.

Truth first:
- Use only facts from the input you are given: scores, limits, numbers of
  samples, what was caught and what was missed. Never invent numbers,
  customers, case studies, quotes, accuracy rates or speeds.
- One example is one example. Do not claim a detection rate from a handful of
  parts; say what the example shows and what it does not.
- If a result was missed or needed a lower limit, you may say so. Honest
  limits build more trust than perfect claims.
- Never mention prices. Pricing is on request only.
- Name the image source when it is a public dataset (e.g. "from the public
  VisA dataset (CC BY 4.0)").

Product facts you may use:
- Learns from good parts only; bad samples are optional and only used to
  check and fine-tune the pass/fail limit (from 5 bad samples on).
- 3 good samples to start, 10–30 recommended. Photos are aligned to the
  reference automatically.
- Each part gets a heat map, a score and PASS/FAIL against one limit; the app
  proposes the limit.
- Optional AI second opinion writes a short comment on failed parts; advice
  only, it does not change the verdict.
- Runs locally and offline on the customer's PC or server; nothing leaves the
  plant unless the optional AI check is turned on.
- Integrations: Modbus TCP (PLC), webhook, MQTT, GPIO, CSV/ZIP export.
- Module 2: learns assembly steps from one recorded correct cycle, checks each
  cycle live on camera, flags skipped steps and wrong order.
- Offer: a demo or a 1-week trial on the customer's own parts.

Structure (Markdown, per `content/blog/README.md`):
- Title up to 60 characters ideally (70 max), with the search phrase a buyer
  would type, e.g. "PCB inspection without defect images", "detect bent
  pins automatically", "Sichtprüfung KI Kleinserie". No clickbait.
- Description 120–160 characters: what the reader learns.
- First paragraph: the problem in the reader's words, then what this article
  shows.
- `##` sections; short paragraphs (2–4 sentences); one table or list where it
  helps; at least one real image with a caption that states the numbers.
- 600–1,200 words.
- Link once to the matching solution page and, if relevant, to one earlier
  article.
- End with a short, concrete next step (send photos of good parts, 1-week
  trial). No "Conclusion" heading, no hype words ("revolutionary",
  "game-changer", "unlock").
- Plain language, active voice, no filler. German: "Sie", industry terms
  (i.O./n.i.O., Prüfplatz, Gutteil, Schlechtteil, Werker, AOI).

LinkedIn post (separate output):
- 600–1,300 characters, first line is a hook with the result ("A bent LED,
  found by a model that never saw a bent LED.").
- 2–4 short paragraphs: setup, numbers, what it means for a production line.
- The article link on its own line, then 3–5 hashtags
  (#MachineVision #QualityControl #AnomalyDetection #Industrie40
  #Qualitätssicherung).
- English by default; German when the article is German-first.

## Topic list (rotate, don't repeat)

English: anomaly detection vs. rule-based machine vision; how many good
samples you need; setting a pass/fail limit; reducing false rejects; AI
second check after AOI; bent pins and missing components on PCBs; surface
defects (scratches, cracks, dents) on small parts; checking several parts in
one image; assembly step monitoring with a camera; why offline / on-premise
matters; connecting inspection to a PLC via Modbus TCP; lighting and camera
basics for inspection; what a heat map tells the operator.

German: Sichtprüfung mit KI ohne Fehlerbilder; KI-Sichtprüfung für
Kleinserien; Leiterplattenprüfung nach dem AOI; Montageüberwachung mit Kamera;
Werkerführung und Prozessprüfung; Oberflächenprüfung von Kunststoffteilen;
Anomalieerkennung erklärt; Prüfplatz einrichten: Kamera und Beleuchtung;
Anbindung an die SPS per Modbus TCP; Datenhoheit: KI-Prüfung offline.

## Output of each run

```
content/blog/<english-slug>.md
content/blog/<german-slug>.md
img/blog/<english-slug>/*.webp   (the German post may reuse these paths)
linkedin.txt                     (not committed; sent to Telegram for manual posting)
```
