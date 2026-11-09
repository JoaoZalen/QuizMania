// Carrossel da home: foto ocupando o slide inteiro, texto por cima.
import { $, $$, esc } from '../utils/dom.js';
import { numero, tipoLabel } from '../utils/formatar.js';
import { capaDoQuiz, avatarDe } from '../utils/imagens.js';
import { ICONES } from '../utils/icones.js';

function html(destaques, usuarios) {
  return `
  <section class="carrossel" aria-roledescription="carrossel" aria-label="Quizzes em destaque">
    <div class="carrossel-trilho">${destaques.map((q, i) => `
      <article class="slide" aria-label="${i + 1} de ${destaques.length}">
        <img class="slide-foto" src="${capaDoQuiz(q)}" alt="" ${i ? 'loading="lazy"' : ''}>
        <div class="slide-texto">
          <span class="slide-rotulo"><b>#${i + 1}</b> mais jogado · ${esc(q.categoria)} · ${tipoLabel(q.tipo)}</span>
          <h2>${esc(q.titulo)}</h2>
          <p>${esc(q.descricao)}</p>
          <div class="slide-rodape">
            <a class="btn btn-branco btn-grande" href="#/quiz/${q.id}">Jogar agora ${ICONES.seta}</a>
            <div class="slide-meta">
              <img src="${avatarDe(usuarios[q.autor], q.autor)}" alt="">
              <span>@${esc(q.autor)}<br><small>${q.perguntas.length} perguntas · ${numero(q.jogadas)} jogadas</small></span>
            </div>
          </div>
        </div>
      </article>`).join('')}
    </div>
    <div class="carrossel-controles">
      <div class="carrossel-pontos">${destaques.map((_, i) => `<button data-ir="${i}" aria-label="Ir para o destaque ${i + 1}"><span></span></button>`).join('')}</div>
      <button class="carrossel-seta" data-dir="-1" aria-label="Anterior">${ICONES.esquerda}</button>
      <button class="carrossel-seta" data-dir="1" aria-label="Próximo">${ICONES.direita}</button>
    </div>
  </section>`;
}

// liga os eventos; devolve função de limpeza
function ligar(el, total, intervalo = 6000) {
  const raiz = $('.carrossel', el), trilho = $('.carrossel-trilho', raiz), pontos = $$('[data-ir]', raiz);
  let atual = 0, timer = null, toqueX = null;
  const ir = i => {
    atual = (i + total) % total;
    trilho.style.transform = `translateX(-${atual * 100}%)`;
    pontos.forEach((p, k) => p.classList.toggle('ativo', k === atual));
    raiz.style.setProperty('--intervalo', intervalo + 'ms');
  };
  const parar = () => { clearInterval(timer); raiz.classList.add('pausado'); };
  const tocar = () => { clearInterval(timer); raiz.classList.remove('pausado'); timer = setInterval(() => ir(atual + 1), intervalo); };
  raiz.addEventListener('click', e => {
    const s = e.target.closest('[data-dir]'), p = e.target.closest('[data-ir]');
    if (s) { ir(atual + +s.dataset.dir); tocar(); }
    if (p) { ir(+p.dataset.ir); tocar(); }
  });
  raiz.addEventListener('mouseenter', parar);
  raiz.addEventListener('mouseleave', tocar);
  trilho.addEventListener('touchstart', e => { toqueX = e.touches[0].clientX; parar(); }, { passive: true });
  trilho.addEventListener('touchend', e => {
    if (toqueX !== null) { const d = e.changedTouches[0].clientX - toqueX; if (Math.abs(d) > 40) ir(atual + (d < 0 ? 1 : -1)); }
    toqueX = null; tocar();
  });
  ir(0); tocar();
  return () => clearInterval(timer);
}

export default { html, ligar };
