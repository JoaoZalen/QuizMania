// Card de quiz usado na home e no perfil.
import { esc } from '../utils/dom.js';
import { numero, tipoLabel } from '../utils/formatar.js';
import { capaDoQuiz, avatarDe } from '../utils/imagens.js';
import { ICONES } from '../utils/icones.js';

export default function CardQuiz(q, usuarios = {}, { dono = false } = {}) {
  return `<article class="card">
    <a href="#/quiz/${q.id}" class="card-capa"><img src="${capaDoQuiz(q)}" alt="" loading="lazy"><span class="selo ${q.tipo}">${tipoLabel(q.tipo)}</span></a>
    <div class="card-corpo">
      <span class="card-cat">${esc(q.categoria)} · ${q.perguntas.length} perguntas</span>
      <a href="#/quiz/${q.id}"><h3>${esc(q.titulo)}</h3></a>
      <div class="meta">
        <a class="autor" href="#/u/${esc(q.autor)}"><img src="${avatarDe(usuarios[q.autor], q.autor)}" alt="">@${esc(q.autor)}</a>
        <span class="jogadas">${ICONES.play} ${numero(q.jogadas)}</span>
      </div>
      ${dono ? `<div class="card-dono"><a class="btn btn-mini" href="#/editar/${q.id}">Editar</a><button class="btn btn-mini btn-perigo" data-apagar="${q.id}" aria-label="Apagar">${ICONES.lixo}</button></div>` : ''}
    </div>
  </article>`;
}
