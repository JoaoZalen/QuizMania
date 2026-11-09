// Blocos de categoria da home (foto + nome + quantidade).
import { CATEGORIAS, fotoCategoria } from '../constants/categorias.js';

export default function ListaCategorias(quizzes, ativa = '') {
  const conta = c => quizzes.filter(q => q.categoria === c).length;
  return `<div class="categorias">${CATEGORIAS.map(c => `
    <button class="categoria ${ativa === c ? 'ativo' : ''}" data-cat="${c}">
      <img src="${fotoCategoria(c)}" alt="" loading="lazy">
      <span><b>${c}</b><small>${conta(c)} quizzes</small></span>
    </button>`).join('')}</div>`;
}
