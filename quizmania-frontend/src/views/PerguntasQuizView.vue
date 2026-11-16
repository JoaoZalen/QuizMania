<template>
    <div class="perguntas-quiz-view">
        <p class="categoria">{{ quiz.categoria }}</p>
        <h1>{{ quiz.titulo }}</h1>
        <p class="subtitulo">{{ quiz.descricao }}</p>

        <div class="acoes topo">
            <router-link :to="`/quizzes/${quizId}/jogar`" class="btn btn-primario">Jogar</router-link>
            <router-link :to="`/quizzes/${quizId}/editar`" class="btn">Editar quiz</router-link>
            <router-link to="/quizzes" class="btn">Voltar para a lista</router-link>
        </div>

        <h2>Perguntas ({{ listaDePerguntas.length }})</h2>
        <div class="lista">
            <!--Inclusão do componente lista perguntas, escutando os eventos "editar" e "excluir"-->
            <ListaPerguntas :perguntas="listaDePerguntas" @editar="editarPergunta" @excluir="excluirPergunta"/>
        </div>
        <p v-if="listaDePerguntas.length === 0" class="vazio">Este quiz ainda não tem perguntas. Cadastre a primeira abaixo.</p>

        <h2 class="titulo-form">{{ idEditando ? 'Editar pergunta' : 'Nova pergunta' }}</h2>
        <form @submit.prevent="salvarPergunta">
            <label for="enunciado">Enunciado:</label>
            <input type="text" id="enunciado" v-model="pergunta.enunciado" maxlength="255" required />

            <label for="alternativa_a">Alternativa A:</label>
            <input type="text" id="alternativa_a" v-model="pergunta.alternativa_a" maxlength="150" required />

            <label for="alternativa_b">Alternativa B:</label>
            <input type="text" id="alternativa_b" v-model="pergunta.alternativa_b" maxlength="150" required />

            <label for="alternativa_c">Alternativa C:</label>
            <input type="text" id="alternativa_c" v-model="pergunta.alternativa_c" maxlength="150" required />

            <label for="alternativa_d">Alternativa D:</label>
            <input type="text" id="alternativa_d" v-model="pergunta.alternativa_d" maxlength="150" required />

            <label for="midia_tipo">Mídia da pergunta:</label>
            <select id="midia_tipo" v-model="pergunta.midia_tipo" @change="pergunta.midia_url = ''">
                <option value="">Sem mídia</option>
                <option value="imagem">Imagem</option>
                <option value="video">Vídeo</option>
            </select>
            <CampoArquivo v-if="pergunta.midia_tipo" v-model="pergunta.midia_url" :tipo="pergunta.midia_tipo" />

            <label for="correta">Alternativa correta:</label>
            <select id="correta" v-model="pergunta.correta" required>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
            </select>

            <div class="acoes">
                <button type="submit" class="btn btn-primario" :disabled="enviando">{{ idEditando ? 'Salvar alterações' : 'Cadastrar pergunta' }}</button>
                <button type="button" class="btn" v-if="idEditando" @click="limparFormulario">Cancelar edição</button>
            </div>
        </form>
        <div v-if="mensagem" class="mensagem" :class="{ erro: erro }">{{ mensagem }}</div>
    </div>
</template>

