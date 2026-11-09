// Layout principal (equivale ao App.vue): cabeçalho, área das telas e rodapé.
import CabecalhoSite from './components/CabecalhoSite.js';
import RodapeSite from './components/RodapeSite.js';
import { iniciarRouter } from './router/index.js';
import { $ } from './utils/dom.js';

export function montarApp(el) {
  el.innerHTML = `
    <header class="topo" id="cabecalho"></header>
    <main class="container" id="conteudo"></main>
    <footer class="rodape" id="rodape"></footer>
    <div id="toast" class="toast" role="status"></div>`;
  CabecalhoSite.montar($('#cabecalho'));
  RodapeSite.montar($('#rodape'));
  iniciarRouter($('#conteudo'), caminho => CabecalhoSite.atualizar(caminho));
}
