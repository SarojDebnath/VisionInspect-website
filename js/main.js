(function () {
  "use strict";

  var CONFIG = window.SITE_CONFIG;
  var DICT = window.I18N;
  var STORAGE_KEY = "vi-lang";
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lang = "en";
  // Language of this URL as built by tools/build.mjs: "/" is English, "/de/" German.
  var PAGE_LANG = document.documentElement.getAttribute("lang") || "en";
  // Site root, so image paths from the config also work on /de/.
  var BASE = document.currentScript ? new URL("../", document.currentScript.src) : null;

  // ---------- helpers ----------
  function fill(str, vars) {
    return str.replace(/\{(\w+)\}/g, function (m, k) {
      if (vars && k in vars) return vars[k];
      if (k === "product") return CONFIG.productName;
      if (k === "email") return CONFIG.contactEmail;
      if (k === "year") return String(new Date().getFullYear());
      return m;
    });
  }

  function t(key, vars) {
    var s = DICT[lang][key];
    if (s === undefined) s = DICT.en[key];
    if (s === undefined) return key;
    return fill(s, vars);
  }

  function asset(path) {
    return BASE ? new URL(path, BASE).href : path;
  }

  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function storageGet() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function storageSet(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* ignore */ }
  }

  // ---------- language ----------
  function detectLang() {
    // A language-specific URL (/de/) always shows its language.
    if (PAGE_LANG !== "en" && DICT[PAGE_LANG]) return PAGE_LANG;
    var saved = storageGet();
    if (saved && DICT[saved]) return saved;
    var prefs = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i]).toLowerCase().slice(0, 2);
      if (code === "de") return "de";
      if (code === "en") return "en";
    }
    return "en";
  }

  function applyLang(next) {
    lang = DICT[next] ? next : "en";
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.description"));

    $all("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    $all("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":");
        el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    });
    $all("[data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === lang));
    });

    renderShots();
    carousel.relabel();
  }

  // ---------- config values ----------
  function applyConfig() {
    $all("[data-config]").forEach(function (el) {
      el.textContent = CONFIG[el.getAttribute("data-config")];
    });
    $all("[data-config-mail]").forEach(function (a) {
      a.href = "mailto:" + CONFIG.contactEmail;
      a.textContent = CONFIG.contactEmail;
    });
    $all("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  // ---------- screenshots / placeholders ----------
  function renderShot(fig) {
    var name = fig.getAttribute("data-shot");
    var src = CONFIG.screenshots[name];
    var label = t("shot." + name);
    fig.textContent = "";
    if (src) {
      var img = document.createElement("img");
      img.src = asset(src);
      img.alt = label;
      img.loading = "lazy";
      img.decoding = "async";
      fig.appendChild(img);
      fig.classList.remove("shot-placeholder");
      fig.removeAttribute("role");
      fig.removeAttribute("aria-label");
    } else {
      var text = "[" + t("shot.placeholder") + ": " + label + "]";
      fig.classList.add("shot-placeholder");
      fig.setAttribute("role", "img");
      fig.setAttribute("aria-label", text);
      var span = document.createElement("span");
      span.setAttribute("aria-hidden", "true");
      span.textContent = text;
      fig.appendChild(span);
    }
  }

  function renderShots() {
    $all("[data-shot]").forEach(renderShot);
  }

  // ---------- carousel with photo / heat-map compare ----------
  var carousel = (function () {
    var root = document.querySelector("[data-carousel]");
    var api = { relabel: function () {} };
    if (!root) return api;

    var track = root.querySelector("[data-track]");
    var dotsBox = root.querySelector("[data-dots]");
    var status = root.querySelector("[data-status]");
    var slides = CONFIG.showcase;
    var index = 0;

    slides.forEach(function (s, i) {
      var li = document.createElement("li");
      li.className = "slide";
      li.setAttribute("role", "group");
      li.setAttribute("aria-roledescription", "slide");

      var frame = document.createElement("div");
      frame.className = "compare";

      if (s.video) {
        var v = document.createElement("video");
        v.src = asset(s.video);
        if (s.poster) v.poster = asset(s.poster);
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.controls = reducedMotion;
        v.setAttribute("preload", "none");
        v.className = "compare-video";
        frame.appendChild(v);
      } else {
        var before = document.createElement("img");
        before.className = "compare-img";
        before.src = asset(s.photo);
        before.width = 800;
        before.height = 500;
        before.loading = i === 0 ? "eager" : "lazy";
        before.decoding = "async";

        var after = document.createElement("img");
        after.className = "compare-img compare-after";
        after.src = asset(s.heatmap);
        after.width = 800;
        after.height = 500;
        after.loading = i === 0 ? "eager" : "lazy";
        after.decoding = "async";

        var handle = document.createElement("div");
        handle.className = "compare-handle";
        handle.setAttribute("aria-hidden", "true");

        var range = document.createElement("input");
        range.type = "range";
        range.min = "0";
        range.max = "100";
        range.value = "50";
        range.className = "compare-range";
        range.addEventListener("input", function () {
          frame.style.setProperty("--pos", range.value + "%");
        });

        var tagL = document.createElement("span");
        tagL.className = "compare-tag compare-tag-l";
        tagL.setAttribute("aria-hidden", "true");
        var tagR = document.createElement("span");
        tagR.className = "compare-tag compare-tag-r";
        tagR.setAttribute("aria-hidden", "true");

        frame.appendChild(before);
        frame.appendChild(after);
        frame.appendChild(handle);
        frame.appendChild(tagL);
        frame.appendChild(tagR);
        frame.appendChild(range);
      }

      if (s.example) {
        var badge = document.createElement("span");
        badge.className = "example-badge";
        frame.appendChild(badge);
      }

      var cap = document.createElement("p");
      cap.className = "slide-caption";

      li.appendChild(frame);
      li.appendChild(cap);
      track.appendChild(li);

      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.addEventListener("click", function () { go(i, true); });
      dotsBox.appendChild(dot);
    });

    var slideEls = $all(".slide", track);
    var dotEls = $all(".dot", dotsBox);

    function go(i, announce) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(" + (-100 * index) + "%)";
      slideEls.forEach(function (el, n) {
        var active = n === index;
        el.setAttribute("aria-hidden", String(!active));
        el.inert = !active;
        var vid = el.querySelector("video");
        if (vid) {
          if (active && !reducedMotion) vid.play().catch(function () {});
          else vid.pause();
        }
      });
      dotEls.forEach(function (d, n) {
        d.setAttribute("aria-current", n === index ? "true" : "false");
      });
      if (announce) {
        status.textContent = t("show.slide", { n: index + 1, total: slides.length }) + ". " +
          t("show." + slides[index].key);
      }
    }

    api.relabel = function () {
      slideEls.forEach(function (el, n) {
        var s = slides[n];
        el.setAttribute("aria-label", t("show.slide", { n: n + 1, total: slides.length }));
        el.querySelector(".slide-caption").textContent = t("show." + s.key);
        var r = el.querySelector(".compare-range");
        if (r) r.setAttribute("aria-label", t("show.compare") + ": " + t("show." + s.key));
        var imgs = el.querySelectorAll(".compare-img");
        if (imgs.length) {
          imgs[0].alt = t("show.photo") + ": " + t("show." + s.key);
          imgs[1].alt = t("show.heatmap") + ": " + t("show." + s.key);
        }
        var tl = el.querySelector(".compare-tag-l");
        if (tl) tl.textContent = t("show.photo");
        var tr = el.querySelector(".compare-tag-r");
        if (tr) tr.textContent = t("show.heatmap");
        var b = el.querySelector(".example-badge");
        if (b) b.textContent = t("show.example");
      });
      dotEls.forEach(function (d, n) {
        d.setAttribute("aria-label", t("show.goto", { n: n + 1 }));
      });
    };

    root.querySelector("[data-prev]").addEventListener("click", function () { go(index - 1, true); });
    root.querySelector("[data-next]").addEventListener("click", function () { go(index + 1, true); });

    // Swipe on the caption / frame edges (the range input handles its own drag).
    var startX = null;
    track.addEventListener("touchstart", function (e) {
      startX = e.target.classList.contains("compare-range") ? null : e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1), true);
      startX = null;
    }, { passive: true });

    go(0, false);
    return api;
  })();

  // ---------- module tabs ----------
  var selectTab = (function () {
    var tabs = $all('[role="tab"]');
    var section = document.getElementById("modules");

    function select(name, focus) {
      tabs.forEach(function (tab) {
        var active = tab.getAttribute("data-tab") === name;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
        if (active && focus) tab.focus();
      });
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab.getAttribute("data-tab"), false); });
      tab.addEventListener("keydown", function (e) {
        var step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (e.key === "Home") step = -i;
        if (e.key === "End") step = tabs.length - 1 - i;
        if (step === undefined) return;
        e.preventDefault();
        select(tabs[(i + step + tabs.length) % tabs.length].getAttribute("data-tab"), true);
      });
    });

    // Nav links "Inspection" / "Process" open the matching tab.
    function openFromLink(name) {
      select(name, false);
      section.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      if (history.replaceState) history.replaceState(null, "", "#" + name);
    }
    $all("[data-tab-link]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        openFromLink(a.getAttribute("data-tab-link"));
      });
    });
    var hash = location.hash.slice(1);
    if (hash === "inspection" || hash === "process") {
      select(hash, false);
      setTimeout(function () { section.scrollIntoView(); }, 0);
    }

    return select;
  })();

  // ---------- step lists: clicking a step swaps the screenshot ----------
  $all("[data-stepper]").forEach(function (list) {
    var buttons = $all(".step-btn", list);
    var fig = list.parentNode.querySelector("[data-shot]");
    function activate(btn) {
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      fig.setAttribute("data-shot", btn.getAttribute("data-step"));
      renderShot(fig);
    }
    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () { activate(b); });
    });
    activate(buttons[0]);
  });

  // ---------- gentle fade-in of sections while scrolling ----------
  (function () {
    var items = $all("[data-reveal]");
    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    items.forEach(function (el) { io.observe(el); });
  })();

  // ---------- header border once the page is scrolled ----------
  (function () {
    var header = document.querySelector(".site-header");
    function update() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
    window.addEventListener("scroll", update, { passive: true });
    update();
  })();

  // ---------- mobile nav ----------
  (function () {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    function close() {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    }
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("open", open);
    });
    $all("a", nav).forEach(function (a) { a.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        close();
        toggle.focus();
      }
    });
  })();

  // ---------- contact form -> mailto ----------
  (function () {
    var form = document.getElementById("contact-form");
    var statusEl = form.querySelector("[data-form-status]");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var required = $all("[required]", form);
      var firstBad = null;
      required.forEach(function (el) {
        var ok = el.value.trim() !== "" && el.checkValidity();
        el.setAttribute("aria-invalid", String(!ok));
        if (!ok && !firstBad) firstBad = el;
      });
      if (firstBad) {
        statusEl.textContent = t("form.error");
        statusEl.classList.add("is-error");
        firstBad.focus();
        return;
      }
      statusEl.classList.remove("is-error");

      var data = new FormData(form);
      var interest = form.querySelector('input[name="interest"]:checked');
      var lines = [
        t("mail.name") + ": " + data.get("name"),
        t("mail.company") + ": " + data.get("company"),
        t("mail.email") + ": " + data.get("email"),
        t("mail.phone") + ": " + (data.get("phone") || "-"),
        t("mail.interest") + ": " + (interest ? t(interest.value) : "-"),
        "",
        t("mail.message") + ":",
        data.get("message")
      ];
      var href = "mailto:" + CONFIG.contactEmail +
        "?subject=" + encodeURIComponent(t("mail.subject")) +
        "&body=" + encodeURIComponent(lines.join("\r\n"));
      statusEl.textContent = t("form.opened");
      window.location.href = href;
    });
  })();

  // ---------- language switch ----------
  // Point the address bar at the matching language URL (/ or /de/) without a
  // reload, so a copied link opens in the same language.
  function showLangUrl(next) {
    var alt = document.querySelector('link[rel="alternate"][hreflang="' + next + '"]');
    if (!alt || !history.replaceState || !/^https?:$/.test(location.protocol)) return;
    try {
      history.replaceState(null, "", new URL(alt.href).pathname + location.hash);
    } catch (e) { /* ignore */ }
  }

  $all("[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = btn.getAttribute("data-lang");
      storageSet(next);
      applyLang(next);
      showLangUrl(next);
    });
  });

  applyConfig();
  applyLang(detectLang());
})();
