/*
 * Site configuration — the ONLY place to change the product name, contact
 * details, screenshots and showcase images.
 */
var VISA = { text: "VisA dataset (Amazon), CC BY 4.0", url: "https://github.com/amazon-science/spot-diff" };

window.SITE_CONFIG = {
  productName: "VisionInspect",
  contactEmail: "contact@visioninspect.de",
  company: "VisionInspect",
  address: "Netaji Palli, Belonia, Tripura, India",
  // Used by tools/build.mjs for canonical links, hreflang, the sitemap and
  // structured data (schema.org) for search engines.
  siteUrl: "https://visioninspect.de/",
  linkedin: "https://www.linkedin.com/company/visioninspect",
  postalAddress: { street: "Netaji Palli", locality: "Belonia", region: "Tripura", country: "IN" },

  // Solution pages: URL per language (from the site root). Their text is in
  // tools/pages.mjs; tools/build.mjs writes them. Links on the home page carry
  // data-page="<key>" and point to the page in the current language.
  pages: {
    pcb: { en: "pcb-inspection/", de: "de/leiterplatten-pruefung/" },
    assembly: { en: "assembly-monitoring/", de: "de/montageueberwachung/" },
    anomaly: { en: "visual-inspection-without-defect-images/", de: "de/sichtpruefung-ohne-fehlerbilder/" }
  },

  /*
   * Screenshots. null = show a labelled placeholder box.
   * To use a real screenshot, put the file in img/screenshots/ and set the path,
   * e.g. m1s4: "img/screenshots/results-compare.png".
   * One screenshot per step in the "Two modules" section (m1 = Industrial
   * Inspection, m2 = Process Inspection). It changes when a step is clicked.
   * The alt text comes from the dictionaries (keys "shot.<name>").
   */
  screenshots: {
    m1s1: "img/screenshots/inspection-reference-roi.webp",
    m1s2: "img/screenshots/inspection-good-samples.webp",
    m1s3: "img/screenshots/inspection-pass-fail-limit.webp",
    m1s4: "img/screenshots/inspection-result-review.webp",
    m2s1: null,
    m2s2: null,
    m2s3: null,
    m2s4: null
  },

  /*
   * "What it flags" carousel. Each slide compares a plain capture ("photo")
   * with the heat-map result ("heatmap"). Captions come from the dictionaries
   * ("show.<key>"). Set example:false once you use your own captures to hide
   * the "Example image" badge.
   * The two images are labelled "Photo" and "Heat map" unless the slide sets
   * labels: ["reference", "flagged"] (dictionary keys "show.<label>").
   * Images from a public dataset need a credit: { text: "...", url: "..." }.
   * For a video slide use: { key: "...", video: "img/showcase/clip.mp4", poster: "...jpg" }
   * The carousel advances by itself every autoplayMs (not with reduced motion).
   */
  autoplayMs: 3000,
  // The step lists in "Two modules" also advance by themselves, once every
  // step of a module has a real screenshot.
  stepsAutoplayMs: 3000,
  showcase: [
    { key: "led", photo: "img/showcase/00-bent-led-photo.webp", heatmap: "img/showcase/00-bent-led-heatmap.webp", example: false,
      credit: VISA },
    { key: "bent", photo: "img/showcase/03-bent-pin-photo.webp", heatmap: "img/showcase/03-bent-pin-heatmap.webp", example: false,
      credit: VISA },
    { key: "missing", photo: "img/showcase/01-missing-hole-photo.webp", heatmap: "img/showcase/01-missing-hole-heatmap.webp", example: false,
      credit: { text: "PKU-Market-PCB dataset (Peking University)", url: "https://robotics.pkusz.edu.cn/resources/datasetENG/" } },
    { key: "crack", photo: "img/showcase/04-crack-photo.webp", heatmap: "img/showcase/04-crack-heatmap.webp", example: false,
      credit: VISA },
    { key: "extra", photo: "img/showcase/cashew-extra-photo.webp", heatmap: "img/showcase/cashew-extra-heatmap.webp", example: false,
      credit: VISA },
    { key: "many", photo: "img/showcase/macaroni-photo.webp", heatmap: "img/showcase/macaroni-heatmap.webp", example: false,
      credit: VISA },
    { key: "contamination", photo: "img/showcase/fryum-photo.webp", heatmap: "img/showcase/fryum-heatmap.webp", example: false,
      credit: VISA },
    { key: "hole", photo: "img/showcase/cashew-hole-photo.webp", heatmap: "img/showcase/cashew-hole-heatmap.webp", example: false,
      credit: VISA },
    { key: "broken", photo: "img/showcase/pipe-fryum-photo.webp", heatmap: "img/showcase/pipe-fryum-heatmap.webp", example: false,
      credit: VISA }
  ]
};
