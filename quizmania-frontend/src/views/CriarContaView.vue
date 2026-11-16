<template>
    <div class="criar-conta-view">
      <h1>Criar conta</h1>
      <p class="subtitulo">Com a conta você cria quizzes e só você pode editar os seus.</p>
      <FormularioConta /> <!--Sem "editando" = criar conta-->
    </div>
</template>

<script>
    // Caminho relativo para o componente
    import FormularioConta from '../components/FormularioConta.vue'

    export default {
        name: 'CriarContaView',
        components: {
            FormularioConta
        }
    }
</script>
