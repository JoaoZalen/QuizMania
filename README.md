# QuizMania

Site de quizzes de múltipla escolha. O repositório tem duas versões do projeto:

- **Versão atual**: front-end em **Vue** consumindo uma **API em Node/Express** com banco **MySQL**
  (pastas `quizmania-frontend` e `quizmania-backend-api`).
- **Protótipo original**: front-end em JavaScript puro, sem back-end, com os dados no `localStorage`
  (`index.html` e `src/` na raiz). Foi o ponto de partida e continua aqui como referência.

A documentação completa da versão atual está em `contexto/Documentacao-QuizMania.pdf`
(também em `.docx`): arquitetura, cada arquivo, o fluxo de uma requisição do Vue até o banco e os
testes feitos.

## Como rodar (Vue + API)

Precisa de Node e do MySQL do XAMPP.

1. Ligue o **MySQL** no XAMPP.
2. Crie o banco: no phpMyAdmin, aba Importar, escolha `quizmania-backend-api/database/quizmania_db.sql`.
   Ele cria o banco `quizmania_db`, as tabelas e 3 quizzes de exemplo.
3. Em um terminal, suba a API (porta 3000):

   ```
   cd quizmania-backend-api
   npm install
   npm start
   ```

4. Em outro terminal, suba o front (porta 8080):

   ```
   cd quizmania-frontend
   npm install
   npm run serve
   ```

5. Abra `http://localhost:8080`.

Os dois terminais ficam abertos ao mesmo tempo. O `npm install` só é necessário na primeira vez.
Usuário e senha do banco ficam em `quizmania-backend-api/.env` (padrão do XAMPP: `root` sem senha).

## O que a versão atual faz

- Listar, cadastrar, editar e excluir quizzes.
- Listar, cadastrar, editar e excluir as perguntas de cada quiz (4 alternativas, uma correta).
- Jogar um quiz: uma pergunta por vez, com o resultado no final.

## Estrutura

```
quizmania-backend-api/        API RESTful em Node + Express
  server.js                   ponto de entrada
  .env                        porta e acesso ao banco
  config/db.js                conexão (pool) com o MySQL
  middlewares/middlewares.js  json, helmet, compression, morgan, cors
  routes/routes.js            URLs da API
  controllers/                QuizController.js e PerguntaController.js
  models/                     Quiz.js e Pergunta.js (os comandos SQL)
  utils/pathUtils.js
  database/quizmania_db.sql   criação do banco e dados de exemplo
quizmania-frontend/           front em Vue 3 (Vue CLI)
  src/main.js, src/App.vue
  src/router/index.js         rotas das telas
  src/services/axiosInstance.js   endereço da API
  src/views/                  uma tela por arquivo
  src/components/             ListaQuizzes, FormularioQuiz, ListaPerguntas
  src/assets/css/styles.css
contexto/                     documentação do projeto (PDF e Word)
index.html, src/              protótipo original (ver abaixo)
```

## Rotas da API

| Método | URL | O que faz |
|---|---|---|
| GET | `/quizzes` | Lista os quizzes |
| GET | `/quizzes/:id` | Busca um quiz |
| POST | `/quizzes` | Cadastra um quiz |
| PUT | `/quizzes/:id` | Atualiza um quiz |
| DELETE | `/quizzes/:id` | Exclui um quiz e as perguntas dele |
| GET | `/quizzes/:id/perguntas` | Lista as perguntas de um quiz |
| POST | `/quizzes/:id/perguntas` | Cadastra uma pergunta no quiz |
| GET | `/perguntas/:id` | Busca uma pergunta |
| PUT | `/perguntas/:id` | Atualiza uma pergunta |
| DELETE | `/perguntas/:id` | Exclui uma pergunta |

## Protótipo original

Site no estilo Quizur, só front-end, com os dados no `localStorage`. A estrutura já imitava a de um
projeto Vue para facilitar a migração.

### Como rodar o protótipo

Precisa de um servidor (os arquivos usam `import`/`export`, que não funcionam abrindo o HTML direto):

- XAMPP: ligue o Apache e abra a pasta do projeto, por exemplo `http://localhost/quizmania/`
- Sem Apache: `python -m http.server 5180 --directory <pasta do projeto>` e abrir `http://localhost:5180`

### Estrutura do protótipo

