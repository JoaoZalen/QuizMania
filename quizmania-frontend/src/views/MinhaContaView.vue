<template>
    <div class="minha-conta-view">
      <h1>Minha conta</h1>
      <p class="subtitulo">Altere seus dados e sua foto de perfil.</p>
      <FormularioConta editando /> <!--Com "editando" = editar a conta logada-->

      <h2 class="titulo-apagar">Apagar conta</h2>
      <p class="subtitulo">Apaga a sua conta e todos os seus quizzes. Não dá para desfazer.</p>
      <button class="btn btn-perigo" @click="apagarConta">Apagar minha conta</button>
      <div v-if="mensagem" class="mensagem erro">{{ mensagem }}</div>
    </div>
</template>

<script>
    // Caminho relativo para o componente
    import FormularioConta from '../components/FormularioConta.vue'
    //Importando instancia do axios (Centralizado no arquivo axiosInstance.js)
    import axiosInstance, { sessao, sair } from "../services/axiosInstance";

    export default {
        name: 'MinhaContaView',
        components: {
            FormularioConta
        },
        data() {
            return { mensagem: "" }
        },
        methods: {
            async apagarConta() {
                if (!confirm("Apagar a sua conta e todos os seus quizzes? Não dá para desfazer.")) {
                    return;
                }
                try {
                    await axiosInstance.delete(`/usuarios/${sessao.usuario.id}`); //Envia requisição DELETE
                    sair();
                    this.$router.push("/");
                } catch (error) {
                    const detalhe = error.response ? error.response.data.message : error.message;
                    this.mensagem = `Erro ao apagar conta: ${detalhe}`;
                }
            }
        }
    }
</script>

<style scoped>
    .titulo-apagar {
        margin-top: 40px;
    }

    .subtitulo {
        margin-bottom: 12px;
    }
</style>
