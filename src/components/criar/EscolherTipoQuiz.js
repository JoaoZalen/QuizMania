// Primeiro passo do criador: escolher o tipo do quiz.
import { FOTOS } from '../../data/fotos.js';
import { $ } from '../../utils/dom.js';

export default function EscolherTipoQuiz(el, aoEscolher) {
  const foto = (...chaves) => chaves.map(k => FOTOS[k]?.[0]?.u).find(Boolean) || '';
  el.innerHTML = `
    <div class="cab-pagina"><div><p class="sobretitulo">Novo quiz</p><h1>Que tipo de quiz você quer criar?</h1></div></div>
    <div class="tipos">
      <button class="tipo" data-t="personalidade">
        <img src="${foto('p1-0', 'pc1', 'bichos')}" alt="">
        <div><h2>Personalidade</h2><p>Cada resposta conta ponto para um resultado. No fim a pessoa descobre “qual herói ela seria”, “que bicho combina com ela” e por aí vai.</p></div>
      </button>
      <button class="tipo" data-t="acerto">
        <img src="${foto('ciencia', 'mundo')}" alt="">
        <div><h2>Certo ou errado</h2><p>Perguntas com uma resposta correta. A pessoa vê na hora se acertou e termina com uma nota.</p></div>
      </button>
    </div>`;
  $('.tipos', el).addEventListener('click', e => {
    const b = e.target.closest('[data-t]');
    if (b) aoEscolher(b.dataset.t);
  });
}
