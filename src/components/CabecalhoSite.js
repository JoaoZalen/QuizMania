// Cabeçalho: logo, menu, busca e conta do usuário.
import * as api from '../services/api.js';
import { atualizarEstado } from '../store/estado.js';
import { navegar, rotaAtual } from '../router/index.js';
import { $, $$, esc } from '../utils/dom.js';
import { ICONES } from '../utils/icones.js';
import { avatarDe } from '../utils/imagens.js';
import LogoMarca from './LogoMarca.js';

let el;

function montar(alvo) {
  el = alvo;
  el.innerHTML = `
    <div class="container topo-inner">
      ${LogoMarca()}
      <nav class="menu" aria-label="Principal">
        <a href="#/" data-menu="/">Explorar</a>
        <a href="#/" data-rolar="categorias">Categorias</a>
        <a href="#/criar" data-menu="/criar">Criar quiz</a>
      </nav>
      <label class="busca-topo">${ICONES.busca}
        <input id="buscaTopo" type="search" placeholder="Buscar quizzes ou @usuários" autocomplete="off">
      </label>
      <div class="conta" id="conta"></div>
    </div>`;

  let espera;
  $('#buscaTopo', el).addEventListener('input', e => {
    clearTimeout(espera);
    espera = setTimeout(() => {
      atualizarEstado({ busca: e.target.value.trim() });
      if (rotaAtual() !== '/') navegar('/');
    }, 200);
  });
  $('[data-rolar]', el).addEventListener('click', e => {
    e.preventDefault();
    const rolar = () => document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' });
    if (rotaAtual() !== '/') { navegar('/'); setTimeout(rolar, 150); } else rolar();
  });
}

async function atualizar(caminho = rotaAtual()) {
  const u = api.usuarioLogado();
  const dados = u && await api.buscarUsuario(u);
  $('#conta', el).innerHTML = u
    ? `<a href="#/criar" class="btn btn-primario esconde-mobile">Criar quiz</a>
       <a href="#/u/${esc(u)}" class="nav-avatar" title="Meu perfil"><img src="${avatarDe(dados, u)}" alt=""><span>@${esc(u)}</span></a>`
    : `<a class="nav-link" href="#/entrar">Entrar</a><a class="btn btn-primario" href="#/entrar?cadastro">Criar conta</a>`;
  $$('[data-menu]', el).forEach(a => a.classList.toggle('ativo', a.dataset.menu === caminho));
  if (caminho !== '/') $('#buscaTopo', el).value = '';
}

export default { montar, atualizar };
