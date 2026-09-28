/* ============================================================
 * header-main.js — morphing dropdown (>1024px) + mobile collapse
 * 1. Hover nav item -> morph panel duy nhất đổi nội dung/kích thước
 * 2. Animated menu button + collapse panel mobile (<1024px)
 * ============================================================ */
(function () {
  "use strict";
  var nav = document.querySelector(".js-morph-nav");
  if (!nav) return;

  /* ---- 1. Morphing dropdown (desktop) ---- */
  var items = nav.querySelectorAll(".morph-item[data-panel]");
  var dd = nav.querySelector(".morph-dropdown");
  var arrow = nav.querySelector(".morph-dropdown__arrow");
  var panels = nav.querySelectorAll(".morph-panel");
  var hideTimer = null;

  function openPanel(item) {
    clearTimeout(hideTimer);
    items.forEach(function (i) { i.classList.remove("active"); });
    panels.forEach(function (p) { p.classList.remove("active"); });
    item.classList.add("active");
    var panel = nav.querySelector("#" + item.getAttribute("data-panel"));
    if (panel) panel.classList.add("active");
    /* morph: cùng gốc tọa độ = .morph-nav__bar (offsetParent của dropdown).
       Trước đây tính theo .box-nav-menu (căn giữa, hẹp hơn) nên arrow/panel nhỏ bị lệch. */
    var bar = nav.querySelector(".morph-nav__bar");
    var barRect = bar.getBoundingClientRect();
    var itemRect = item.getBoundingClientRect();
    var itemCenter = itemRect.left - barRect.left + itemRect.width / 2;
    var ddLeft = 0;
    if (item.hasAttribute("data-sm")) {
      dd.classList.add("morph-dropdown--sm");
      /* neo panel nhỏ dưới item, kẹp trong khung bar để không tràn mép */
      ddLeft = Math.max(8, Math.min(itemRect.left - barRect.left, barRect.width - 260 - 8));
      dd.style.left = ddLeft + "px";
    } else {
      dd.classList.remove("morph-dropdown--sm");
      dd.style.left = "0px";
    }
    /* arrow nằm trong dropdown nên phải trừ left của chính dropdown */
    arrow.style.left = Math.max(6, itemCenter - ddLeft - 6) + "px";
    dd.classList.add("open");
  }
  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      dd.classList.remove("open");
      items.forEach(function (i) { i.classList.remove("active"); });
    }, 150);
  }
  items.forEach(function (item) {
    item.addEventListener("mouseenter", function () { openPanel(item); });
    item.addEventListener("mouseleave", scheduleHide);
  });
  dd.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
  dd.addEventListener("mouseleave", scheduleHide);
  /* bàn phím: Tab vào item -> mở panel như hover; Enter/click không nhảy trang */
  nav.querySelector(".box-nav-menu").addEventListener("focusin", function (e) {
    var item = e.target.closest ? e.target.closest(".morph-item[data-panel]") : null;
    if (item) openPanel(item);
  });
  document.addEventListener("focusin", function (e) {
    if (!e.target.closest || !e.target.closest(".js-morph-nav")) scheduleHide();
  });
  items.forEach(function (item) {
    var link = item.querySelector(":scope > .item-link");
    if (link) link.addEventListener("click", function (e) { e.preventDefault(); openPanel(item); });
  });
  /* resize làm sai tọa độ đã tính -> đóng dropdown */
  window.addEventListener("resize", function () { dd.classList.remove("open"); });

  /* ---- 2. Mobile: animated button + OFFCANVAS drawer (kiểu SEOVN) ---- */
  var btn = nav.querySelector(".menu-btn");
  var drawer = nav.querySelector("#mobileMenu");
  var backdrop = nav.querySelector("#menuBackdrop");
  var closeBtn = nav.querySelector(".offcanvas__close");
  function setMenu(open) {
    drawer.classList.toggle("show", open);
    backdrop.classList.toggle("show", open);
    btn.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("menu-open", open);
    if (open && closeBtn) closeBtn.focus();
    else if (!open) btn.focus();
  }
  /* focus trap: Tab không lọt ra ngoài drawer khi đang mở */
  drawer.addEventListener("keydown", function (e) {
    if (e.key !== "Tab" || !drawer.classList.contains("show")) return;
    var f = drawer.querySelectorAll('a[href], button, summary, select, input');
    f = Array.prototype.filter.call(f, function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  });
  if (btn && drawer && backdrop) {
    btn.addEventListener("click", function () { setMenu(!drawer.classList.contains("show")); });
    if (closeBtn) closeBtn.addEventListener("click", function () { setMenu(false); });
    backdrop.addEventListener("click", function () { setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }
})();
