<template>
    <div class="cadastrar-quiz-view">
      <h1>Cadastrar Quiz</h1>
      <p class="subtitulo">Depois de cadastrar, você vai para a tela de perguntas do quiz.</p>
      <FormularioQuiz /> <!--Inclusão do componente formulário (sem ID = cadastro)-->
    </div>
</template>

<script>
    // Caminho relativo para o componente
    import FormularioQuiz from '../components/FormularioQuiz.vue'

    export default {
        name: 'CadastrarQuizView',
        components: {
            FormularioQuiz //O formulário de quiz usado na view
        }
    }
</script>
