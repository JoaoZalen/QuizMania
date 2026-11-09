// Tela de perguntas. Chama aoTerminar({ tipo, acertos, total, vencedor, registro }).
import { $, $$, esc } from '../../utils/dom.js';
import { htmlMidia, midiaDaPergunta } from '../../utils/midia.js';
import { CORES_ALTERNATIVA, LETRAS } from '../../constants/categorias.js';

export default function JogoQuiz(el, q, { aoSair, aoTerminar }) {
  const pers = q.tipo === 'personalidade', total = q.perguntas.length;
  let i = 0, acertos = 0;
  const pontos = {};

  function mostrar() {
    const p = q.perguntas[i], ultima = i === total - 1;
    el.innerHTML = `
      <div class="jogo">
        <div class="jogo-topo">
          <button class="btn btn-mini" id="sair">Sair</button>
          <div class="progresso" role="progressbar" aria-valuenow="${i}" aria-valuemax="${total}"><div style="width:${(i / total) * 100}%"></div></div>
          <span class="contador">${i + 1}/${total}</span>
        </div>
        <h2 class="pergunta">${esc(p.texto)}</h2>
        ${htmlMidia(midiaDaPergunta(p), { classe: 'pergunta-midia', credito: true })}
        <div class="alternativas n${p.opcoes.length}">${p.opcoes.map((o, j) => `
          <button class="alt ${CORES_ALTERNATIVA[j]}" data-j="${j}"><span class="letra">${LETRAS[j]}</span><span>${esc(o.texto)}</span></button>`).join('')}
        </div>
        <div class="feedback" aria-live="polite"></div>
      </div>`;

    $('#sair', el).addEventListener('click', aoSair);
    $('.alternativas', el).addEventListener('click', e => {
      const b = e.target.closest('.alt'); if (!b || b.disabled) return;
      const j = +b.dataset.j;
      const avancar = () => (ultima ? fim() : (i++, mostrar()));
      $$('.alt', el).forEach(a => (a.disabled = true));

      if (pers) {
        const r = p.opcoes[j].r;
        pontos[r] = (pontos[r] || 0) + 1;
        b.classList.add('escolhida');
        setTimeout(avancar, 350);
        return;
      }
      const certo = j === p.certa;
      if (certo) acertos++;
      $$('.alt', el).forEach(a => { const k = +a.dataset.j; a.classList.add(k === p.certa ? 'certa' : k === j ? 'errada' : 'apagada'); });
      $('.feedback', el).innerHTML = `
        <div class="faixa ${certo ? 'ok' : 'erro'}"><b>${certo ? 'Acertou' : 'Errou'}</b>
          ${certo ? '<span></span>' : `<span>Resposta certa: ${esc(p.opcoes[p.certa].texto)}</span>`}
          <button class="btn">${ultima ? 'Ver resultado' : 'Próxima'}</button></div>`;
      $('.feedback button', el).addEventListener('click', avancar);
    });
  }

  function fim() {
    if (pers) {
      const vencedor = q.resultados.reduce((m, r) => ((pontos[r.id] || 0) > (pontos[m.id] || 0) ? r : m), q.resultados[0]);
      aoTerminar({ tipo: 'personalidade', vencedor, registro: { resultado: vencedor.nome } });
    } else {
      aoTerminar({ tipo: 'acerto', acertos, total, registro: { acertos, total } });
    }
  }

  mostrar();
}
