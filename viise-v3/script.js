(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle) {
    toggle.onclick = function () {
      var open = nav.className.indexOf('open') !== -1;
      nav.className = open ? 'main-nav' : 'main-nav open';
      nav.style.display = open ? '' : 'flex';
      nav.style.position = 'absolute'; nav.style.top = '64px'; nav.style.left = '0'; nav.style.right = '0'; nav.style.padding = '12px'; nav.style.background = '#fff'; nav.style.flexDirection = 'column'; nav.style.boxShadow = '0 8px 20px rgba(0,0,0,.12)';
    };
  }
  var links = document.querySelectorAll('.main-nav a');
  for (var i = 0; i < links.length; i++) {
    links[i].onclick = function () { if (window.innerWidth < 761) { nav.className = 'main-nav'; nav.style.display = ''; } };
  }
  var reveal = document.querySelectorAll('.section, .cta');
  for (var j = 0; j < reveal.length; j++) { reveal[j].style.opacity = '0'; reveal[j].style.transform = 'translateY(18px)'; reveal[j].style.transition = 'opacity .7s ease, transform .7s ease'; }
  function show() { for (var k = 0; k < reveal.length; k++) { var top = reveal[k].getBoundingClientRect().top; if (top < window.innerHeight - 70) { reveal[k].style.opacity = '1'; reveal[k].style.transform = 'translateY(0)'; } } }
  window.onscroll = show; show();
}());
