<template>
    <div class="formulario-quiz">
      <form @submit.prevent="salvarQuiz">
        <label for="titulo">Título:</label>
        <input type="text" id="titulo" v-model="quiz.titulo" maxlength="100" required />

        <label for="descricao">Descrição:</label>
        <textarea id="descricao" v-model="quiz.descricao" rows="3" maxlength="255" required></textarea>

        <label for="categoria">Categoria:</label>
        <select id="categoria" v-model="quiz.categoria" required>
          <option value="" disabled>Selecione uma categoria</option>
          <option v-for="categoria in categorias" :key="categoria" :value="categoria">{{ categoria }}</option>
        </select>

        <label>Imagem do quiz:</label>
        <CampoArquivo v-model="quiz.imagem" tipo="imagem" />

        <div class="acoes">
          <button type="submit" class="btn btn-primario">{{ id ? 'Salvar alterações' : 'Cadastrar' }}</button>
          <router-link to="/quizzes" class="btn">Cancelar</router-link>
        </div>
      </form>
      <div v-if="mensagem" class="mensagem" :class="{ erro: erro }">{{ mensagem }}</div>
    </div>
</template>

<script>
    //Importando instancia do axios (Centralizado no arquivo axiosInstance.js)
    import axiosInstance, { sessao } from "../services/axiosInstance";
    import CampoArquivo from "./CampoArquivo.vue";

    export default {
        name: "FormularioQuiz",
        components: { CampoArquivo },
        props: {
            //ID do quiz. Sem ID o formulário cadastra; com ID ele edita
            id: {
                type: String,
                default: ""
            }
        },
        data() { //Retorna objeto com os dados do componente e a mensagem de sucesso ou erro
            return {
                quiz: {
                    titulo: "",
                    descricao: "",
                    categoria: "",
                    imagem: "",
                },
                categorias: [
                    "Conhecimentos gerais", "Ciências", "História", "Games",
                    "Filmes e séries", "Música", "Esportes", "Animais", "Tecnologia"
                ],
                mensagem: "",
                erro: false,
            };
        },
        async mounted() { //Se for edição, busca os dados atuais do quiz para preencher o formulário
            if (this.id) {
                await this.getQuiz();
            }
        },
        methods: {
            async getQuiz() {
                try {
                    const response = await axiosInstance.get(`/quizzes/${this.id}`); //Envia requisição GET
                    this.quiz.titulo = response.data.titulo;
                    this.quiz.descricao = response.data.descricao;
                    this.quiz.categoria = response.data.categoria;
                    this.quiz.imagem = response.data.imagem || "";
                    //Só o autor pode editar o quiz
                    if (response.data.usuario_id !== sessao.usuario.id) {
                        this.$router.push(`/quizzes/${this.id}/jogar`);
                    }
                } catch (error) {
                    this.mostrarErro("Erro ao carregar quiz", error);
                }
            },
            async salvarQuiz() { //Método chamado ao enviar os dados do formulário
                try {
                    if (this.id) {
                        const response = await axiosInstance.put(`/quizzes/${this.id}`, this.quiz); //Envia requisição PUT
                        this.quiz.imagem = response.data.imagem || "";
                        this.erro = false;
                        this.mensagem = `Quiz ${this.quiz.titulo} atualizado com sucesso!`;
                    } else {
                        const response = await axiosInstance.post("/quizzes", this.quiz); //Envia requisição POST
                        //Redireciona para a tela de perguntas do quiz que acabou de ser criado
                        this.$router.push(`/quizzes/${response.data.id}/perguntas`);
                    }
                } catch (error) {
                    this.mostrarErro("Erro ao salvar quiz", error);
                }
            }, //Fim do salvarQuiz()
            mostrarErro(texto, error) {
                //Usa a mensagem enviada pela API quando existir (ex.: título repetido)
                const detalhe = error.response ? error.response.data.message : error.message;
                this.erro = true;
                this.mensagem = `${texto}: ${detalhe}`;
            },
        }, //Fim do methods
    };
</script>

<style scoped>
    .formulario-quiz {
        max-width: 520px;
    }
</style>
