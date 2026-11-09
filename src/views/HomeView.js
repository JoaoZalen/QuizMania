// Tela inicial: carrossel, categorias, lista paginada de quizzes e lateral.
import * as api from '../services/api.js';
import { estado, atualizarEstado, observarEstado } from '../store/estado.js';
import { $, $$, esc } from '../utils/dom.js';
import { numero } from '../utils/formatar.js';
import CardQuiz from '../components/CardQuiz.js';
import CarrosselDestaques from '../components/CarrosselDestaques.js';
import ListaCategorias from '../components/ListaCategorias.js';
import RankingCriadores from '../components/RankingCriadores.js';
import BlocoCriarQuiz from '../components/BlocoCriarQuiz.js';
import Paginacao from '../components/Paginacao.js';

const POR_PAGINA = 50;
const ORDENS = {
  populares: (a, b) => b.jogadas - a.jogadas,
  novos: (a, b) => b.criado - a.criado,
  curtos: (a, b) => a.perguntas.length - b.perguntas.length,
  longos: (a, b) => b.perguntas.length - a.perguntas.length,
};
const TIPOS = [['', 'Todos'], ['personalidade', 'Personalidade'], ['acerto', 'Certo ou errado']];

async function montar(el) {
  const [quizzes, usuarios] = await Promise.all([api.listarQuizzes(), api.mapaUsuarios()]);
  const destaques = [...quizzes].sort(ORDENS.populares).slice(0, 6);
  let ordem = 'populares', tipo = '', pagina = 1;

  el.innerHTML = `
    ${CarrosselDestaques.html(destaques, usuarios)}
    <section id="categorias" class="secao">
      <div class="secao-cab"><div><p class="sobretitulo">Explore</p><h2>Categorias</h2></div></div>
      <div id="listaCategorias"></div>
    </section>
    <div class="home-colunas">
      <section id="lista" class="secao">
        <div class="secao-cab">
          <div><p class="sobretitulo" id="contagem"></p><h2 id="tituloLista"></h2></div>
          <button class="btn btn-mini" id="limpar" hidden>Limpar filtros ×</button>
        </div>
        <div class="barra-filtros">
          <div class="segmentado" id="tipos">${TIPOS.map(([v, t]) => `<button data-tipo="${v}">${t}</button>`).join('')}</div>
          <label class="ordenar">Ordenar por
            <select id="ordem">
              <option value="populares">Mais jogados</option><option value="novos">Mais novos</option>
              <option value="curtos">Mais curtos</option><option value="longos">Mais longos</option>
            </select></label>
        </div>
        <div class="grade" id="grade"></div>
        <div id="paginacao"></div>
      </section>
      <aside class="lateral">
        ${RankingCriadores(quizzes, usuarios)}
        ${BlocoCriarQuiz()}
      </aside>
    </div>`;

  const pararCarrossel = CarrosselDestaques.ligar(el, destaques.length);

  const desenhar = () => {
    const termo = estado.busca.toLowerCase().replace(/^@/, '');
    const lista = quizzes
      .filter(q => !estado.categoria || q.categoria === estado.categoria)
      .filter(q => !tipo || q.tipo === tipo)
      .filter(q => !termo || `${q.titulo} ${q.autor} ${q.categoria}`.toLowerCase().includes(termo))
      .sort(ORDENS[ordem]);
    const paginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
    pagina = Math.min(pagina, paginas);
    const inicio = (pagina - 1) * POR_PAGINA;

    $('#tituloLista', el).textContent = termo ? `Resultados para “${estado.busca}”` : estado.categoria || 'Todos os quizzes';
    $('#contagem', el).textContent = lista.length
      ? `${numero(lista.length)} quizzes${paginas > 1 ? ` · mostrando ${inicio + 1}–${Math.min(inicio + POR_PAGINA, lista.length)}` : ''}`
      : 'Nenhum resultado';
    $('#limpar', el).hidden = !termo && !estado.categoria && !tipo;
    $$('#tipos button', el).forEach(b => b.classList.toggle('ativo', b.dataset.tipo === tipo));
    $('#grade', el).innerHTML = lista.length
      ? lista.slice(inicio, inicio + POR_PAGINA).map(q => CardQuiz(q, usuarios)).join('')
      : `<p class="vazio">Nenhum quiz encontrado${termo ? ` para “${esc(estado.busca)}”` : ''}.</p>`;
    $('#paginacao', el).innerHTML = Paginacao(pagina, paginas);
    $('#listaCategorias', el).innerHTML = ListaCategorias(quizzes, estado.categoria);
  };
  const irParaLista = () => $('#lista', el).scrollIntoView({ behavior: 'smooth' });

  $('#listaCategorias', el).addEventListener('click', e => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    atualizarEstado({ categoria: estado.categoria === b.dataset.cat ? '' : b.dataset.cat });
    irParaLista();
  });
  $('#tipos', el).addEventListener('click', e => {
    const b = e.target.closest('[data-tipo]'); if (!b) return;
    tipo = b.dataset.tipo; pagina = 1; desenhar();
  });
  $('#ordem', el).addEventListener('change', e => { ordem = e.target.value; pagina = 1; desenhar(); });
  $('#paginacao', el).addEventListener('click', e => {
    const b = e.target.closest('[data-pag]'); if (!b || b.disabled) return;
    pagina = +b.dataset.pag; desenhar(); irParaLista();
  });
  $('#limpar', el).addEventListener('click', () => {
    const busca = document.getElementById('buscaTopo'); if (busca) busca.value = '';
    tipo = '';
    atualizarEstado({ busca: '', categoria: '' });
  });

  const pararObservar = observarEstado(() => {
    pagina = 1; desenhar();
    if (estado.busca) irParaLista();
  });
  desenhar();

  return () => { pararCarrossel(); pararObservar(); };
}

export default { montar };
