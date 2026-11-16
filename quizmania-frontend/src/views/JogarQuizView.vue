<template>
    <div class="jogar-quiz-view">
        <p class="categoria">{{ quiz.categoria }}</p>
        <h1>{{ quiz.titulo }}</h1>

        <!--Quiz sem perguntas-->
        <div v-if="carregado && listaDePerguntas.length === 0">
            <p class="vazio">Este quiz ainda não tem perguntas.</p>
            <router-link :to="`/quizzes/${quizId}/perguntas`" class="btn btn-primario">Cadastrar perguntas</router-link>
        </div>

        <!--Tela de resultado-->
        <div v-else-if="terminou" class="resultado">
            <p class="subtitulo">Resultado</p>
            <p class="placar">{{ acertos }} de {{ listaDePerguntas.length }}</p>
            <p class="subtitulo">Você acertou {{ percentual }}% das perguntas.</p>
            <div class="acoes">
                <button class="btn btn-primario" @click="reiniciar">Jogar de novo</button>
                <router-link to="/quizzes" class="btn">Voltar para a lista</router-link>
            </div>
        </div>

        <!--Pergunta atual-->
        <div v-else-if="perguntaAtual">
            <p class="subtitulo">Pergunta {{ indice + 1 }} de {{ listaDePerguntas.length }}</p>
            <h2>{{ perguntaAtual.enunciado }}</h2>

            <div class="alternativas">
                <button
                    v-for="alternativa in alternativas"
                    :key="alternativa.letra"
                    class="alternativa"
                    :class="classeDaAlternativa(alternativa.letra)"
                    :disabled="respostaEscolhida !== ''"
                    @click="responder(alternativa.letra)"
                >
                    <strong>{{ alternativa.letra }})</strong> {{ alternativa.texto }}
                </button>
            </div>

            <div v-if="respostaEscolhida !== ''">
                <p class="mensagem" :class="{ erro: respostaEscolhida !== perguntaAtual.correta }">
                    {{ respostaEscolhida === perguntaAtual.correta ? 'Resposta certa.' : `Resposta errada. A correta é a ${perguntaAtual.correta}.` }}
                </p>
                <button class="btn btn-primario proxima" @click="proximaPergunta">
                    {{ indice + 1 === listaDePerguntas.length ? 'Ver resultado' : 'Próxima pergunta' }}
                </button>
            </div>
        </div>

        <div v-if="mensagem" class="mensagem erro">{{ mensagem }}</div>
    </div>
</template>

<script>
    //Importando instancia do axios (Centralizado no arquivo axiosInstance.js)
    import axiosInstance from "../services/axiosInstance";

    export default {
        name: 'JogarQuizView',
        data() {
            return {
                quizId: this.$route.params.id, //ID do quiz que veio na URL
                quiz: {},
                listaDePerguntas: [],
                carregado: false,        //true depois que as perguntas chegaram da API
                indice: 0,               //Posição da pergunta atual na lista
                respostaEscolhida: "",   //Letra que o jogador clicou ("" = ainda não respondeu)
                acertos: 0,
                terminou: false,
                mensagem: ""
            }
        },
        computed: { //Valores calculados a partir dos dados
            perguntaAtual() {
                return this.listaDePerguntas[this.indice];
            },
            alternativas() { //Transforma as 4 colunas do banco em uma lista para o v-for
                return [
                    { letra: "A", texto: this.perguntaAtual.alternativa_a },
                    { letra: "B", texto: this.perguntaAtual.alternativa_b },
                    { letra: "C", texto: this.perguntaAtual.alternativa_c },
                    { letra: "D", texto: this.perguntaAtual.alternativa_d },
                ];
            },
            percentual() {
                return Math.round((this.acertos / this.listaDePerguntas.length) * 100);
            }
        },
        async mounted(){ //Montagem do ciclo de vida do componente
            await this.getQuiz();
        },
        methods: {
            async getQuiz() { //Busca o quiz e as perguntas dele na API
                try{
                    const responseQuiz = await axiosInstance.get(`/quizzes/${this.quizId}`); //Envia requisição GET
                    this.quiz = responseQuiz.data;

                    const responsePerguntas = await axiosInstance.get(`/quizzes/${this.quizId}/perguntas`);
                    this.listaDePerguntas = responsePerguntas.data;
                    this.carregado = true;
                } catch (error){
                    const detalhe = error.response ? error.response.data.message : error.message;
                    this.mensagem = `Erro ao carregar quiz: ${detalhe}`;
                }
            },
            responder(letra) { //Chamado ao clicar em uma alternativa
                this.respostaEscolhida = letra;
                if (letra === this.perguntaAtual.correta) {
                    this.acertos++;
                }
            },
            proximaPergunta() {
                if (this.indice + 1 === this.listaDePerguntas.length) {
                    this.terminou = true; //Era a última pergunta
                } else {
                    this.indice++;
                    this.respostaEscolhida = "";
                }
            },
            classeDaAlternativa(letra) { //Pinta a alternativa de verde ou vermelho depois da resposta
                if (this.respostaEscolhida === "") {
                    return "";
                }
                if (letra === this.perguntaAtual.correta) {
                    return "certa";
                }
                if (letra === this.respostaEscolhida) {
                    return "errada";
                }
                return "";
            },
            reiniciar() {
                this.indice = 0;
                this.respostaEscolhida = "";
                this.acertos = 0;
                this.terminou = false;
            }
        }
    }
</script>

<style scoped>
    .jogar-quiz-view {
        max-width: 640px;
        margin: 0 auto;
    }

    .categoria {
        font-size: 12px;
        font-weight: 700;
        color: #4f3cf0;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .subtitulo {
        margin-bottom: 8px;
    }

    h1 {
        margin-bottom: 24px;
    }

    .alternativas {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 16px;
    }

    .alternativa {
        text-align: left;
        padding: 14px 16px;
        border: 1px solid #d6d3cc;
        border-radius: 10px;
        background-color: #ffffff;
        color: #141414;
        font-family: inherit;
        font-size: 16px;
        cursor: pointer;
    }

    .alternativa:hover:enabled {
        border-color: #4f3cf0;
    }

    .alternativa:disabled {
        cursor: default;
    }

    .alternativa.certa {
        background-color: #e6f4ec;
        border-color: #1f9d55;
        color: #17703d;
    }

    .alternativa.errada {
        background-color: #fdeceb;
        border-color: #e0443e;
        color: #b3261e;
    }

    .proxima {
        margin-top: 16px;
    }

    .placar {
        font-size: 56px;
        font-weight: 800;
        line-height: 1.1;
    }

    .resultado .acoes {
        margin-top: 16px;
    }
</style>
