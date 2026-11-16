<template>
    <div class="editar-quiz-view">
      <h1>Editar Quiz</h1>
      <p class="subtitulo">Altere os dados do quiz e salve.</p>
      <!--Mesmo formulário do cadastro, mas recebendo o ID que veio na URL (com ID = edição)-->
      <FormularioQuiz :id="$route.params.id" />
    </div>
</template>

<script>
    // Caminho relativo para o componente
    import FormularioQuiz from '../components/FormularioQuiz.vue'

    export default {
        name: 'EditarQuizView',
        components: {
            FormularioQuiz //O formulário de quiz usado na view
        }
    }
</script>
