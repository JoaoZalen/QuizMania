<template>
    <!--Foto de perfil; sem foto mostra as iniciais do nome-->
    <img v-if="foto" class="foto-usuario" :src="urlArquivo(foto)" :alt="nome" :style="tamanhoCss" />
    <span v-else class="foto-usuario iniciais" :style="tamanhoCss">{{ iniciais }}</span>
</template>

<script>
    import { urlArquivo } from "../services/axiosInstance";

    export default {
        name: "FotoUsuario",
        props: {
            nome: { type: String, default: "" },
            foto: { type: String, default: "" },
            tamanho: { type: Number, default: 32 }
        },
        computed: {
            iniciais() {
                return this.nome.split(" ").filter(Boolean).slice(0, 2).map(p => p[0]).join("").toUpperCase();
            },
            tamanhoCss() {
                return { width: `${this.tamanho}px`, height: `${this.tamanho}px`, fontSize: `${this.tamanho * 0.4}px` };
            }
        },
        methods: { urlArquivo }
    };
</script>

<style scoped>
    .foto-usuario {
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
    }

    .iniciais {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: #efedff;
        color: #4f3cf0;
        font-weight: 700;
    }
</style>
