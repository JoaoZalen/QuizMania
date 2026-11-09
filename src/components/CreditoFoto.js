// Crédito obrigatório das fotos do Wikimedia Commons (autor + licença + link).
import { esc } from '../utils/dom.js';

export default function CreditoFoto(c) {
  if (!c?.p) return '';
  return `<figcaption class="credito">Foto: <a href="${esc(c.p)}" target="_blank" rel="noopener">${esc(c.a)}</a>${c.l ? ` · ${esc(c.l)}` : ''} · Wikimedia Commons</figcaption>`;
}
