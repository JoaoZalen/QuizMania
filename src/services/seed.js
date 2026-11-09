// Popula o localStorage com os quizzes de exemplo (só na primeira visita ou quando a versão muda).
import { storage } from './storage.js';
import { gerar } from '../data/exemplos.js';

const VERSAO = 7;

export function semear() {
  if (storage.get('versao') === VERSAO) return;
  const { usuarios: autores, quizzes: exemplos } = gerar();
  const nomes = new Set(autores.map(a => a.user));
  // mantém contas e quizzes criados pelos próprios usuários
  const contas = storage.get('usuarios', []).filter(u => !nomes.has(u.user));
  const proprios = storage.get('quizzes', []).filter(q => q.tipo && !/^s\d+$/.test(q.id) && !['herois', 'brasil', 'games', 'pizza', 'musica'].includes(q.id));
  storage.set('usuarios', [...autores, ...contas]);
  storage.set('quizzes', [...proprios, ...exemplos]);
  storage.set('versao', VERSAO);
}
