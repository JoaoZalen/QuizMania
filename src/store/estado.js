// Estado compartilhado entre componentes (no Vue isso vira uma store Pinia).
// Hoje guarda o filtro da home, que o header (busca) e o footer (categorias) também alteram.
const ouvintes = new Set();

export const estado = { busca: '', categoria: '' };

export function atualizarEstado(parcial) {
  Object.assign(estado, parcial);
  ouvintes.forEach(fn => fn(estado));
}

// retorna uma função para parar de observar
export function observarEstado(fn) {
  ouvintes.add(fn);
  return () => ouvintes.delete(fn);
}
