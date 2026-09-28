/* ============================================================
 * elements.js — tương tác dùng chung cho elements demo
 * [data-el-slider]: autoplay (ms, 0 = tắt), dots, arrows, vòng progress
 * [data-el-tabs]: tabs (nút data-eltab <-> pane cùng id trong khối)
 * [data-el-countdown]: đếm ngược (data-end ISO, trống = hết hôm nay)
 * [data-el-lightbox]: mở overlay (data-full = chữ/ảnh, data-video = embed url)
 * [data-el-search]: lọc live danh sách [data-el-search-list] a[data-name]
 * [data-el-filter]: lọc portfolio ([data-filter] <-> .el-work[data-cat])
 * [data-el-form]: submit giả -> hộp xác nhận
 * [data-el-hotspot]: bấm pin hiện tip
 * [data-el-flip]: sách lật 3D ([data-flip-prev]/[data-flip-next])
 * [data-el-resp]: slider responsive (data-lg/md/sm/xs/mobile = số item,
 *   nút [data-rprev]/[data-rnext] cuộn theo trang)
 * ============================================================ */
(function () {
  "use strict";
  document.querySelectorAll("[data-el-slider]").forEach(function (slider) {
    var slides = slider.querySelectorAll(".el-slide");
    if (!slides.length) return;
    var cur = 0, timer = null;
    var auto = parseInt(slider.getAttribute("data-auto") || "0", 10);
    var dotsBox = slider.querySelector(".el-dots");
    function show(i) {
      slides[cur].classList.remove("active");
      if (dotsBox && dotsBox.children[cur]) dotsBox.children[cur].classList.remove("active");
      cur = (i + slides.length) % slides.length;
      slides[cur].classList.add("active");
      if (dotsBox && dotsBox.children[cur]) dotsBox.children[cur].classList.add("active");
    }
    if (dotsBox) {
      slides.forEach(function (_, i) {
        var b = document.createElement("button");
        if (i === 0) b.classList.add("active");
        b.setAttribute("aria-label", "Slide " + (i + 1));
        b.addEventListener("click", function () { show(i); restart(); });
        dotsBox.appendChild(b);
      });
    }
    var prev = slider.querySelector(".el-prev"), next = slider.querySelector(".el-next");
    if (prev) prev.addEventListener("click", function () { show(cur - 1); restart(); });
    if (next) next.addEventListener("click", function () { show(cur + 1); restart(); });
    /* vòng tròn progress: r=22 -> chu vi 2*PI*22 = 138.23, offset chạy 138.23 -> 0 */
    var circle = slider.querySelector(".sw-circle-prg");
    var bar = circle ? circle.querySelector(".progress-bar") : null;
    var num = circle ? circle.querySelector(".pagination-number") : null;
    var C = 138.23, raf = null, start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / auto, 1);
      if (bar) bar.style.strokeDashoffset = (C * (1 - p)).toFixed(3);
      if (p >= 1) {
        show(cur + 1);
        start = null;
        if (num) num.textContent = cur + 1;
        if (bar) bar.style.strokeDashoffset = C;
      }
      raf = requestAnimationFrame(tick);
    }
    function restart() {
      if (timer) { clearInterval(timer); timer = null; }
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      start = null;
      if (num) num.textContent = cur + 1;
      if (bar) bar.style.strokeDashoffset = C;
      if (auto > 0) {
        if (circle) raf = requestAnimationFrame(tick);
        else timer = setInterval(function () { show(cur + 1); }, auto);
      }
    }
    restart();
  });

  /* ---- tabs ---- */
  document.querySelectorAll("[data-el-tabs]").forEach(function (block) {
    var btns = block.querySelectorAll("[data-eltab]");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) { b.classList.remove("active"); });
        block.querySelectorAll(".el-tabs__pane, .tab-pane").forEach(function (p) { p.classList.remove("active"); });
        btn.classList.add("active");
        var pane = document.getElementById(btn.getAttribute("data-eltab"));
        if (pane) pane.classList.add("active");
      });
    });
  });

  /* ---- countdown ---- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  document.querySelectorAll("[data-el-countdown]").forEach(function (cd) {
    var dd = cd.querySelector("[data-d]"), hh = cd.querySelector("[data-h]"),
        mm = cd.querySelector("[data-m]"), ss = cd.querySelector("[data-s]");
    var endAttr = cd.getAttribute("data-end");
    function target() {
      if (endAttr) return new Date(endAttr);
      var e = new Date(); e.setHours(23, 59, 59, 999); return e;
    }
    function render() {
      var t = Math.max(0, target() - new Date());
      if (dd) dd.textContent = pad(Math.floor(t / 864e5));
      if (hh) hh.textContent = pad(Math.floor(t / 36e5) % 24);
      if (mm) mm.textContent = pad(Math.floor(t / 6e4) % 60);
      if (ss) ss.textContent = pad(Math.floor(t / 1e3) % 60);
    }
    render();
    setInterval(render, 1000);
  });

  /* ---- lightbox (1 overlay dùng chung, tạo khi cần) ---- */
  var lb = null;
  function getLb() {
    if (lb) return lb;
    lb = document.createElement("div");
    lb.className = "el-lightbox";
    lb.innerHTML = '<button class="el-lightbox__close" aria-label="Đóng">✕</button><div class="el-lightbox__content"></div>';
    document.body.appendChild(lb);
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("el-lightbox__close")) closeLb(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLb(); });
    return lb;
  }
  function closeLb() {
    if (!lb) return;
    lb.classList.remove("open");
    lb.querySelector(".el-lightbox__content").innerHTML = "";
    document.body.style.overflow = "";
  }
  document.querySelectorAll("[data-el-lightbox]").forEach(function (el) {
    el.style.cursor = "pointer";
    el.addEventListener("click", function () {
      var box = getLb().querySelector(".el-lightbox__content");
      var video = el.getAttribute("data-video");
      if (video) box.innerHTML = '<iframe src="' + video + '" allowfullscreen></iframe>';
      else box.innerHTML = '<div class="ph">' + (el.getAttribute("data-full") || "Lightbox") + "</div>";
      getLb().classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  /* ---- search live ---- */
  document.querySelectorAll("[data-el-search]").forEach(function (form) {
    var input = form.querySelector("input");
    var list = document.querySelector("[data-el-search-list]");
    if (!input || !list) return;
    var links = list.querySelectorAll("a[data-name]");
    function run(e) {
      if (e) e.preventDefault();
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      links.forEach(function (a) {
        var hit = !q || (a.getAttribute("data-name") || "").toLowerCase().indexOf(q) !== -1;
        a.style.display = hit ? "" : "none";
        if (hit) shown++;
      });
      var empty = list.querySelector(".el-search__empty");
      if (!shown && !empty) {
        empty = document.createElement("div");
        empty.className = "el-search__empty";
        empty.textContent = "Không tìm thấy sản phẩm phù hợp.";
        list.appendChild(empty);
      } else if (shown && empty) empty.remove();
    }
    input.addEventListener("input", function () { run(); });
    form.addEventListener("submit", run);
  });

  /* ---- portfolio filter ---- */
  document.querySelectorAll("[data-el-filter]").forEach(function (bar) {
    var btns = bar.querySelectorAll("[data-filter]");
    var works = document.querySelectorAll("[data-el-works] .el-work");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var f = btn.getAttribute("data-filter");
        works.forEach(function (w) {
          w.classList.toggle("hide", f !== "all" && w.getAttribute("data-cat") !== f);
        });
      });
    });
  });

  /* ---- form giả ---- */
  document.querySelectorAll("[data-el-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.innerHTML = '<div class="el-form__ok"><strong>Đã gửi!</strong> Cảm ơn bạn, chúng tôi sẽ liên hệ sớm.</div>';
    });
  });

  /* ---- hotspot ---- */
  document.querySelectorAll("[data-el-hotspot]").forEach(function (zone) {
    var tips = zone.querySelectorAll(".el-tip");
    zone.querySelectorAll(".el-pin").forEach(function (pin) {
      pin.addEventListener("click", function (e) {
        e.stopPropagation();
        var tip = document.getElementById(pin.getAttribute("data-tip"));
        var was = tip && tip.classList.contains("open");
        tips.forEach(function (t) { t.classList.remove("open"); });
        if (tip && !was) tip.classList.add("open");
      });
    });
    document.addEventListener("click", function () {
      tips.forEach(function (t) { t.classList.remove("open"); });
    });
  });

  /* ---- responsive slider ---- */
  document.querySelectorAll("[data-el-resp]").forEach(function (sl) {
    var viewport = sl.querySelector(".resp-viewport");
    var track = sl.querySelector("[data-el-track]");
    if (!viewport || !track) return;
    function per() {
      var w = window.innerWidth;
      if (w < 480) return parseInt(sl.getAttribute("data-mobile") || "2", 10);
      if (w < 768) return parseInt(sl.getAttribute("data-xs") || "2", 10);
      if (w < 1024) return parseInt(sl.getAttribute("data-sm") || "3", 10);
      if (w < 1280) return parseInt(sl.getAttribute("data-md") || "4", 10);
      return parseInt(sl.getAttribute("data-lg") || "5", 10);
    }
    function layout() {
      var n = per(), gap = 15;
      var items = track.children;
      for (var i = 0; i < items.length; i++) {
        items[i].style.flex = "0 0 calc(" + (100 / n) + "% - " + (gap * (n - 1) / n) + "px)";
      }
    }
    layout();
    window.addEventListener("resize", layout);
    var prev = sl.querySelector("[data-rprev]"), next = sl.querySelector("[data-rnext]");
    function page() { return viewport.clientWidth; }
    if (prev) prev.addEventListener("click", function () { viewport.scrollBy({ left: -page(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { viewport.scrollBy({ left: page(), behavior: "smooth" }); });
  });

  /* ---- flip book ---- */
  document.querySelectorAll("[data-el-flip]").forEach(function (book) {
    var pages = book.querySelectorAll(".el-page");
    var idx = 0;
    function render() {
      pages.forEach(function (p, i) { p.classList.toggle("flipped", i < idx); });
      pages.forEach(function (p, i) { p.style.zIndex = pages.length - Math.abs(i - idx); });
    }
    var prev = document.querySelector("[data-flip-prev]");
    var next = document.querySelector("[data-flip-next]");
    if (prev) prev.addEventListener("click", function () { idx = Math.max(0, idx - 1); render(); });
    if (next) next.addEventListener("click", function () { idx = Math.min(pages.length, idx + 1); render(); });
    render();
  });
})();
