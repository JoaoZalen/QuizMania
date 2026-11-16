# QuizMania

Site de quizzes de múltipla escolha: front-end em **Vue** consumindo uma **API em Node/Express**
com banco **MySQL** (pastas `quizmania-frontend` e `quizmania-backend-api`). Todos os dados
(usuários, quizzes, perguntas, fotos e vídeos) ficam gravados no banco.

A documentação completa da versão atual está em `contexto/Documentacao-QuizMania.pdf`
(também em `.docx`): arquitetura, cada arquivo, o fluxo de uma requisição do Vue até o banco e os
testes feitos.

## Como rodar (Vue + API)

Precisa de Node e do MySQL do XAMPP.

1. Ligue o **MySQL** no XAMPP.
2. Crie o banco: no phpMyAdmin, aba Importar, escolha `quizmania-backend-api/database/quizmania_db.sql`.
   Ele cria o banco `quizmania_db`, as tabelas e os dados iniciais: 20 usuários com 2 quizzes cada
   (4 perguntas por quiz: 3 com imagem e 1 com vídeo, todos do Wikimedia Commons).
   Login de qualquer usuário: e-mail `nome.sobrenome@quizmania.com` (ex.: `ana.ribeiro@quizmania.com`), senha `quizmania123`.
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

- Criar conta, entrar, sair, editar a conta (nome, e-mail, senha e foto de perfil) e apagar a conta.
- Cada quiz pertence a um usuário: só o autor edita ou exclui o quiz e as perguntas dele.
- Listar, cadastrar, editar e excluir quizzes, com imagem do quiz.
- Listar, cadastrar, editar e excluir as perguntas de cada quiz (4 alternativas, uma correta),
  com imagem ou vídeo (arquivo enviado ou link).
- Jogar um quiz: uma pergunta por vez, com o resultado no final.

Fotos e vídeos enviados pelo computador são gravados em `quizmania-backend-api/uploads/` e o
caminho fica salvo no banco. Senhas são guardadas com hash (scrypt) e o login gera um token
enviado no cabeçalho `Authorization`.

## Estrutura

```
quizmania-backend-api/        API RESTful em Node + Express
  server.js                   ponto de entrada
  .env                        porta e acesso ao banco
  config/db.js                conexão (pool) com o MySQL
  middlewares/middlewares.js  json, helmet, compression, morgan, cors
  routes/routes.js            URLs da API
  controllers/                UsuarioController.js, QuizController.js e PerguntaController.js
  models/                     Usuario.js, Quiz.js e Pergunta.js (os comandos SQL)
  utils/                      pathUtils.js, senha.js (hash e token), arquivos.js (uploads)
  uploads/                    fotos e vídeos enviados
  database/quizmania_db.sql   criação do banco e dados de exemplo
quizmania-frontend/           front em Vue 3 (Vue CLI)
  src/main.js, src/App.vue
  src/router/index.js         rotas das telas
  src/services/axiosInstance.js   endereço da API, usuário logado e token
  src/views/                  uma tela por arquivo
  src/components/             ListaQuizzes, FormularioQuiz, ListaPerguntas, FormularioConta,
                              CampoArquivo (imagem/vídeo), FotoUsuario
  src/assets/css/styles.css
contexto/                     documentação do projeto (PDF e Word)
```

## Rotas da API

Rotas marcadas com * exigem login (cabeçalho `Authorization: Bearer <token>`).

| Método | URL | O que faz |
|---|---|---|
| POST | `/login` | Entra (devolve o usuário e o token) |
| POST | `/logout` * | Sai (invalida o token) |
| GET | `/usuarios` | Lista os usuários |
| GET | `/usuarios/:id` | Busca um usuário |
| GET | `/usuarios/:id/quizzes` | Lista os quizzes de um usuário |
| POST | `/usuarios` | Cria conta |
| PUT | `/usuarios/:id` * | Edita a própria conta |
| DELETE | `/usuarios/:id` * | Apaga a própria conta e os quizzes dela |
| GET | `/quizzes` | Lista os quizzes |
| GET | `/quizzes/:id` | Busca um quiz |
| POST | `/quizzes * | Cadastra um quiz |
| PUT | `/quizzes/:id * | Atualiza um quiz |
| DELETE | `/quizzes/:id * | Exclui um quiz e as perguntas dele |
| GET | `/quizzes/:id/perguntas` | Lista as perguntas de um quiz |
| POST | `/quizzes/:id/perguntas * | Cadastra uma pergunta no quiz |
| GET | `/perguntas/:id` | Busca uma pergunta |
| PUT | `/perguntas/:id * | Atualiza uma pergunta |
| DELETE | `/perguntas/:id * | Exclui uma pergunta |

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
