(function () {
  var dlg = document.getElementById('viewer');
  if (!dlg || typeof dlg.showModal !== 'function') return; /* sem suporte: o link abre a imagem grande */
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.ftile'));
  var img = document.getElementById('v-img');
  var body = document.getElementById('v-body');
  var count = document.getElementById('v-count');
  var side = document.getElementById('v-side');
  var live = document.getElementById('v-live');
  var cur = 0;

  function wrap(i) { return (i + tiles.length) % tiles.length; }
  function preload(i) { var im = new Image(); im.src = tiles[wrap(i)].getAttribute('href'); }

  function show(i) {
    cur = wrap(i);
    var t = tiles[cur];
    var title = t.querySelector('.ftile-t').textContent;
    img.width = +t.dataset.w; img.height = +t.dataset.h;
    img.alt = t.querySelector('img').alt;
    img.src = t.getAttribute('href');
    body.innerHTML = t.parentNode.querySelector('.legenda').innerHTML;
    count.textContent = 'Foto ' + t.dataset.n + ' de ' + t.dataset.total;
    side.scrollTop = 0;
    live.textContent = title + ', foto ' + t.dataset.n + ' de ' + t.dataset.total + ' da coleção ' + t.dataset.col;
    try { history.replaceState(null, '', '#foto-' + t.dataset.id); } catch (e) {}
    preload(cur + 1); preload(cur - 1);
  }
  function open(i) {
    show(i);
    if (!dlg.open) dlg.showModal();
    document.documentElement.classList.add('v-open');
  }

  tiles.forEach(function (t, i) {
    t.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault(); open(i);
    });
  });
  document.getElementById('v-prev').addEventListener('click', function () { show(cur - 1); });
  document.getElementById('v-next').addEventListener('click', function () { show(cur + 1); });
  document.getElementById('v-close').addEventListener('click', function () { dlg.close(); });
  /* clicar na área escura em volta da foto também fecha */
  document.getElementById('v-stage').addEventListener('click', function (e) { if (e.target === this) dlg.close(); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1); }
  });
  dlg.addEventListener('close', function () {
    document.documentElement.classList.remove('v-open');
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  });
  /* deslizar o dedo para trocar de foto */
  var x0 = null, y0 = null;
  dlg.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  dlg.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > 1.5 * Math.abs(dy) && !e.target.closest('#v-side')) show(dx < 0 ? cur + 1 : cur - 1);
  }, { passive: true });
  /* link direto para uma foto: fotografia.html#foto-spc-3 (ao carregar e ao mudar o #) */
  function fromHash() {
    if (location.hash.indexOf('#foto-') !== 0) return;
    var id = location.hash.slice(6);
    tiles.forEach(function (t, i) { if (t.dataset.id === id && !(dlg.open && cur === i)) open(i); });
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
