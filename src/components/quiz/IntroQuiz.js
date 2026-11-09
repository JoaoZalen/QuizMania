// Apresentação do quiz antes de começar.
import { $, esc } from '../../utils/dom.js';
import { numero, tempo, tipoLabel } from '../../utils/formatar.js';
import { capaDoQuiz, avatarDe } from '../../utils/imagens.js';
import CreditoFoto from '../CreditoFoto.js';

export default function IntroQuiz(el, q, autor, aoComecar) {
  el.innerHTML = `
    <div class="intro">
      <figure class="intro-capa"><img src="${capaDoQuiz(q)}" alt="">${CreditoFoto(q.credito)}</figure>
      <div class="intro-info">
        <span class="selo ${q.tipo} estatico">${tipoLabel(q.tipo)} · ${esc(q.categoria)}</span>
        <h1>${esc(q.titulo)}</h1>
        <p>${esc(q.descricao)}</p>
        <a class="autor autor-grande" href="#/u/${esc(q.autor)}"><img src="${avatarDe(autor, q.autor)}" alt="">
          <span><b>${esc(autor?.nome || '@' + q.autor)}</b><small>@${esc(q.autor)} · ${tempo(q.criado)}</small></span></a>
        <div class="intro-numeros"><span><b>${q.perguntas.length}</b> perguntas</span><span><b>${numero(q.jogadas)}</b> jogadas</span></div>
        <button class="btn btn-primario btn-grande" id="comecar">Começar</button>
      </div>
    </div>`;
  $('#comecar', el).addEventListener('click', aoComecar);
}
