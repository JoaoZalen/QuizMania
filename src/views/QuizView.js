// Página do quiz: apresentação → jogo → resultado.
import * as api from '../services/api.js';
import IntroQuiz from '../components/quiz/IntroQuiz.js';
import JogoQuiz from '../components/quiz/JogoQuiz.js';
import ResultadoQuiz from '../components/quiz/ResultadoQuiz.js';

async function montar(el, { id }) {
  const quiz = await api.buscarQuiz(id);
  if (!quiz) { el.innerHTML = `<div class="vazio"><h2>Esse quiz não existe mais.</h2><p><a href="#/">Ver outros quizzes</a></p></div>`; return; }
  const autor = await api.buscarUsuario(quiz.autor);

  // modo foco: conteúdo no meio da tela e sem rodapé
  el.classList.add('tela-quiz');
  document.body.classList.add('modo-quiz');

  const intro = () => IntroQuiz(el, quiz, autor, jogar);
  const jogar = () => JogoQuiz(el, quiz, { aoSair: intro, aoTerminar: terminar });
  async function terminar(resultado) {
    await api.registrarJogada(quiz.id, resultado.registro);
    ResultadoQuiz(el, quiz, resultado, { aoJogarDeNovo: jogar });
  }
  intro();
  return () => document.body.classList.remove('modo-quiz');
}

export default { montar };
