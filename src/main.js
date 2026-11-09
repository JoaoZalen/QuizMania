// Ponto de entrada (equivale ao main.js do Vue: createApp(App).use(router).mount('#app'))
import { semear } from './services/seed.js';
import { montarApp } from './App.js';

semear();
montarApp(document.getElementById('app'));
