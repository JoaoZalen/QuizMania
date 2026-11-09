// Mídia das perguntas: imagem, GIF, vídeo do YouTube ou arquivo de vídeo (.mp4/.webm).
// Formato salvo na pergunta: p.midia = { tipo: 'imagem' | 'gif' | 'youtube' | 'video', url, credito? }
import CreditoFoto from '../components/CreditoFoto.js';
// (perguntas antigas usam p.img, que é tratado como imagem)

const LIMITE_GIF = 2.5 * 1024 * 1024; // ~2,5 MB, por causa do localStorage

export function youtubeId(url) {
  const m = String(url || '').trim().match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export function midiaDaPergunta(p) {
  if (p.midia?.url) return p.midia;
  if (p.img) return { tipo: 'imagem', url: p.img };
  return null;
}

// identifica o tipo de um link colado
export function midiaDeLink(url) {
  url = String(url || '').trim();
  if (!url) return null;
  const id = youtubeId(url);
  if (id) return { tipo: 'youtube', url: id };
  if (!/^https?:\/\//i.test(url)) return null;
  if (/\.(mp4|webm|ogv)(\?|#|$)/i.test(url)) return { tipo: 'video', url };
  return { tipo: /\.gif(\?|#|$)/i.test(url) || /giphy\.com|tenor\.com/i.test(url) ? 'gif' : 'imagem', url };
}

// lê um arquivo enviado. GIF fica como está (para manter a animação); outras imagens são reduzidas.
export function lerArquivoMidia(arquivo, lerImagem) {
  if (arquivo.type === 'image/gif') {
    if (arquivo.size > LIMITE_GIF) return Promise.reject(new Error('GIF muito grande (máx. 2,5 MB). Cole um link do GIF em vez de enviar.'));
    return new Promise(res => { const r = new FileReader(); r.onload = () => res({ tipo: 'gif', url: r.result }); r.readAsDataURL(arquivo); });
  }
  return lerImagem(arquivo).then(url => ({ tipo: 'imagem', url }));
}

// HTML da mídia (usado no jogo e na prévia do editor)
export function htmlMidia(m, { classe = 'midia', credito = false } = {}) {
  if (!m) return '';
  const cred = credito ? CreditoFoto(m.credito) : '';
  if (m.tipo === 'youtube') {
    return `<figure class="${classe} midia-video"><iframe src="https://www.youtube-nocookie.com/embed/${m.url}?rel=0" title="Vídeo da pergunta" loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></figure>`;
  }
  if (m.tipo === 'video') {
    return `<figure class="${classe} midia-arquivo"><video src="${m.url}" controls preload="metadata" playsinline></video>${cred}</figure>`;
  }
  return `<figure class="${classe}"><img src="${m.url}" alt="" loading="lazy" referrerpolicy="no-referrer">${cred}</figure>`;
}
