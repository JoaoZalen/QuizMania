<template>
    <div class="campo-arquivo">
        <input type="file" :accept="aceita" @change="escolherArquivo" />
        <input type="text" placeholder="ou cole o link (https://...)" :value="ehLink ? modelValue : ''" @input="$emit('update:modelValue', $event.target.value)" />

        <div v-if="modelValue" class="previa">
            <video v-if="tipo === 'video'" :src="urlArquivo(modelValue)" controls></video>
            <img v-else :src="urlArquivo(modelValue)" alt="Prévia" />
            <button type="button" class="btn btn-perigo" @click="$emit('update:modelValue', '')">Remover</button>
        </div>
    </div>
</template>

<script>
    import { urlArquivo } from "../services/axiosInstance";

    export default {
        name: "CampoArquivo",
        props: {
            modelValue: { type: String, default: "" }, //Link, caminho salvo (/uploads/...) ou arquivo em base64
            tipo: { type: String, default: "imagem" }   //'imagem' ou 'video'
        },
        emits: ["update:modelValue"],
        computed: {
            aceita() {
                return this.tipo === "video" ? "video/mp4,video/webm" : "image/jpeg,image/png,image/gif,image/webp";
            },
            ehLink() {
                return this.modelValue.startsWith("http");
            }
        },
        methods: {
            urlArquivo,
            escolherArquivo(evento) { //Lê o arquivo escolhido e envia em base64 junto com o formulário
                const arquivo = evento.target.files[0];
                if (!arquivo) return;
                const limite = this.tipo === "video" ? 40 : 5; //MB
                if (arquivo.size > limite * 1024 * 1024) {
                    alert(`Arquivo muito grande. Máximo de ${limite} MB.`);
                    evento.target.value = "";
                    return;
                }
                const leitor = new FileReader();
                leitor.onload = () => this.$emit("update:modelValue", leitor.result);
                leitor.readAsDataURL(arquivo);
            }
        }
    };
</script>

<style scoped>
    .campo-arquivo input[type="file"] {
        margin-bottom: 8px;
    }

    .previa {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 16px;
    }

    .previa img,
    .previa video {
        max-width: 220px;
        max-height: 150px;
        border-radius: 8px;
        border: 1px solid #e7e5e0;
    }
</style>
