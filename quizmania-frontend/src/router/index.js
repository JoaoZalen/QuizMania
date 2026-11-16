import { createRouter, createWebHashHistory } from 'vue-router'

//Importando componentes
import HomeView from '../views/HomeView.vue'
import VisualizarQuizzesView from '../views/VisualizarQuizzesView.vue'
import CadastrarQuizView from '../views/CadastrarQuizView.vue'
import EditarQuizView from '../views/EditarQuizView.vue'
import PerguntasQuizView from '../views/PerguntasQuizView.vue'
import JogarQuizView from '../views/JogarQuizView.vue'

//O ":id" na rota é um parâmetro: o ID do quiz vem na própria URL
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
    component: CadastrarQuizView
  },
  {
    path: '/quizzes/:id/editar',
    name: 'editarQuiz',
    component: EditarQuizView
  },
  {
    path: '/quizzes/:id/perguntas',
    name: 'perguntasQuiz',
    component: PerguntasQuizView
  },
  {
    path: '/quizzes/:id/jogar',
    name: 'jogarQuiz',
    component: JogarQuizView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
