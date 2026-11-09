// Ícones SVG em linha (stroke = currentColor)
const svg = (d, t = 18, extra = '') => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;

export const ICONES = {
  busca: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', 16),
  play: '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg>',
  imagem: svg('<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>', 22),
  lixo: svg('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', 16),
  esquerda: svg('<path d="m15 18-6-6 6-6"/>', 18),
  direita: svg('<path d="m9 18 6-6-6-6"/>', 18),
  seta: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 16),
  topo: svg('<path d="M12 19V5M6 11l6-6 6 6"/>', 16),
};
