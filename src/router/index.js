// Rotas do site (hash router, equivalente ao vue-router com createWebHashHistory).
// Cada view é carregada sob demanda e exporta { montar(el, params, query) } que pode
// devolver uma função de limpeza (como o onUnmounted do Vue).
const rotas = [
  { caminho: '/', view: () => import('../views/HomeView.js') },
  { caminho: '/entrar', view: () => import('../views/EntrarView.js') },
  { caminho: '/criar', view: () => import('../views/CriarQuizView.js') },
  { caminho: '/editar/:id', view: () => import('../views/CriarQuizView.js') },
  { caminho: '/quiz/:id', view: () => import('../views/QuizView.js') },
  { caminho: '/perfil', view: () => import('../views/MeuPerfilView.js') },
  { caminho: '/perfil/editar', view: () => import('../views/EditarPerfilView.js') },
  { caminho: '/u/:usuario', view: () => import('../views/PerfilView.js') },
  { caminho: '/u/:usuario/:aba', view: () => import('../views/PerfilView.js') },
];
const naoEncontrado = () => import('../views/NaoEncontradoView.js');

function casar(caminho) {
  const partes = caminho.split('/').filter(Boolean);
  for (const r of rotas) {
    const modelo = r.caminho.split('/').filter(Boolean);
    if (modelo.length !== partes.length) continue;
    const params = {};
    if (modelo.every((m, i) => (m.startsWith(':') ? (params[m.slice(1)] = decodeURIComponent(partes[i]), true) : m === partes[i]))) return { rota: r, params };
  }
  return null;
}

export const rotaAtual = () => (location.hash.slice(1) || '/').split('?')[0];
export const navegar = caminho => { location.hash = '#' + caminho; };

export function iniciarRouter(container, aoTrocar) {
  let limpar = null, versao = 0;
  async function trocar() {
    const minhaVersao = ++versao;
    const [caminho, qs = ''] = (location.hash.slice(1) || '/').split('?');
    const achou = casar(caminho);
    const modulo = await (achou ? achou.rota.view() : naoEncontrado());
    if (minhaVersao !== versao) return; // outra navegação aconteceu no meio
    if (typeof limpar === 'function') limpar();
    const raiz = document.createElement('div');
    raiz.className = 'view';
    container.replaceChildren(raiz);
    window.scrollTo(0, 0);
    aoTrocar?.(caminho);
    limpar = await modulo.default.montar(raiz, achou?.params || {}, new URLSearchParams(qs));
  }
  window.addEventListener('hashchange', trocar);
  trocar();
}
