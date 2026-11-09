// Lista lateral com os criadores cujos quizzes têm mais jogadas.
import { esc } from '../utils/dom.js';
import { numero } from '../utils/formatar.js';
import { avatarDe } from '../utils/imagens.js';

export default function RankingCriadores(quizzes, usuarios, limite = 8) {
  const totais = quizzes.reduce((m, q) => ((m[q.autor] = (m[q.autor] || 0) + q.jogadas), m), {});
  const top = Object.entries(totais).sort((a, b) => b[1] - a[1]).slice(0, limite);
  return `<div class="bloco-lateral">
    <h3>Criadores em alta</h3>
    <ol class="ranking">${top.map(([u, total], i) => `
      <li><span class="pos">${i + 1}</span>
        <a href="#/u/${esc(u)}"><img src="${avatarDe(usuarios[u], u)}" alt=""><span><b>${esc(usuarios[u]?.nome || u)}</b><small>@${esc(u)}</small></span></a>
        <em>${numero(total)}</em></li>`).join('')}
    </ol>
  </div>`;
}
