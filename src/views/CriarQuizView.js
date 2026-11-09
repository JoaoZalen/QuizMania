// Criar quiz (/criar) e editar quiz (/editar/:id).
import * as api from '../services/api.js';
import { navegar } from '../router/index.js';
import { toast } from '../utils/dom.js';
import EscolherTipoQuiz from '../components/criar/EscolherTipoQuiz.js';
import EditorQuiz from '../components/criar/EditorQuiz.js';

async function montar(el, params) {
  const u = api.usuarioLogado();
  if (!u) { toast('Entre na sua conta para criar quizzes'); return navegar('/entrar'); }

  if (params.id) {
    const quiz = await api.buscarQuiz(params.id);
    if (!quiz || quiz.autor !== u) { el.innerHTML = `<p class="vazio">Quiz não encontrado.</p>`; return; }
    return EditorQuiz(el, structuredClone(quiz), { editando: true });
  }
  EscolherTipoQuiz(el, tipo => EditorQuiz(el, EditorQuiz.novo(tipo)));
}

export default { montar };
