export const numero = n => Number(n || 0).toLocaleString('pt-BR');

export function tempo(t) {
  const d = Math.floor((Date.now() - t) / 864e5);
  if (d < 1) return 'hoje';
  if (d === 1) return 'ontem';
  if (d < 30) return `há ${d} dias`;
  const m = Math.floor(d / 30);
  return m < 12 ? `há ${m} ${m === 1 ? 'mês' : 'meses'}` : `há ${Math.floor(m / 12)} ano${m >= 24 ? 's' : ''}`;
}

export const tipoLabel = tipo => (tipo === 'personalidade' ? 'Personalidade' : 'Certo ou errado');

export const iniciais = nome => String(nome || '?').replace(/[@._-]+/g, ' ').trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase() || '?';