```
index.html                  só carrega o CSS e o src/main.js
src/
  main.js                   ponto de entrada
  App.js                    layout (header/conteúdo/footer)
  router/index.js           rotas
  store/estado.js           estado compartilhado
  services/
    api.js                  todas as leituras/gravações de dados
    storage.js              acesso ao localStorage (só o api.js usa)
    seed.js                 cria os quizzes de exemplo
  views/                    uma tela por arquivo
    HomeView.js             /
    EntrarView.js           /entrar  (e /entrar?cadastro)
    CriarQuizView.js        /criar e /editar/:id
    QuizView.js             /quiz/:id
    PerfilView.js           /u/:usuario e /u/:usuario/historico
    MeuPerfilView.js        /perfil (redireciona)
    EditarPerfilView.js     /perfil/editar
    NaoEncontradoView.js    404
  components/               pedaços reutilizáveis
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

### Funcionalidades do protótipo

- Dois tipos de quiz: **personalidade** ("qual herói você seria?", cada resposta conta ponto
  para um resultado) e **certo ou errado** (nota no final).
- Criador de quiz com capa, resultados com foto, 2 a 6 respostas por pergunta e mídia por
  pergunta (imagem, GIF, YouTube ou vídeo).
- Perfil público, edição de perfil (nome, bio, avatar com iniciais ou foto) e histórico.
- Home com carrossel dos mais jogados, categorias, busca no header, filtro por tipo,
  ordenação e paginação de 50 quizzes por página.
- Tela do quiz em "modo foco": conteúdo no meio da tela e sem rodapé.
- ~100 quizzes de exemplo de 24 autores, com quantidade de perguntas variada e
  **nenhuma pergunta repetida entre quizzes**.

### Mídia nas perguntas

Cada pergunta pode ter `midia: { tipo, url }`:
- `imagem` — arquivo enviado (reduzido) ou link
- `gif` — arquivo enviado (mantido animado, até 2,5 MB) ou link `.gif` / Giphy / Tenor
- `youtube` — link do YouTube (watch, youtu.be, shorts); `url` guarda só o ID do vídeo
- `video` — link direto de vídeo (.mp4, .webm)

Funções em `src/utils/midia.js`; campo do editor em `components/criar/CampoMidia.js`.

### Fotos

As capas vêm do Wikimedia Commons (licenças livres). O crédito de cada foto aparece
na página do quiz, como a licença exige. Fotos enviadas por usuários ficam salvas no
navegador (reduzidas para caber no `localStorage`).

## Contexto do projeto

### Objetivo
Site de quizzes no estilo Quizur. A ideia completa é o público criar conta com nome de usuário,
montar os próprios quizzes, jogar os quizzes dos outros e colocar mídia em cada pergunta. O
protótipo cobre essa ideia só no front-end; a versão em **Vue** com **API** e **MySQL** implementa
a parte central (quizzes, perguntas e jogar) com os dados guardados no banco.

### Decisões de design (e por quê)
- **Sem emojis** e sem visual genérico (gradiente roxo, slogans vazios).
- Primeiro foram testadas ilustrações cartoon; ficou **infantil demais**. A troca foi para
  **fotos reais** (Wikimedia Commons), avatares com iniciais e visual mais editorial.
- Tipografia do protótipo: *Bricolage Grotesque* (títulos) + *DM Sans* (texto). Fundo off-white,
  preto como cor principal e violeta `#4f3cf0` só como destaque. Bordas finas, sem
  sombras "3D". A versão em Vue usa a mesma paleta, com fonte do sistema.
- Layout fluido que ocupa a largura toda da tela (margem lateral proporcional).
- Referência de energia visual: Kahoot (cores fortes nas respostas), mas sem copiar a marca.

### Regras do projeto (combinadas durante o desenvolvimento)
- **Nunca usar emoji** como imagem ou decoração; usar fotos/imagens de verdade.
- **Nada de visual genérico**: sem gradiente roxo, sem slogan vazio, sem mensagens tipo
  "Mandou bem!". Textos diretos e específicos.
- **Nada infantil**: sem carinhas em objetos, sem botões "3D" gordinhos, sem fonte arredondada.
- **Código separado por tela e função**, na estrutura de um projeto Vue.
- **Na versão Vue + API, seguir o modelo passado em aula**: Express com pastas `config`,
  `controllers`, `middlewares`, `models`, `routes` e `utils`; Vue com Options API, `axios`
  centralizado em `services/axiosInstance.js` e `vue-router`. Sem bibliotecas além dessas.
- **Commits só com a conta JoaoZalen** (`joaozplays2@gmail.com`), sem linhas de coautoria.

### Linha do tempo
1. Primeiro protótipo (HTML/CSS/JS num arquivo só), visual minimalista.
2. Pedido de imagens de verdade em vez de emoji → ilustrações cartoon em SVG, dois tipos de
   quiz e perfil do usuário. Referência visual: página do Kahoot.
3. Remoção de tudo com cara de "gerado": textos e cores mais diretos.
4. Header, footer, carrossel e ~100 quizzes de exemplo com autores e tamanhos variados.
5. "Está infantil" → tipografia e paleta mais sóbrias, sem carinhas; layout ocupando a tela toda.
6. Ainda infantil → troca dos desenhos por **fotos reais** (Wikimedia Commons) e avatares com iniciais.
7. Código separado em arquivos por tela/função na estrutura do Vue.
8. Paginação de 50 por página, rodapé refeito, tela do quiz centralizada (modo foco).
9. Mídia nas perguntas (imagem, GIF, YouTube, vídeo) e perguntas únicas em todos os quizzes.
10. Versão em Vue com API em Node/Express e banco MySQL: CRUD de quizzes e de perguntas, e jogar.

### O que o protótipo tem e a versão Vue ainda não
- Contas de usuário, perfil e histórico.
- Quiz de personalidade (a versão Vue só tem certo ou errado).
- Capa, fotos de resultado e mídia nas perguntas.
- Home com carrossel, busca, filtros e paginação.
