(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('menu');
  if (!btn || !nav) return;
  function set(open) {
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  btn.addEventListener('click', function () { set(!nav.classList.contains('is-open')); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { set(false); btn.focus(); }
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
})();
