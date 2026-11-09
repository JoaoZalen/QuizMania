// Perfil público (/u/:usuario) e histórico (/u/:usuario/historico, só o dono vê).
import * as api from '../services/api.js';
import { navegar } from '../router/index.js';
import { $, esc, toast } from '../utils/dom.js';
import { numero, tempo } from '../utils/formatar.js';
import { avatarDe, capaDoQuiz } from '../utils/imagens.js';
import CardQuiz from '../components/CardQuiz.js';

async function montar(el, { usuario, aba = 'quizzes' }) {
  const dados = await api.buscarUsuario(usuario);
  if (!dados) { el.innerHTML = `<p class="vazio">Usuário não encontrado.</p>`; return; }
  const meu = api.usuarioLogado() === usuario;
  const [todos, usuarios, hist] = await Promise.all([api.listarQuizzes(), api.mapaUsuarios(), meu ? api.historico(usuario) : []]);
  const criados = todos.filter(q => q.autor === usuario).sort((a, b) => b.criado - a.criado);
  const recebidas = criados.reduce((s, q) => s + q.jogadas, 0);

  el.innerHTML = `
    <section class="perfil">
      <div class="perfil-faixa"></div>
      <div class="perfil-cab">
        <img class="perfil-avatar" src="${avatarDe(dados)}" alt="">
        <div class="perfil-nome">
          <h1>${esc(dados.nome || dados.user)}</h1>
          <span>@${esc(dados.user)} · entrou ${tempo(dados.criado)}</span>
          ${dados.bio ? `<p>${esc(dados.bio)}</p>` : meu ? `<p class="apagado">Sem bio ainda.</p>` : ''}
        </div>
        ${meu ? `<div class="perfil-acoes"><a class="btn btn-sec" href="#/perfil/editar">Editar perfil</a><button class="btn btn-mini" id="sair">Sair</button></div>` : ''}
      </div>
      <div class="numeros">
        <div><b>${criados.length}</b><span>quizzes</span></div>
        <div><b>${numero(recebidas)}</b><span>jogadas nos quizzes</span></div>
        ${meu ? `<div><b>${hist.length}</b><span>quizzes jogados</span></div>` : ''}
      </div>
    </section>
    ${meu
      ? `<div class="abas abas-linha"><a class="aba ${aba !== 'historico' ? 'ativo' : ''}" href="#/u/${esc(usuario)}">Meus quizzes</a><a class="aba ${aba === 'historico' ? 'ativo' : ''}" href="#/u/${esc(usuario)}/historico">Histórico</a></div>`
      : `<h2 class="secao-titulo">Quizzes de @${esc(usuario)}</h2>`}
    <div id="conteudoPerfil"></div>`;

  const alvo = $('#conteudoPerfil', el);
  if (aba === 'historico' && meu) {
    alvo.innerHTML = hist.length ? `<ul class="historico">${hist.map(h => {
      const q = todos.find(x => x.id === h.id); if (!q) return '';
      return `<li><a href="#/quiz/${q.id}"><img src="${capaDoQuiz(q)}" alt=""><span><b>${esc(q.titulo)}</b><small>${tempo(h.quando)}</small></span>
        <em>${h.resultado ? esc(h.resultado) : `${h.acertos}/${h.total}`}</em></a></li>`;
    }).join('')}</ul>` : `<p class="vazio">Você ainda não jogou nenhum quiz. <a href="#/">Ver quizzes</a></p>`;
  } else {
    alvo.innerHTML = criados.length
      ? `<div class="grade">${criados.map(q => CardQuiz(q, usuarios, { dono: meu })).join('')}</div>`
      : meu ? `<div class="vazio-grande"><h3>Você ainda não criou nenhum quiz</h3><a class="btn btn-primario" href="#/criar">Criar meu primeiro quiz</a></div>`
            : `<p class="vazio">@${esc(usuario)} ainda não publicou quizzes.</p>`;
  }

  alvo.addEventListener('click', async e => {
    const b = e.target.closest('[data-apagar]'); if (!b) return;
    if (!confirm('Apagar este quiz? Não dá pra desfazer.')) return;
    await api.apagarQuiz(b.dataset.apagar);
    toast('Quiz apagado');
    b.closest('.card').remove();
  });
  if (meu) $('#sair', el).addEventListener('click', async () => { await api.sair(); navegar('/'); });
}

export default { montar };
