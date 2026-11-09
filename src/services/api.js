// Camada de "API" do QuizMania.
// Hoje lê e grava no localStorage. Quando o back-end existir, troque o corpo
// destas funções por chamadas HTTP (fetch/axios) mantendo os mesmos nomes e retornos.
import { storage } from './storage.js';

const uid = () => Math.random().toString(36).slice(2, 9);
const erro = msg => { throw new Error(msg); };

// ---------- quizzes ----------
export async function listarQuizzes() {
  return storage.get('quizzes', []);
}

export async function buscarQuiz(id) {
  return (await listarQuizzes()).find(q => q.id === id) || null;
}

export async function salvarQuiz(quiz) {
  const autor = usuarioLogado() || erro('Entre na sua conta para salvar');
  const lista = await listarQuizzes();
  const i = lista.findIndex(q => q.id === quiz.id);
  if (i >= 0) {
    if (lista[i].autor !== autor) erro('Você só pode editar seus próprios quizzes');
    lista[i] = quiz;
  } else {
    Object.assign(quiz, { id: uid(), autor, jogadas: 0, criado: Date.now() });
    lista.unshift(quiz);
  }
  if (!storage.set('quizzes', lista)) erro('Sem espaço para salvar. Tente imagens menores.');
  return quiz;
}

export async function apagarQuiz(id) {
  const autor = usuarioLogado();
  storage.set('quizzes', (await listarQuizzes()).filter(q => !(q.id === id && q.autor === autor)));
}

export async function registrarJogada(id, registro) {
  const lista = await listarQuizzes(), alvo = lista.find(q => q.id === id);
  if (alvo) { alvo.jogadas++; storage.set('quizzes', lista); }
  const u = usuarioLogado();
  if (u) {
    const hist = storage.get('hist_' + u, []);
    hist.unshift({ id, ...registro, quando: Date.now() });
    storage.set('hist_' + u, hist.slice(0, 50));
  }
}

export async function historico(usuario) {
  return storage.get('hist_' + usuario, []);
}

// ---------- usuários ----------
const semSenha = ({ senha, ...resto }) => resto;

export async function listarUsuarios() {
  return storage.get('usuarios', []).map(semSenha);
}

// mapa { usuario: dados } para montar cards e listas sem buscar um por um
export async function mapaUsuarios() {
  return Object.fromEntries((await listarUsuarios()).map(u => [u.user, u]));
}

export async function buscarUsuario(user) {
  return (await listarUsuarios()).find(u => u.user === user) || null;
}

export async function cadastrar({ user, senha }) {
  const lista = storage.get('usuarios', []);
  if (lista.some(u => u.user === user)) erro('Esse nome de usuário já está em uso');
  // protótipo: senha em texto puro. No back-end real a senha vai com hash (ex.: password_hash no PHP).
  lista.push({ user, senha, nome: '', bio: '', avatar: Math.floor(Math.random() * 12), criado: Date.now() });
  storage.set('usuarios', lista);
  storage.set('sessao', user);
}

export async function entrar({ user, senha }) {
  const conta = storage.get('usuarios', []).find(u => u.user === user);
  if (!conta || conta.senha !== senha) erro('Usuário ou senha incorretos');
  storage.set('sessao', user);
}

export async function sair() {
  storage.set('sessao', null);
}

export function usuarioLogado() {
  return storage.get('sessao', null);
}

export async function atualizarPerfil(dados) {
  const u = usuarioLogado() || erro('Sessão expirada');
  const lista = storage.get('usuarios', []);
  Object.assign(lista.find(x => x.user === u), dados);
  if (!storage.set('usuarios', lista)) erro('Sem espaço para salvar a foto. Tente uma menor.');
}
