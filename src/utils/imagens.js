// Tudo sobre imagens: capas, fotos de resultado, upload e avatares com iniciais.
import { iniciais } from './formatar.js';

const CAPA_PADRAO = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#e7e5e0"/><text x="160" y="118" font-family="Georgia,serif" font-size="64" font-weight="700" fill="#b9b5ac" text-anchor="middle">?</text></svg>');

// imagem salva no quiz: URL de foto, dataURL enviado pelo usuário ou vazio
export const imagem = v => (v && (v.startsWith('http') || v.startsWith('data:')) ? v : '');
export const capaDoQuiz = q => imagem(q.capa) || CAPA_PADRAO;

// reduz a imagem enviada para caber no localStorage
export function lerImagem(arquivo, max = 900) {
  return new Promise(resolve => {
    const leitor = new FileReader();
    leitor.onload = () => {
      const im = new Image();
      im.onload = () => {
        const k = Math.min(1, max / Math.max(im.width, im.height));
        const c = document.createElement('canvas');
        c.width = im.width * k; c.height = im.height * k;
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.82));
      };
      im.src = leitor.result;
    };
    leitor.readAsDataURL(arquivo);
  });
}

// ---------- avatar ----------
export const CORES_AVATAR = ['#4f3cf0', '#1f9d55', '#e0443e', '#2f6fde', '#f2701c', '#7c4ddb', '#0e7490', '#b45309', '#be185d', '#334155', '#15803d', '#9333ea'];

export function avatarIniciais(nome, cor = 0) {
  const fundo = CORES_AVATAR[cor % CORES_AVATAR.length];
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${fundo}"/><text x="32" y="41" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="700" fill="#fff" text-anchor="middle">${iniciais(nome)}</text></svg>`);
}

// usuario = objeto do usuário (ou undefined); avatar pode ser foto enviada (dataURL) ou índice de cor
export function avatarDe(usuario, user = '') {
  const a = usuario?.avatar ?? 0;
  return typeof a === 'string' ? a : avatarIniciais(usuario?.nome || usuario?.user || user, a);
}
