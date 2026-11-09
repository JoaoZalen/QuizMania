// Chamada para criar quiz (lateral da home).
import { FOTOS } from '../data/fotos.js';

export default function BlocoCriarQuiz() {
  const foto = FOTOS['pc5']?.[0]?.u || FOTOS.tech?.[0]?.u || '';
  return `<div class="bloco-lateral bloco-criar" style="--foto:url('${foto}')">
    <h3>Monte o seu quiz</h3>
    <p>Personalidade ou certo e errado, com foto em cada pergunta.</p>
    <a class="btn btn-branco btn-bloco" href="#/criar">Criar quiz</a>
  </div>`;
}
