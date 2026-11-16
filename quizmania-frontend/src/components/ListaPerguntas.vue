<template>
    <div class="pergunta-card" v-for="(pergunta, index) in perguntas" :key="pergunta.id">
        <h3>{{ index + 1 }}. {{ pergunta.enunciado }}</h3>
        <video v-if="pergunta.midia_tipo === 'video'" class="midia" :src="urlArquivo(pergunta.midia_url)" controls preload="metadata"></video>
        <img v-else-if="pergunta.midia_tipo === 'imagem'" class="midia" :src="urlArquivo(pergunta.midia_url)" alt="" />

        <ul>
            <li :class="{ correta: pergunta.correta === 'A' }">A) {{ pergunta.alternativa_a }}</li>
            <li :class="{ correta: pergunta.correta === 'B' }">B) {{ pergunta.alternativa_b }}</li>
            <li :class="{ correta: pergunta.correta === 'C' }">C) {{ pergunta.alternativa_c }}</li>
            <li :class="{ correta: pergunta.correta === 'D' }">D) {{ pergunta.alternativa_d }}</li>
        </ul>

        <div class="acoes">
            <!--Avisa a view (componente pai) qual pergunta deve ser editada ou excluída-->
            <button class="btn" @click="$emit('editar', pergunta)">Editar</button>
            <button class="btn btn-perigo" @click="$emit('excluir', pergunta)">Excluir</button>
        </div>
    </div>
</template>

<script>
    import { urlArquivo } from "../services/axiosInstance";

    export default {
        name: 'ListaPerguntas',
        methods: { urlArquivo },
        props: {
            perguntas: {
                type: Array,
                required: true
            }
        },
        emits: ['editar', 'excluir'] //Eventos que este componente envia para o pai
    }
</script>

<style scoped>
    .pergunta-card {
        background-color: #ffffff;
        border: 1px solid #e7e5e0;
        border-radius: 12px;
        padding: 20px;
    }

    .pergunta-card .midia {
        max-height: 220px;
    }

    .pergunta-card h3 {
        font-size: 17px;
        margin-bottom: 10px;
    }

    ul {
        list-style: none;
        margin-bottom: 14px;
    }

    li {
        padding: 6px 10px;
        border-radius: 6px;
        color: #2a2a2a;
    }

    /* Destaca a alternativa certa */
    li.correta {
        background-color: #e6f4ec;
        color: #17703d;
        font-weight: 600;
    }
</style>
