// Acesso ao localStorage. Só o api.js deve usar este arquivo.
const PREFIXO = 'qm_';

export const storage = {
  get(chave, padrao) {
    try { return JSON.parse(localStorage.getItem(PREFIXO + chave)) ?? padrao; } catch { return padrao; }
  },
  set(chave, valor) {
    try { localStorage.setItem(PREFIXO + chave, JSON.stringify(valor)); return true; } catch { return false; }
  },
};
