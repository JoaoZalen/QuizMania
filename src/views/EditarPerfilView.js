// Editar nome, bio e avatar (cor das iniciais ou foto enviada).
import * as api from '../services/api.js';
import { navegar } from '../router/index.js';
import { $, esc, toast } from '../utils/dom.js';
import { avatarIniciais, CORES_AVATAR, lerImagem } from '../utils/imagens.js';

async function montar(el) {
  const u = api.usuarioLogado();
  if (!u) return navegar('/entrar');
  const dados = await api.buscarUsuario(u);
  let avatar = dados.avatar;

  el.innerHTML = `
    <div class="caixa caixa-larga">
      <h1 class="caixa-titulo">Editar perfil</h1>
      <div class="campo"><label>Avatar</label>
        <div class="avatares" id="avatares"></div>
        <label class="btn btn-mini upload-btn">Enviar foto<input type="file" accept="image/*" id="foto"></label></div>
      <div class="campo"><label for="nome">Nome de exibição</label><input id="nome" maxlength="40" value="${esc(dados.nome)}" placeholder="${esc(u)}"></div>
      <div class="campo"><label for="bio">Bio</label><textarea id="bio" maxlength="160" rows="3" placeholder="Conte um pouco sobre você">${esc(dados.bio)}</textarea></div>
      <div class="acoes acoes-fim"><a class="btn btn-sec" href="#/u/${esc(u)}">Cancelar</a><button class="btn btn-primario" id="salvar">Salvar</button></div>
    </div>`;

  const desenhar = () => {
    const nome = $('#nome', el).value || u;
    $('#avatares', el).innerHTML =
      (typeof avatar === 'string' ? `<button type="button" class="av sel" data-a="foto"><img src="${avatar}" alt="Sua foto"></button>` : '') +
      CORES_AVATAR.map((_, i) => `<button type="button" class="av ${i === avatar ? 'sel' : ''}" data-a="${i}"><img src="${avatarIniciais(nome, i)}" alt=""></button>`).join('');
  };
  $('#avatares', el).addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (b && b.dataset.a !== 'foto') { avatar = +b.dataset.a; desenhar(); } });
  $('#nome', el).addEventListener('input', desenhar);
  $('#foto', el).addEventListener('change', async e => { if (e.target.files[0]) { avatar = await lerImagem(e.target.files[0], 300); desenhar(); } });
  $('#salvar', el).addEventListener('click', async () => {
    try {
      await api.atualizarPerfil({ nome: $('#nome', el).value.trim(), bio: $('#bio', el).value.trim(), avatar });
      toast('Perfil atualizado');
      navegar('/u/' + u);
    } catch (err) { toast(err.message); }
  });
  desenhar();
}

export default { montar };
