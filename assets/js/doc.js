/* Ecossistema do Lucro · comportamento dos documentos
   Índice recolhível (desktop) e gaveta (celular), seção ativa,
   tabelas empilhadas no celular, guarda de Anisette e calculadora. */
(function () {
  var body = document.body;
  var shell = document.getElementById('shell');
  var indice = document.getElementById('indice');
  if (!shell || !indice) return;

  var mq = window.matchMedia('(max-width: 960px)');
  var CHAVE = 'ecl-indice-recolhido';
  function guarda(v) { try { localStorage.setItem(CHAVE, v); } catch (e) {} }
  function le() { try { return localStorage.getItem(CHAVE); } catch (e) { return null; } }

  function setRecolhido(v) {
    shell.classList.toggle('recolhido', v);
    body.classList.toggle('recolhido', v && !mq.matches);
    guarda(v ? '1' : '0');
  }
  if (le() === '1' && !mq.matches) setRecolhido(true);

  var btnAbrir = document.querySelector('[data-abrir]');
  function abrir() {
    if (!mq.matches) { setRecolhido(false); return; }
    body.classList.add('gaveta-aberta');
    if (btnAbrir) btnAbrir.setAttribute('aria-expanded', 'true');
    var f = indice.querySelector('.indice__lista a.ativo') || indice.querySelector('.indice__lista a');
    if (f) { try { f.focus({ preventScroll: true }); } catch (e) {} }
  }
  function fechar() {
    if (!body.classList.contains('gaveta-aberta')) return;
    body.classList.remove('gaveta-aberta');
    if (btnAbrir) btnAbrir.setAttribute('aria-expanded', 'false');
  }
  if (btnAbrir) btnAbrir.addEventListener('click', abrir);
  [].forEach.call(document.querySelectorAll('[data-recolher]'), function (b) {
    b.addEventListener('click', function () { setRecolhido(true); if (btnAbrir) btnAbrir.focus(); });
  });
  [].forEach.call(document.querySelectorAll('[data-fechar]'), function (b) {
    b.addEventListener('click', function () { fechar(); if (btnAbrir) btnAbrir.focus(); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechar(); });
  function aoMudar() {
    fechar();
    body.classList.toggle('recolhido', shell.classList.contains('recolhido') && !mq.matches);
  }
  if (mq.addEventListener) mq.addEventListener('change', aoMudar); else if (mq.addListener) mq.addListener(aoMudar);

  var links = [].slice.call(indice.querySelectorAll('.indice__lista a'));
  links.forEach(function (a) { a.addEventListener('click', function () { if (mq.matches) fechar(); }); });

  /* Seção ativa */
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var rotulo = document.getElementById('topbar-sec');
  function ativa(i) {
    links.forEach(function (l) { l.classList.remove('ativo'); l.removeAttribute('aria-current'); });
    if (i > -1 && links[i]) {
      links[i].classList.add('ativo'); links[i].setAttribute('aria-current', 'true');
      if (rotulo) rotulo.textContent = links[i].querySelector('i').textContent + ' · ' + links[i].querySelector('span').textContent;
    } else if (rotulo) rotulo.textContent = 'Capa';
  }
  if ('IntersectionObserver' in window) {
    var opts = { rootMargin: '-25% 0px -65% 0px' };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) ativa(secs.indexOf(e.target)); });
    }, opts);
    secs.forEach(function (s) { if (s) io.observe(s); });
    var capa = document.querySelector('.capa');
    if (capa) new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) ativa(-1); });
    }, opts).observe(capa);
  }

  /* Tabelas: rótulos para o modo empilhado no celular */
  [].forEach.call(document.querySelectorAll('.tabela'), function (w) {
    var t = w.querySelector('table'); if (!t) return;
    var ths = [].map.call(t.querySelectorAll('thead th'), function (th) { return th.textContent.trim(); });
    w.classList.add('empilha');
    if (ths[0] === 'Nº') w.classList.add('com-num');
    [].forEach.call(t.querySelectorAll('tbody tr'), function (tr) {
      [].forEach.call(tr.children, function (td, i) { if (ths[i]) td.setAttribute('data-rotulo', ths[i]); });
    });
  });

  /* Anisette nunca com números (README §1.5): troca para Host Grotesk */
  [].forEach.call(document.querySelectorAll('.anisette'), function (el) {
    if (/\d/.test(el.textContent)) el.classList.add('numeral');
  });

  /* Gráfico: tecla e toque mostram o valor */
  [].forEach.call(document.querySelectorAll('.barra'), function (b) {
    b.addEventListener('click', function () { b.classList.toggle('marcada'); });
  });

  /* Calculadora de mercado */
  var calc = document.getElementById('calc');
  if (calc) {
    var brl = function (v) {
      if (!isFinite(v) || v <= 0) return 'R$ 0';
      var f = function (n, d) { return n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }); };
      if (v >= 1e9) return 'R$ ' + f(v / 1e9, 1) + ' bi';
      if (v >= 1e6) return 'R$ ' + f(v / 1e6, 1) + ' mi';
      if (v >= 1e3) return 'R$ ' + f(v / 1e3, 0) + ' mil';
      return 'R$ ' + f(v, 0);
    };
    var linhas = [].slice.call(calc.querySelectorAll('[data-linha]'));
    var num = function (el) { var n = parseFloat(String(el.value).replace(',', '.')); return isFinite(n) && n > 0 ? n : 0; };
    var calcula = function () {
      var t = 0, s = 0;
      linhas.forEach(function (r) {
        var inp = r.querySelectorAll('input');
        var tam = num(inp[0]) * num(inp[1]);
        var som = tam * num(inp[2]) / 100;
        var cli = Math.round(num(inp[0]) * num(inp[2]) / 100);
        r.querySelector('[data-tam]').innerHTML = '<span>' + brl(tam) + '<small>' + num(inp[0]).toLocaleString('pt-BR') + ' empresas</small></span>';
        r.querySelector('[data-som]').innerHTML = '<span>' + brl(som) + '<small>' + cli.toLocaleString('pt-BR') + ' clientes</small></span>';
        t += tam; s += som;
      });
      document.getElementById('tam-total').innerHTML = '<span>' + brl(t) + '</span>';
      document.getElementById('som-total').innerHTML = '<span>' + brl(s) + '</span>';
    };
    linhas.forEach(function (r) { [].forEach.call(r.querySelectorAll('input'), function (i) { i.addEventListener('input', calcula); }); });
    calcula();
  }
})();
