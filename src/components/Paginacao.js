// Paginação numerada: ‹ 1 2 3 … 9 ›
import { ICONES } from '../utils/icones.js';

function numeros(atual, total) {
  const set = new Set([1, total, atual - 1, atual, atual + 1].filter(n => n >= 1 && n <= total));
  const lista = [...set].sort((a, b) => a - b), saida = [];
  lista.forEach((n, i) => { if (i && n - lista[i - 1] > 1) saida.push('…'); saida.push(n); });
  return saida;
}

export default function Paginacao(atual, total) {
  if (total <= 1) return '';
  return `<nav class="paginacao" aria-label="Páginas">
    <button class="pag-seta" data-pag="${atual - 1}" ${atual === 1 ? 'disabled' : ''} aria-label="Página anterior">${ICONES.esquerda}<span>Anterior</span></button>
    <div class="pag-numeros">${numeros(atual, total).map(n => n === '…'
      ? `<span class="pag-reticencias">…</span>`
      : `<button data-pag="${n}" class="${n === atual ? 'ativo' : ''}" ${n === atual ? 'aria-current="page"' : ''}>${n}</button>`).join('')}</div>
    <button class="pag-seta" data-pag="${atual + 1}" ${atual === total ? 'disabled' : ''} aria-label="Próxima página"><span>Próxima</span>${ICONES.direita}</button>
  </nav>`;
}
