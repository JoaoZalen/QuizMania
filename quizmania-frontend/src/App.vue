<template>
    <header class="cabecalho">
      <router-link to="/" class="marca">QuizMania</router-link>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/quizzes">Visualizar Quizzes</router-link>
        <router-link to="/cadastrar">Cadastrar Quiz</router-link>
        <!--Logado: foto, nome e sair. Sem login: entrar e criar conta-->
        <template v-if="sessao.usuario">
          <router-link to="/conta" class="usuario-logado">
            <FotoUsuario :nome="sessao.usuario.nome" :foto="sessao.usuario.foto || ''" :tamanho="26" />
            {{ sessao.usuario.nome }}
          </router-link>
          <a href="#" @click.prevent="logout">Sair</a>
        </template>
        <template v-else>
          <router-link to="/entrar">Entrar</router-link>
          <router-link to="/criar-conta">Criar conta</router-link>
        </template>
      </nav>
    </header>

    <main class="conteudo">
      <router-view/>
    </main>
</template>

<script>
    import FotoUsuario from './components/FotoUsuario.vue'
    //Importando instancia do axios (Centralizado no arquivo axiosInstance.js)
    import axiosInstance, { sessao, sair } from './services/axiosInstance'

    export default {
        name: 'App',
        components: { FotoUsuario },
        data() {
            return { sessao } //Usuário logado (reativo)
        },
        methods: {
            async logout() {
                try {
                    await axiosInstance.post('/logout'); //Invalida o token na API
                } catch (error) {
                    //Mesmo com erro, sai localmente
                }
                sair();
                this.$router.push('/');
            }
        }
    }
</script>

<style>
    .cabecalho {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 16px 32px;
      background-color: #ffffff;
      border-bottom: 1px solid #e7e5e0;
    }

    .marca {
      font-size: 22px;
      font-weight: 800;
      color: #141414;
      text-decoration: none;
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    nav a {
      font-weight: 600;
      font-size: 15px;
      color: #6f6f6f;
      text-decoration: none;
      padding: 8px 12px;
      border-radius: 8px;
    }

    .usuario-logado {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    nav a:hover {
      color: #141414;
    }

    nav a.router-link-exact-active {
      color: #4f3cf0;
      background-color: #efedff;
    }

    .conteudo {
      width: 100%;
      max-width: 960px;
      margin: 0 auto;
      padding: 32px 16px 64px;
    }
</style>
