<template>
    <div class="home">
      <h1>QuizMania</h1>
      <p class="subtitulo">Crie quizzes de múltipla escolha, cadastre as perguntas e jogue para ver quantas você acerta.</p>

      <div class="acoes">
        <router-link to="/quizzes" class="btn btn-primario">Visualizar Quizzes</router-link>
        <router-link to="/cadastrar" class="btn">Cadastrar Quiz</router-link>
        <router-link v-if="!sessao.usuario" to="/criar-conta" class="btn">Criar conta</router-link>
      </div>
    </div>
</template>

<script>
    import { sessao } from "../services/axiosInstance";

    export default {
        name: 'HomeView',
        data() {
            return { sessao } //Usuário logado (reativo)
        }
    }
</script>

<style scoped>
    .home {
        padding-top: 48px;
        max-width: 560px;
    }

    .home h1 {
        font-size: 44px;
    }

    .subtitulo {
        font-size: 18px;
    }
</style>
