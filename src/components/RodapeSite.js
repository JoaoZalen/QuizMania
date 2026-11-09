// Rodapé: faixa de chamada com capas reais, colunas de navegação e barra final.
import * as api from '../services/api.js';
import { atualizarEstado } from '../store/estado.js';
import { navegar, rotaAtual } from '../router/index.js';
import { $, $$, esc } from '../utils/dom.js';
import { capaDoQuiz } from '../utils/imagens.js';
import { ICONES } from '../utils/icones.js';
import { CATEGORIAS } from '../constants/categorias.js';
import LogoMarca from './LogoMarca.js';

async function montar(el) {
  const quizzes = await api.listarQuizzes();
  const mosaico = [...quizzes].sort((a, b) => b.jogadas - a.jogadas).slice(6, 12); // os 6 seguintes aos do carrossel

  el.innerHTML = `
    <div class="container">
      <section class="rodape-chamada">
        <div class="chamada-texto">
          <p class="sobretitulo">Crie o seu</p>
          <h2>Tem uma ideia de quiz?</h2>
          <p>Personalidade ou certo e errado, com foto em cada pergunta. Leva poucos minutos.</p>
          <div class="chamada-botoes">
            <a class="btn btn-branco btn-grande" href="#/criar">Criar um quiz ${ICONES.seta}</a>
            <a class="btn btn-contorno btn-grande" href="#/entrar?cadastro">Criar conta</a>
          </div>
        </div>
        <div class="chamada-mosaico" aria-hidden="true">
          ${mosaico.map(q => `<a href="#/quiz/${q.id}" tabindex="-1"><img src="${capaDoQuiz(q)}" alt="" loading="lazy"><span>${esc(q.titulo)}</span></a>`).join('')}
        </div>
      </section>

      <div class="rodape-grade">
        <div class="rodape-marca">
          ${LogoMarca()}
          <p>Quizzes de personalidade e de conhecimento feitos por quem joga. Crie, compartilhe e veja quanta gente acerta.</p>
        </div>
        <nav class="rodape-categorias">
          <h4>Categorias</h4>
          <div>${CATEGORIAS.map(c => `<a href="#/" data-cat="${c}">${c}</a>`).join('')}</div>
        </nav>
        <nav>
          <h4>Sua conta</h4>
          <a href="#/entrar">Entrar</a>
          <a href="#/entrar?cadastro">Criar conta</a>
          <a href="#/perfil">Meu perfil</a>
          <a href="#/criar">Criar quiz</a>
        </nav>
        <nav>
          <h4>Sobre</h4>
          <a href="https://commons.wikimedia.org" target="_blank" rel="noopener">Fotos: Wikimedia Commons</a>
          <span>Crédito de cada foto na página do quiz</span>
          <span class="rodape-selo">Protótipo · dados salvos no navegador</span>
        </nav>
      </div>

      <div class="rodape-base">
        <span>© ${new Date().getFullYear()} QuizMania</span>
        <a href="#/" id="voltarTopo">Voltar ao topo ${ICONES.topo}</a>
      </div>
    </div>`;

  $$('[data-cat]', el).forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    atualizarEstado({ categoria: a.dataset.cat, busca: '' });
    const rolar = () => document.getElementById('lista')?.scrollIntoView({ behavior: 'smooth' });
    if (rotaAtual() !== '/') { navegar('/'); setTimeout(rolar, 200); } else rolar();
  }));
  $('#voltarTopo', el).addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

export default { montar };