<script>
    //Caminho relativo para o componente
    import ListaPerguntas from '../components/ListaPerguntas.vue';
    import CampoArquivo from '../components/CampoArquivo.vue';
    //Importando instancia do axios (Centralizado no arquivo axiosInstance.js)
    import axiosInstance, { sessao } from "../services/axiosInstance";

    export default {
        name: 'PerguntasQuizView',
        components: {
            ListaPerguntas, //A lista de perguntas usada na view
            CampoArquivo    //Campo de imagem/vídeo da pergunta
        },
        data() {
            return {
                quizId: this.$route.params.id, //ID do quiz que veio na URL
                quiz: {},
                listaDePerguntas: [], //Inicializando a lista de perguntas vazia
                pergunta: { //Dados do formulário
                    enunciado: "",
                    alternativa_a: "",
                    alternativa_b: "",
                    alternativa_c: "",
                    alternativa_d: "",
                    correta: "A",
                    midia_tipo: "",
                    midia_url: "",
                },
                enviando: false,
                idEditando: null, //null = cadastrando uma pergunta nova; com valor = editando essa pergunta
                mensagem: "",
                erro: false
            }
        },
        async mounted(){ //Montagem do ciclo de vida do componente
            await this.getQuiz();
            await this.getPerguntas();
        },
        methods: {
            async getQuiz() {
                try{
                    const response = await axiosInstance.get(`/quizzes/${this.quizId}`); //Envia requisição GET
                    this.quiz = response.data;
                    //Só o autor pode alterar as perguntas do quiz
                    if (this.quiz.usuario_id !== sessao.usuario.id) {
                        this.$router.push(`/quizzes/${this.quizId}/jogar`);
                    }
                } catch (error){
                    this.mostrarErro("Erro ao carregar quiz", error);
                }
            },
            async getPerguntas() { //Método chamado para receber as perguntas da API
                try{
                    const response = await axiosInstance.get(`/quizzes/${this.quizId}/perguntas`); //Envia requisição GET
                    this.listaDePerguntas = response.data; //Atualizando lista de perguntas
                } catch (error){
                    this.mostrarErro("Erro ao carregar perguntas", error);
                }
            },
            async salvarPergunta() { //Método chamado ao enviar os dados do formulário
                this.enviando = true;
                try{
                    if (this.idEditando) {
                        await axiosInstance.put(`/perguntas/${this.idEditando}`, this.pergunta); //Envia requisição PUT
                        this.mensagem = "Pergunta atualizada com sucesso!";
                    } else {
                        await axiosInstance.post(`/quizzes/${this.quizId}/perguntas`, this.pergunta); //Envia requisição POST
                        this.mensagem = "Pergunta cadastrada com sucesso!";
                    }
                    this.erro = false;
                    this.limparFormulario();
                    await this.getPerguntas(); //Recarrega a lista
                } catch (error){
                    this.mostrarErro("Erro ao salvar pergunta", error);
                }
                this.enviando = false;
            }, //Fim salvarPergunta
            editarPergunta(pergunta) { //Chamado pelo evento "editar": copia a pergunta para o formulário
                this.idEditando = pergunta.id;
                this.pergunta = {
                    enunciado: pergunta.enunciado,
                    alternativa_a: pergunta.alternativa_a,
                    alternativa_b: pergunta.alternativa_b,
                    alternativa_c: pergunta.alternativa_c,
                    alternativa_d: pergunta.alternativa_d,
                    correta: pergunta.correta,
                    midia_tipo: pergunta.midia_tipo || "",
                    midia_url: pergunta.midia_url || "",
                };
                this.mensagem = "";
            },
            async excluirPergunta(pergunta) { //Chamado pelo evento "excluir"
                if (!confirm(`Excluir a pergunta "${pergunta.enunciado}"?`)) {
                    return;
                }
                try{
                    await axiosInstance.delete(`/perguntas/${pergunta.id}`); //Envia requisição DELETE
                    this.erro = false;
                    this.mensagem = "Pergunta excluída com sucesso!";
                    if (this.idEditando === pergunta.id) {
                        this.limparFormulario(); //Estava editando a pergunta que foi excluída
                    }
                    await this.getPerguntas(); //Recarrega a lista
                } catch (error){
                    this.mostrarErro("Erro ao excluir pergunta", error);
                }
            },
            limparFormulario() { //Resetando o formulário
                this.idEditando = null;
                this.pergunta = {
                    enunciado: "",
                    alternativa_a: "",
                    alternativa_b: "",
                    alternativa_c: "",
                    alternativa_d: "",
                    correta: "A",
                    midia_tipo: "",
                    midia_url: "",
                };
            },
            mostrarErro(texto, error) {
                //Usa a mensagem enviada pela API quando existir
                const detalhe = error.response ? error.response.data.message : error.message;
                this.erro = true;
                this.mensagem = `${texto}: ${detalhe}`;
            }
        }
    }
</script>

<style scoped>
    .categoria {
        font-size: 12px;
        font-weight: 700;
        color: #4f3cf0;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .topo {
        margin-bottom: 32px;
    }

    .lista {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .titulo-form {
        margin-top: 32px;
    }

    form {
        max-width: 520px;
    }
</style>
