/*
 * Script for the solution pages (pcb-inspection/ etc.). Their text is static
 * HTML written by tools/build.mjs, so this only handles the mobile menu, the
 * header border and remembering the language choice for the home page.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "vi-lang";

  // ---------- language links: remember the choice (same key as main.js) ----------
  Array.prototype.forEach.call(document.querySelectorAll("[data-lang-link]"), function (a) {
    a.addEventListener("click", function () {
      try { localStorage.setItem(STORAGE_KEY, a.getAttribute("data-lang-link")); } catch (e) { /* ignore */ }
    });
  });

  // ---------- header border once the page is scrolled ----------
  var header = document.querySelector(".site-header");
  function update() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", update, { passive: true });
  update();

  // ---------- mobile nav ----------
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
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      close();
      toggle.focus();
    }
  });
})();
