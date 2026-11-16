<template>
    <div class="quiz-card" v-for="quiz in quizzes" :key="quiz.id">
        <img v-if="quiz.imagem" class="capa" :src="urlArquivo(quiz.imagem)" :alt="quiz.titulo" />
        <p class="categoria">{{ quiz.categoria }}</p>
        <h3>{{ quiz.titulo }}</h3>
        <p class="descricao">{{ quiz.descricao }}</p>
        <p class="total">{{ quiz.total_perguntas }} pergunta(s)</p>
        <p class="autor">
            <FotoUsuario :nome="quiz.autor_nome" :foto="quiz.autor_foto || ''" :tamanho="24" />
            {{ quiz.autor_nome }}
        </p>

        <div class="acoes">
            <router-link :to="`/quizzes/${quiz.id}/jogar`" class="btn btn-primario">Jogar</router-link>
            <!--Só o autor do quiz vê as opções de alterar-->
            <template v-if="sessao.usuario && sessao.usuario.id === quiz.usuario_id">
                <router-link :to="`/quizzes/${quiz.id}/perguntas`" class="btn">Perguntas</router-link>
                <router-link :to="`/quizzes/${quiz.id}/editar`" class="btn">Editar</router-link>
                <!--O card não exclui sozinho: ele avisa a view (componente pai) com um evento-->
                <button class="btn btn-perigo" @click="$emit('excluir', quiz)">Excluir</button>
            </template>
        </div>
    </div>
</template>

<script>
    import FotoUsuario from './FotoUsuario.vue';
    import { sessao, urlArquivo } from "../services/axiosInstance";

    export default {
        name: 'ListaQuizzes',
        components: { FotoUsuario },
        data() {
            return { sessao } //Usuário logado (reativo)
        },
        methods: { urlArquivo },
        props: {
            quizzes: {
                type: Array,
                required: true
            }
        },
        emits: ['excluir'] //Eventos que este componente envia para o pai
    }
</script>

<style scoped>
    .quiz-card {
        background-color: #ffffff;
        border: 1px solid #e7e5e0;
        border-radius: 12px;
        padding: 20px;
    }

    .capa {
        display: block;
        width: calc(100% + 40px);
        height: 160px;
        margin: -20px -20px 14px;
        object-fit: cover;
        border-radius: 12px 12px 0 0;
    }

    .autor {
        margin-bottom: 14px;
    }

    .categoria {
        font-size: 12px;
        font-weight: 700;
        color: #4f3cf0;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .quiz-card h3 {
        font-size: 20px;
        margin: 4px 0;
    }

    .descricao {
        color: #6f6f6f;
    }

    .total {
        font-size: 14px;
        font-weight: 600;
        margin: 10px 0 10px;
    }
</style>
