// Campo de mídia da pergunta no editor: enviar imagem/GIF ou colar link (imagem, GIF ou YouTube).
import { htmlMidia } from '../../utils/midia.js';
import { ICONES } from '../../utils/icones.js';

const ROTULO = { imagem: 'Imagem', gif: 'GIF', youtube: 'Vídeo do YouTube', video: 'Vídeo' };

export default function CampoMidia(midia) {
  if (midia) {
    return `<div class="campo-midia com-midia">
      ${htmlMidia(midia, { classe: 'midia-previa' })}
      <div class="midia-barra"><span class="midia-tipo">${ROTULO[midia.tipo]}</span>
        <button class="btn btn-mini btn-perigo" data-acao="rmMidia">${ICONES.lixo} Remover</button></div>
    </div>`;
  }
  return `<div class="campo-midia">
    <label class="midia-enviar">${ICONES.imagem}<span><b>Enviar imagem ou GIF</b><small>JPG, PNG ou GIF animado</small></span>
      <input type="file" accept="image/*" data-campo="midiaArquivo"></label>
    <span class="midia-ou">ou</span>
    <div class="midia-link">
      <input data-campo="midiaLink" placeholder="Cole um link de imagem, GIF, YouTube ou vídeo (.mp4)">
      <button class="btn btn-mini" data-acao="midiaLink">Adicionar</button>
    </div>
  </div>`;
}
