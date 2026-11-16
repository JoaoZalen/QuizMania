<template>
    <div class="quizzes-container">
        <h1>Lista de Quizzes</h1>
        <p class="subtitulo">{{ listaDeQuizzes.length }} quiz(zes) cadastrado(s)</p>

        <div class="lista">
            <!--Inclusão do componente lista quizzes. O @excluir escuta o evento enviado pelo componente-->
            <ListaQuizzes :quizzes="listaDeQuizzes" @excluir="excluirQuiz"/>
        </div>

        <p v-if="listaDeQuizzes.length === 0 && !erro" class="vazio">Nenhum quiz cadastrado ainda.</p>
        <div v-if="mensagem" class="mensagem" :class="{ erro: erro }">{{ mensagem }}</div>
    </div>
</template>

<script>
    //Caminho relativo para o componente
    import ListaQuizzes from '../components/ListaQuizzes.vue';
    //Importando instancia do axios (Centralizado no arquivo axiosInstance.js)
    import axiosInstance from "../services/axiosInstance";

    export default {
        name: 'VisualizarQuizzesView',
        components: {
            ListaQuizzes //A lista de quizzes usada na view
        },
        data() { //Dados da props
            return {
                listaDeQuizzes: [], //Inicializando a lista de quizzes vazia
                mensagem: "",
                erro: false
            }
        },
        async mounted(){ //Montagem do ciclo de vida do componente
            await this.getQuizzes();
        },
        methods: {
            async getQuizzes() { //Método chamado para receber dados da API
                try{
                    const response = await axiosInstance.get('/quizzes'); //Envia requisição GET
                    this.listaDeQuizzes = response.data; //Atualizando lista de quizzes
                } catch (error){
                    this.erro = true;
                    this.mensagem = `Erro ao carregar quizzes: ${error.message}`;
                }
            }, //Fim getQuizzes
            async excluirQuiz(quiz) { //Método chamado quando o componente envia o evento "excluir"
                if (!confirm(`Excluir o quiz "${quiz.titulo}" e todas as perguntas dele?`)) {
                    return;
                }
                try{
                    await axiosInstance.delete(`/quizzes/${quiz.id}`); //Envia requisição DELETE
                    this.erro = false;
                    this.mensagem = `Quiz ${quiz.titulo} excluído com sucesso!`;
                    await this.getQuizzes(); //Recarrega a lista
                } catch (error){
                    this.erro = true;
                    this.mensagem = `Erro ao excluir quiz: ${error.response ? error.response.data.message : error.message}`;
                }
            } //Fim excluirQuiz
        }
    }
</script>

<style scoped>
    .lista {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
    }
</style>
