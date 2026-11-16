<template>
    <div class="entrar-view">
      <h1>Entrar</h1>
      <p class="subtitulo">Entre para criar e editar os seus quizzes.</p>

      <form @submit.prevent="login">
        <label for="email">E-mail:</label>
        <input type="email" id="email" v-model="email" required />

        <label for="senha">Senha:</label>
        <input type="password" id="senha" v-model="senha" required />

        <div class="acoes">
          <button type="submit" class="btn btn-primario">Entrar</button>
          <router-link to="/criar-conta" class="btn">Criar conta</router-link>
        </div>
      </form>
      <div v-if="mensagem" class="mensagem erro">{{ mensagem }}</div>
    </div>
</template>

<script>
    //Importando instancia do axios (Centralizado no arquivo axiosInstance.js)
    import axiosInstance, { entrar } from "../services/axiosInstance";

    export default {
        name: 'EntrarView',
        data() {
            return { email: "", senha: "", mensagem: "" }
        },
        methods: {
            async login() {
                try {
                    const response = await axiosInstance.post("/login", { email: this.email, senha: this.senha }); //Envia requisição POST
                    entrar(response.data.usuario, response.data.token);
                    //Volta para a tela que pediu login, ou para a lista
                    this.$router.push(this.$route.query.voltar || "/quizzes");
                } catch (error) {
                    const detalhe = error.response ? error.response.data.message : error.message;
                    this.mensagem = `Erro ao entrar: ${detalhe}`;
                }
            }
        }
    }
</script>

<style scoped>
    .entrar-view {
        max-width: 520px;
    }
</style>
