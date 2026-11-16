import { createRouter, createWebHashHistory } from 'vue-router'
import { sessao } from '../services/axiosInstance'

//Importando componentes
import HomeView from '../views/HomeView.vue'
import VisualizarQuizzesView from '../views/VisualizarQuizzesView.vue'
import CadastrarQuizView from '../views/CadastrarQuizView.vue'
import EditarQuizView from '../views/EditarQuizView.vue'
import PerguntasQuizView from '../views/PerguntasQuizView.vue'
import JogarQuizView from '../views/JogarQuizView.vue'
import EntrarView from '../views/EntrarView.vue'
import CriarContaView from '../views/CriarContaView.vue'
import MinhaContaView from '../views/MinhaContaView.vue'

//O ":id" na rota é um parâmetro: o ID do quiz vem na própria URL
//meta.login: a tela só abre com o usuário logado
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/quizzes',
    name: 'visualizarQuizzes',
    component: VisualizarQuizzesView
  },
  {
    path: '/cadastrar',
    name: 'cadastrarQuiz',
    component: CadastrarQuizView,
    meta: { login: true }
  },
  {
    path: '/quizzes/:id/editar',
    name: 'editarQuiz',
    component: EditarQuizView,
    meta: { login: true }
  },
  {
    path: '/quizzes/:id/perguntas',
    name: 'perguntasQuiz',
    component: PerguntasQuizView,
    meta: { login: true }
  },
  {
    path: '/quizzes/:id/jogar',
    name: 'jogarQuiz',
    component: JogarQuizView
  },
  {
    path: '/entrar',
    name: 'entrar',
    component: EntrarView
  },
  {
    path: '/criar-conta',
    name: 'criarConta',
    component: CriarContaView
  },
  {
    path: '/conta',
    name: 'minhaConta',
    component: MinhaContaView,
    meta: { login: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

//Sem login, as telas protegidas mandam para /entrar (e voltam depois de entrar)
router.beforeEach((to) => {
  if (to.meta.login && !sessao.usuario) {
    return { path: '/entrar', query: { voltar: to.fullPath } }
  }
})

export default router
