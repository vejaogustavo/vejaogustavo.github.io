(function () {
  var dlg = document.getElementById('reader');
  if (!dlg || typeof dlg.showModal !== 'function') return; /* sem suporte: o botão abre a carta na própria página */
  var cards = Array.prototype.slice.call(document.querySelectorAll('.carta'));
  var eyebrow = document.getElementById('r-eyebrow');
  var title = document.getElementById('r-title');
  var body = document.getElementById('r-body');
  var count = document.getElementById('r-count');
  var scroll = document.getElementById('r-scroll');
  var live = document.getElementById('r-live');
  var cur = 0;

  function wrap(i) { return (i + cards.length) % cards.length; }

  function show(i) {
    cur = wrap(i);
    var c = cards[cur];
    var t = c.querySelector('h3').textContent;
    eyebrow.textContent = c.querySelector('.eyebrow').textContent;
    title.textContent = t;
    body.innerHTML = c.querySelector('.carta-body').innerHTML;
    count.textContent = 'Carta ' + (cur + 1) + ' de ' + cards.length;
    scroll.scrollTop = 0;
    live.textContent = t + ', carta ' + (cur + 1) + ' de ' + cards.length;
    try { history.replaceState(null, '', '#carta-' + c.dataset.id); } catch (e) {}
  }
  function open(i) {
    show(i);
    if (!dlg.open) dlg.showModal();
    document.documentElement.classList.add('v-open');
  }

  cards.forEach(function (c, i) {
    c.querySelector('summary').addEventListener('click', function (e) { e.preventDefault(); open(i); });
  });
  document.getElementById('r-prev').addEventListener('click', function () { show(cur - 1); });
  document.getElementById('r-next').addEventListener('click', function () { show(cur + 1); });
  document.getElementById('r-close').addEventListener('click', function () { dlg.close(); });
  /* clicar na área escura em volta da janela também fecha */
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1); }
  });
  dlg.addEventListener('close', function () {
    document.documentElement.classList.remove('v-open');
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  });
  /* link direto para uma carta: cartas.html#carta-tias (ao carregar e ao mudar o #) */
  function fromHash() {
    if (location.hash.indexOf('#carta-') !== 0) return;
    var id = location.hash.slice(7);
    cards.forEach(function (c, i) { if (c.dataset.id === id && !(dlg.open && cur === i)) open(i); });
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
