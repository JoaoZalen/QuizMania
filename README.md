# QuizMania — protótipo de front-end

Site de quizzes estilo Quizur. Sem back-end ainda: os dados ficam no `localStorage`.
A estrutura já segue a de um projeto Vue para facilitar a migração.

## Como rodar

Precisa de um servidor (os arquivos usam `import`/`export`, que não funcionam abrindo o HTML direto):

- XAMPP: ligue o Apache e abra `http://localhost/quizmania/`

## Estrutura

```
index.html                  só carrega o CSS e o src/main.js
src/
  main.js                   ponto de entrada         → main.js do Vue
  App.js                    layout (header/conteúdo/footer) → App.vue
  router/index.js           rotas                    → vue-router
  store/estado.js           estado compartilhado     → Pinia
  services/
    api.js                  TODAS as leituras/gravações de dados (trocar por axios/fetch)
    storage.js              acesso ao localStorage (só o api.js usa)
    seed.js                 cria os quizzes de exemplo
  views/                    uma tela por arquivo     → src/views/*.vue
    HomeView.js             /
    EntrarView.js           /entrar  (e /entrar?cadastro)
    CriarQuizView.js        /criar e /editar/:id
    QuizView.js             /quiz/:id
    PerfilView.js           /u/:usuario e /u/:usuario/historico
    MeuPerfilView.js        /perfil (redireciona)
    EditarPerfilView.js     /perfil/editar
    NaoEncontradoView.js    404
  components/               pedaços reutilizáveis  → src/components/*.vue
    CabecalhoSite, RodapeSite, LogoMarca, CardQuiz, CarrosselDestaques,
    ListaCategorias, RankingCriadores, BlocoCriarQuiz, CreditoFoto
    criar/  EscolherTipoQuiz, EditorQuiz
    quiz/   IntroQuiz, JogoQuiz, ResultadoQuiz
  constants/categorias.js   categorias, letras e cores das respostas
  utils/                    dom, formatar, imagens, icones
  data/
    exemplos.js             gera os ~100 quizzes e 24 autores de exemplo (nenhuma pergunta se repete)
    tabelas.js              tabelas de dados reais que viram perguntas (capitais, elementos, datas…)
    personalidade.js        banco de perguntas dos quizzes de personalidade
    fotos.js                fotos de capa e de resultado (Wikimedia Commons, com autor e licença)
    midias.js               fotos, vídeos e GIFs das perguntas (Wikimedia Commons)
  assets/css/
    main.css                importa os outros
    base.css                variáveis, botões, campos
    components/*.css        um por componente
    views/*.css             um por tela
```

## Ligando no back-end depois

Só o `src/services/api.js` conversa com os dados. Cada função já é `async` e devolve o
mesmo formato que a API real deve devolver. Exemplo:

```js
// hoje
export async function listarQuizzes() { return storage.get('quizzes', []); }
// com back-end
export async function listarQuizzes() { return (await axios.get('/api/quizzes')).data; }
```

## Mídia nas perguntas

Cada pergunta pode ter `midia: { tipo, url }`:
- `imagem` — arquivo enviado (reduzido) ou link
- `gif` — arquivo enviado (mantido animado, até 2,5 MB) ou link `.gif` / Giphy / Tenor
- `youtube` — link do YouTube (watch, youtu.be, shorts); `url` guarda só o ID do vídeo
- `video` — link direto de vídeo (.mp4, .webm)

Funções em `src/utils/midia.js`; campo do editor em `components/criar/CampoMidia.js`.

## Fotos

As capas vêm do Wikimedia Commons (licenças livres). O crédito de cada foto aparece
na página do quiz, como a licença exige. Fotos enviadas por usuários ficam salvas no
navegador (reduzidas para caber no `localStorage`).
