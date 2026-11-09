// Entrar / criar conta.
import * as api from '../services/api.js';
import { navegar } from '../router/index.js';
import { $, $$, toast } from '../utils/dom.js';

async function montar(el, _params, query) {
  if (api.usuarioLogado()) return navegar('/');
  let cadastro = query.has('cadastro');

  el.innerHTML = `
    <div class="caixa">
      <div class="abas"><button class="aba" data-m="0">Entrar</button><button class="aba" data-m="1">Criar conta</button></div>
      <h1 class="caixa-titulo" id="titulo"></h1>
      <form id="form">
        <div class="campo"><label for="user">Nome de usuário</label>
          <input id="user" name="user" required minlength="3" maxlength="20" pattern="[a-zA-Z0-9_.]+" autocomplete="username" placeholder="ex: joao_quiz">
          <small id="dica"></small></div>
        <div class="campo"><label for="senha">Senha</label>
          <input id="senha" name="senha" type="password" required minlength="4" autocomplete="current-password"></div>
        <button class="btn btn-primario btn-bloco" id="enviar"></button>
      </form>
      <p class="aviso">Protótipo: a conta fica salva só neste navegador.</p>
    </div>`;

  const atualizar = () => {
    $$('.aba', el).forEach(a => a.classList.toggle('ativo', +a.dataset.m === +cadastro));
    $('#titulo', el).textContent = cadastro ? 'Crie sua conta' : 'Bem-vindo de volta';
    $('#enviar', el).textContent = cadastro ? 'Criar minha conta' : 'Entrar';
    $('#dica', el).textContent = cadastro ? 'Letras, números, ponto e _. É assim que vão te achar.' : '';
  };
  $('.abas', el).addEventListener('click', e => { if (e.target.dataset.m) { cadastro = e.target.dataset.m === '1'; atualizar(); } });
  $('#form', el).addEventListener('submit', async e => {
    e.preventDefault();
    const dados = { user: e.target.user.value.trim().toLowerCase(), senha: e.target.senha.value };
    try {
      await (cadastro ? api.cadastrar(dados) : api.entrar(dados));
      navegar(cadastro ? '/criar' : '/');
    } catch (err) { toast(err.message); }
  });
  atualizar();
}

export default { montar };
