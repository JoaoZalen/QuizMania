// Editor do quiz: dados gerais, resultados (personalidade) e perguntas.
import * as api from '../../services/api.js';
import { navegar } from '../../router/index.js';
import { $, $$, esc, toast } from '../../utils/dom.js';
import { tipoLabel } from '../../utils/formatar.js';
import { imagem, lerImagem } from '../../utils/imagens.js';
import { ICONES } from '../../utils/icones.js';
import { CATEGORIAS, CORES_ALTERNATIVA, LETRAS } from '../../constants/categorias.js';
import { midiaDaPergunta, midiaDeLink, lerArquivoMidia } from '../../utils/midia.js';
import CampoMidia from './CampoMidia.js';

const uid = () => Math.random().toString(36).slice(2, 9);
const novoResultado = () => ({ id: uid(), nome: '', descricao: '', img: '' });
const novaPergunta = tipo => ({ texto: '', img: '', opcoes: [{ texto: '' }, { texto: '' }, { texto: '' }], certa: tipo === 'acerto' ? 0 : undefined });

export default function EditorQuiz(el, quiz, { editando = false } = {}) {
  const pers = quiz.tipo === 'personalidade';
  el.innerHTML = `
    <div class="cab-pagina">
      <div><span class="selo ${quiz.tipo} estatico">${tipoLabel(quiz.tipo)}</span><h1>${editando ? 'Editar quiz' : 'Novo quiz'}</h1></div>
      <button class="btn btn-primario btn-grande" data-acao="publicar">${editando ? 'Salvar alterações' : 'Publicar'}</button>
    </div>
    <section class="painel painel-info">
      <label class="upload upload-capa" id="capaBox"></label>
      <div class="info-campos">
        <div class="campo"><label for="titulo">Título</label><input id="titulo" maxlength="80" placeholder="${pers ? 'Ex: Qual vilão você seria?' : 'Ex: Capitais da Europa'}"></div>
        <div class="campo"><label for="descricao">Descrição</label><textarea id="descricao" maxlength="200" rows="2" placeholder="Uma frase sobre o quiz"></textarea></div>
        <div class="campo"><label for="categoria">Categoria</label><select id="categoria">${CATEGORIAS.map(c => `<option>${c}</option>`).join('')}</select></div>
      </div>
    </section>
    ${pers ? `<h2 class="secao-titulo">Resultados <small>o que a pessoa pode ser no final</small></h2><div id="resultados" class="resultados-grade"></div>` : ''}
    <h2 class="secao-titulo">Perguntas</h2>
    <div id="perguntas"></div>
    <button class="btn btn-sec btn-bloco" data-acao="addP">Adicionar pergunta</button>`;

  $('#titulo', el).value = quiz.titulo;
  $('#descricao', el).value = quiz.descricao;
  $('#categoria', el).value = quiz.categoria;

  // ---------- desenho ----------
  const desenharCapa = () => {
    $('#capaBox', el).innerHTML = `${quiz.capa ? `<img src="${imagem(quiz.capa)}" alt="">` : `${ICONES.imagem}<span>Foto de capa</span>`}<input type="file" accept="image/*" data-campo="capa">`;
  };
  const desenharResultados = () => {
    if (!pers) return;
    $('#resultados', el).innerHTML = quiz.resultados.map((r, i) => `
      <div class="painel resultado-ed" data-r="${i}">
        <label class="upload upload-quadrado">${r.img ? `<img src="${imagem(r.img)}" alt="">` : `${ICONES.imagem}<span>Foto</span>`}<input type="file" accept="image/*" data-campo="rimg"></label>
        <input data-campo="rnome" value="${esc(r.nome)}" placeholder="Nome do resultado">
        <textarea data-campo="rdesc" rows="2" placeholder="Descrição">${esc(r.descricao)}</textarea>
        ${quiz.resultados.length > 2 ? `<button class="btn btn-mini btn-perigo" data-acao="rmR" aria-label="Remover resultado">${ICONES.lixo}</button>` : ''}
      </div>`).join('') + (quiz.resultados.length < 8 ? `<button class="painel add-resultado" data-acao="addR">+ Resultado</button>` : '');
  };
  const opcoesResultado = sel => quiz.resultados.map((r, k) => `<option value="${r.id}" ${r.id === sel ? 'selected' : ''}>${esc(r.nome || 'Resultado ' + (k + 1))}</option>`).join('');
  const desenharPerguntas = () => {
    $('#perguntas', el).innerHTML = quiz.perguntas.map((p, i) => `
      <section class="painel pergunta-ed" data-i="${i}">
        <div class="painel-cab"><span class="num">${i + 1}</span>
          ${quiz.perguntas.length > 1 ? `<button class="btn btn-mini btn-perigo" data-acao="rmP" aria-label="Remover pergunta">${ICONES.lixo}</button>` : ''}</div>
        <div class="pergunta-topo">
          <textarea data-campo="texto" rows="2" placeholder="Escreva a pergunta">${esc(p.texto)}</textarea>
          ${CampoMidia(midiaDaPergunta(p))}
        </div>
        <p class="dica">${pers ? 'Escolha para qual resultado cada resposta conta ponto.' : 'Marque a resposta certa clicando no círculo.'}</p>
        <div class="opcoes-ed">${p.opcoes.map((o, j) => `
          <div class="opcao-ed ${CORES_ALTERNATIVA[j]} ${!pers && p.certa === j ? 'correta' : ''}" data-j="${j}">
            ${pers ? '' : `<button class="marca" data-acao="certa" title="Marcar como certa" aria-label="Marcar como certa"></button>`}
            <input data-campo="opcao" value="${esc(o.texto)}" placeholder="Resposta ${LETRAS[j]}">
            ${pers ? `<select data-campo="ores" aria-label="Resultado">${opcoesResultado(o.r)}</select>` : ''}
            ${p.opcoes.length > 2 ? `<button class="x" data-acao="rmO" aria-label="Remover resposta">×</button>` : ''}
          </div>`).join('')}</div>
        ${p.opcoes.length < 6 ? `<button class="btn btn-mini" data-acao="addO">+ Resposta</button>` : ''}
      </section>`).join('');
  };

  // ---------- eventos ----------
  const onde = alvo => {
    const pBox = alvo.closest('[data-i]'), rBox = alvo.closest('[data-r]'), oBox = alvo.closest('[data-j]');
    return { p: pBox && quiz.perguntas[pBox.dataset.i], pi: pBox && +pBox.dataset.i, r: rBox && quiz.resultados[rBox.dataset.r], ri: rBox && +rBox.dataset.r, oj: oBox && +oBox.dataset.j };
  };

  el.addEventListener('input', e => {
    const c = e.target.dataset.campo, { p, r, oj } = onde(e.target);
    if (e.target.id === 'titulo') quiz.titulo = e.target.value;
    if (e.target.id === 'descricao') quiz.descricao = e.target.value;
    if (c === 'texto') p.texto = e.target.value;
    if (c === 'opcao') p.opcoes[oj].texto = e.target.value;
    if (c === 'rdesc') r.descricao = e.target.value;
    if (c === 'rnome') {
      r.nome = e.target.value;
      $$(`select[data-campo=ores] option[value="${r.id}"]`, el).forEach(o => (o.textContent = r.nome || 'Resultado'));
    }
  });

  el.addEventListener('change', async e => {
    const c = e.target.dataset.campo, { p, r, oj } = onde(e.target), arq = e.target.files?.[0];
    if (e.target.id === 'categoria') quiz.categoria = e.target.value;
    if (c === 'ores') p.opcoes[oj].r = e.target.value;
    if (!arq) return;
    if (c === 'capa') { quiz.capa = await lerImagem(arq); desenharCapa(); }
    if (c === 'midiaArquivo') {
      try { p.midia = await lerArquivoMidia(arq, lerImagem); p.img = ''; desenharPerguntas(); }
      catch (err) { toast(err.message); e.target.value = ''; }
    }
    if (c === 'rimg') { r.img = await lerImagem(arq, 500); desenharResultados(); }
  });

  el.addEventListener('click', e => {
    const b = e.target.closest('[data-acao]'); if (!b) return;
    e.preventDefault();
    const { p, pi, ri, oj } = onde(b);
    switch (b.dataset.acao) {
      case 'addP': quiz.perguntas.push(novaPergunta(quiz.tipo)); desenharPerguntas(); $('#perguntas', el).lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
      case 'rmP': quiz.perguntas.splice(pi, 1); desenharPerguntas(); break;
      case 'addO': p.opcoes.push({ texto: '' }); desenharPerguntas(); break;
      case 'rmO': p.opcoes.splice(oj, 1); if (p.certa >= p.opcoes.length) p.certa = 0; desenharPerguntas(); break;
      case 'certa': p.certa = oj; desenharPerguntas(); break;
      case 'midiaLink': adicionarLink(b, p); break;
      case 'rmMidia': p.midia = null; p.img = ''; desenharPerguntas(); break;
      case 'addR': quiz.resultados.push(novoResultado()); desenharResultados(); desenharPerguntas(); break;
      case 'rmR': {
        const id = quiz.resultados[ri].id;
        quiz.resultados.splice(ri, 1);
        quiz.perguntas.forEach(q => q.opcoes.forEach(o => { if (o.r === id) o.r = undefined; }));
        desenharResultados(); desenharPerguntas(); break;
      }
      case 'publicar': publicar(); break;
    }
  });

  function adicionarLink(botao, p) {
    const campo = botao.closest('.midia-link').querySelector('input');
    const midia = midiaDeLink(campo.value);
    if (!midia) return toast('Link inválido. Use um link de imagem, GIF ou do YouTube.');
    p.midia = midia; p.img = '';
    desenharPerguntas();
  }
  // Enter no campo de link também adiciona
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.dataset.campo === 'midiaLink') {
      e.preventDefault();
      adicionarLink(e.target, onde(e.target).p);
    }
  });

  async function publicar() {
    if (!quiz.titulo.trim()) return toast('Falta o título');
    if (pers && quiz.resultados.some(r => !r.nome.trim())) return toast('Dê um nome para todos os resultados');
    const vazia = quiz.perguntas.findIndex(p => !p.texto.trim() || p.opcoes.some(o => !o.texto.trim()));
    if (vazia >= 0) return toast(`A pergunta ${vazia + 1} tem campo vazio`);
    if (pers) quiz.perguntas.forEach(p => p.opcoes.forEach(o => { if (!o.r) o.r = quiz.resultados[0].id; }));
    try {
      const salvo = await api.salvarQuiz(quiz);
      toast(editando ? 'Alterações salvas' : 'Quiz publicado');
      navegar('/quiz/' + salvo.id);
    } catch (err) { toast(err.message); }
  }

  desenharCapa(); desenharResultados(); desenharPerguntas();
}

EditorQuiz.novo = tipo => ({
  tipo, titulo: '', descricao: '', capa: '',
  categoria: tipo === 'personalidade' ? 'Personalidade' : 'Conhecimentos gerais',
  resultados: tipo === 'personalidade' ? [novoResultado(), novoResultado()] : undefined,
  perguntas: [novaPergunta(tipo)],
});
