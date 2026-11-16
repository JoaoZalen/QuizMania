//Cria uma instância principal da aplicação Vue
import { createApp } from 'vue'

//Importa o componente raiz App.vue, renderizado no index.html
import App from './App.vue'

//Importa as rotas das páginas configuradas
import router from './router'

//Importa o arquivo de CSS global - src/assets/css
import './assets/css/styles.css';

//Cria o app com o componente raiz (APP), usa rotas e monta div #app no index.html
createApp(App).use(router).mount('#app')
