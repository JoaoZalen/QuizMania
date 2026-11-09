// /perfil → redireciona para o perfil do usuário logado.
import * as api from '../services/api.js';
import { navegar } from '../router/index.js';

export default {
  montar() {
    const u = api.usuarioLogado();
    navegar(u ? '/u/' + encodeURIComponent(u) : '/entrar');
  },
};
