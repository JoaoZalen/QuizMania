// Tela final do quiz.
import { $, esc, toast } from '../../utils/dom.js';
import { imagem, capaDoQuiz } from '../../utils/imagens.js';

export default function ResultadoQuiz(el, q, res, { aoJogarDeNovo }) {
  const botoes = `<div class="acoes">
    <button class="btn btn-sec" id="denovo">Jogar de novo</button>
    <button class="btn btn-sec" id="copiar">Copiar link</button>
    <a class="btn btn-primario" href="#/">Outros quizzes</a></div>`;

  if (res.tipo === 'personalidade') {
    const v = res.vencedor;
    el.innerHTML = `
      <div class="fim">
        <p class="fim-sobre">Seu resultado</p>
        <img class="fim-img" src="${imagem(v.img) || capaDoQuiz(q)}" alt="">
        <h1>${esc(v.nome)}</h1>
        <p>${esc(v.descricao)}</p>
        ${botoes}
      </div>`;
  } else {
    const pct = Math.round((res.acertos / res.total) * 100);
    const frase = pct === 100 ? 'Gabaritou.' : pct >= 70 ? 'Foi bem.' : pct >= 40 ? 'Na média.' : 'Dá pra melhorar.';
    el.innerHTML = `
      <div class="fim">
        <div class="placar"><b>${res.acertos}</b><span>de ${res.total}</span></div>
        <h1>${frase}</h1>
        <p>Você acertou ${pct}% de “${esc(q.titulo)}”.</p>
        ${botoes}
      </div>`;
  }
  $('#denovo', el).addEventListener('click', aoJogarDeNovo);
  $('#copiar', el).addEventListener('click', () => {
    navigator.clipboard?.writeText(location.href.split('#')[0] + '#/quiz/' + q.id);
    toast('Link copiado');
  });
}
