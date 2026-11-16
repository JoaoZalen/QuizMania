<template>
    <div class="formulario-conta">
      <form @submit.prevent="salvarConta">
        <label for="nome">Nome:</label>
        <input type="text" id="nome" v-model="conta.nome" maxlength="100" required />

        <label for="email">E-mail:</label>
        <input type="email" id="email" v-model="conta.email" maxlength="150" required />

        <label for="senha">{{ editando ? 'Nova senha (deixe em branco para manter):' : 'Senha (mínimo 6 caracteres):' }}</label>
        <input type="password" id="senha" v-model="conta.senha" minlength="6" :required="!editando" />

        <label>Foto de perfil:</label>
        <CampoArquivo v-model="conta.foto" tipo="imagem" />

        <div class="acoes">
          <button type="submit" class="btn btn-primario" :disabled="enviando">{{ editando ? 'Salvar alterações' : 'Criar conta' }}</button>
          <router-link to="/" class="btn">Cancelar</router-link>
        </div>
      </form>
      <div v-if="mensagem" class="mensagem" :class="{ erro: erro }">{{ mensagem }}</div>
    </div>
</template>

<script>
    import CampoArquivo from "./CampoArquivo.vue";
    //Importando instancia do axios (Centralizado no arquivo axiosInstance.js)
    import axiosInstance, { sessao, entrar, atualizarUsuario } from "../services/axiosInstance";

    export default {
        name: "FormularioConta",
        components: { CampoArquivo },
        props: {
            //true = editar a conta do usuário logado; false = criar conta
            editando: { type: Boolean, default: false }
        },
        data() {
            return {
                conta: { nome: "", email: "", senha: "", foto: "" },
                enviando: false,
                mensagem: "",
                erro: false
            };
        },
        mounted() { //Na edição, preenche com os dados do usuário logado
            if (this.editando && sessao.usuario) {
                this.conta.nome = sessao.usuario.nome;
                this.conta.email = sessao.usuario.email;
                this.conta.foto = sessao.usuario.foto || "";
            }
        },
        methods: {
            async salvarConta() {
                this.enviando = true;
                try {
                    if (this.editando) {
                        const response = await axiosInstance.put(`/usuarios/${sessao.usuario.id}`, this.conta); //Envia requisição PUT
                        atualizarUsuario(response.data);
                        this.conta.senha = "";
                        this.conta.foto = response.data.foto || "";
                        this.erro = false;
                        this.mensagem = "Conta atualizada com sucesso!";
                    } else {
                        const response = await axiosInstance.post("/usuarios", this.conta); //Envia requisição POST
                        entrar(response.data.usuario, response.data.token);
                        this.$router.push("/quizzes");
                    }
                } catch (error) {
                    const detalhe = error.response ? error.response.data.message : error.message;
                    this.erro = true;
                    this.mensagem = `Erro ao salvar conta: ${detalhe}`;
                }
                this.enviando = false;
            }
        }
    };
</script>

<style scoped>
    .formulario-conta {
        max-width: 520px;
    }
</style>
