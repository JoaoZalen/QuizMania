<template>
    <div class="quiz-card" v-for="quiz in quizzes" :key="quiz.id">
        <p class="categoria">{{ quiz.categoria }}</p>
        <h3>{{ quiz.titulo }}</h3>
        <p class="descricao">{{ quiz.descricao }}</p>
        <p class="total">{{ quiz.total_perguntas }} pergunta(s)</p>

        <div class="acoes">
            <router-link :to="`/quizzes/${quiz.id}/jogar`" class="btn btn-primario">Jogar</router-link>
            <router-link :to="`/quizzes/${quiz.id}/perguntas`" class="btn">Perguntas</router-link>
            <router-link :to="`/quizzes/${quiz.id}/editar`" class="btn">Editar</router-link>
            <!--O card não exclui sozinho: ele avisa a view (componente pai) com um evento-->
            <button class="btn btn-perigo" @click="$emit('excluir', quiz)">Excluir</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ListaQuizzes',
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
        margin: 10px 0 14px;
    }
</style>
