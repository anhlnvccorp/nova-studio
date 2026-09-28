/* ============================================================
 * main.js — tương tác demo tĩnh (không phụ thuộc lib ngoài)
 * 1. Mobile nav  2. Hero slider  3. Countdown deals
 * 4. Tabs sản phẩm  5. Vehicle filter demo  6. Newsletter fake
 * ============================================================ */
(function () {
  "use strict";

  /* 1. Mobile nav */
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  /* 2. Hero slider */
  var slides = document.querySelectorAll(".hero-slide");
  var dotsBox = document.getElementById("heroDots");
  var current = 0, timer = null;
  function showSlide(i) {
    if (!slides.length) return;
    slides[current].classList.remove("active");
    if (dotsBox && dotsBox.children[current]) dotsBox.children[current].classList.remove("active");
    current = (i + slides.length) % slides.length;
    slides[current].classList.add("active");
    if (dotsBox && dotsBox.children[current]) dotsBox.children[current].classList.add("active");
  }
  if (slides.length && dotsBox) {
    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      if (i === 0) b.classList.add("active");
      b.setAttribute("aria-label", "Slide " + (i + 1));
      b.addEventListener("click", function () { showSlide(i); restart(); });
      dotsBox.appendChild(b);
    });
    function restart() { clearInterval(timer); timer = setInterval(function () { showSlide(current + 1); }, 5000); }
    restart();
  }

  /* 3. Countdown deals (đếm tới cuối ngày) */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  var cd = document.getElementById("countdown");
  if (cd) {
    var dd = cd.querySelector("[data-d]"), hh = cd.querySelector("[data-h]"),
        mm = cd.querySelector("[data-m]"), ss = cd.querySelector("[data-s]");
    setInterval(function () {
      var now = new Date(), end = new Date();
      end.setHours(23, 59, 59, 999);
      var t = Math.max(0, end - now);
      var d = Math.floor(t / 864e5), h = Math.floor(t / 36e5) % 24,
          m = Math.floor(t / 6e4) % 60, s = Math.floor(t / 1e3) % 60;
      if (dd) dd.textContent = pad(d); if (hh) hh.textContent = pad(h);
      if (mm) mm.textContent = pad(m); if (ss) ss.textContent = pad(s);
    }, 1000);
  }

  /* 4. Tabs sản phẩm (mỗi khối data-tabs độc lập) */
  document.querySelectorAll("[data-tabs]").forEach(function (block) {
    var btns = block.querySelectorAll(".tabs button");
    var panes = block.querySelectorAll(".tab-pane");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) { b.classList.remove("active"); });
        panes.forEach(function (p) { p.classList.remove("active"); });
        btn.classList.add("active");
        var pane = block.querySelector("#" + btn.getAttribute("data-tab"));
        if (pane) pane.classList.add("active");
      });
    });
  });

  /* 5. Vehicle filter demo (data tĩnh, redirect sang #shop) */
  var vehicleData = {
    Toyota: { Camry: ["2022", "2023"], Corolla: ["2021", "2022"] },
    Honda: { Civic: ["2021", "2022"], CRV: ["2023"] },
    Ford: { Ranger: ["2022", "2023"], Everest: ["2023"] }
  };
  var mk = document.getElementById("vMaker"), md = document.getElementById("vModel"), yr = document.getElementById("vYear");
  function fill(sel, items, label) {
    sel.innerHTML = "";
    var o0 = document.createElement("option"); o0.textContent = label; sel.appendChild(o0);
    items.forEach(function (it) { var o = document.createElement("option"); o.textContent = it; sel.appendChild(o); });
  }
  if (mk && md && yr) {
    fill(mk, Object.keys(vehicleData), "Select Maker");
    mk.addEventListener("change", function () {
      var models = vehicleData[mk.value] ? Object.keys(vehicleData[mk.value]) : [];
      fill(md, models, "Select Model"); fill(yr, [], "Select Year");
    });
    md.addEventListener("change", function () {
      var years = (vehicleData[mk.value] && vehicleData[mk.value][md.value]) || [];
      fill(yr, years, "Select Year");
    });
    document.getElementById("vehicleForm").addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Demo: tìm phụ tùng cho " + mk.value + " / " + md.value + " / " + yr.value);
    });
  }

  /* 6. Newsletter fake */
  var nl = document.getElementById("newsletterForm");
  if (nl) nl.addEventListener("submit", function (e) {
    e.preventDefault();
    nl.innerHTML = "<strong>Cảm ơn bạn đã đăng ký! Mã giảm 30%: DEMO30</strong>";
  });
})();
