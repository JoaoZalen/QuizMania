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

## Contexto do projeto

### Objetivo
Site de quizzes no estilo Quizur, rodando no XAMPP (`htdocs/quizmania`). O público cria
conta com nome de usuário, monta os próprios quizzes, joga os quizzes dos outros e coloca
mídia em cada pergunta. Por enquanto é só o front-end funcional; depois o projeto vai para
**Vue** com um back-end separado acessado por **API**.

### Funcionalidades
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

### Decisões de design (e por quê)
- **Sem emojis** e sem visual genérico (gradiente roxo, slogans vazios).
- Primeiro foram testadas ilustrações cartoon; ficou **infantil demais**. A troca foi para
  **fotos reais** (Wikimedia Commons), avatares com iniciais e visual mais editorial.
- Tipografia: *Bricolage Grotesque* (títulos) + *DM Sans* (texto). Fundo off-white,
  preto como cor principal e violeta `#4f3cf0` só como destaque. Bordas finas, sem
  sombras "3D".
- Layout fluido que ocupa a largura toda da tela (margem lateral proporcional).
- Referência de energia visual: Kahoot (cores fortes nas respostas), mas sem copiar a marca.

### Organização do código
Separado por tela e por função, imitando um projeto Vue (ver **Estrutura** acima), para que
cada arquivo de `views/` e `components/` vire um `.vue` na migração e o `services/api.js`
seja o único ponto a trocar por chamadas HTTP.

### Regras do projeto (combinadas durante o desenvolvimento)
- **Nunca usar emoji** como imagem ou decoração; usar fotos/imagens de verdade.
- **Nada de visual genérico**: sem gradiente roxo, sem slogan vazio, sem mensagens tipo
  "Mandou bem!". Textos diretos e específicos.
- **Nada infantil**: sem carinhas em objetos, sem botões "3D" gordinhos, sem fonte arredondada.
- **Back-end fica para depois**: o front só precisa funcionar com `localStorage`; a troca
  será feita no `services/api.js` quando o projeto for para Vue + API.
- **Código separado por tela e função**, já na estrutura de um projeto Vue.
- **Commits só com a conta JoaoZalen** (`joaozplays2@gmail.com`), sem linhas de coautoria.
- Para testar sem Apache: `python -m http.server 5180 --directory C:/xampp/htdocs/quizmania`
  e abrir `http://localhost:5180`.

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

### Próximos passos
- Migrar para Vue (Vite + vue-router + Pinia) reaproveitando views, componentes e CSS.
- Criar o back-end com API (contas com senha criptografada, quizzes, jogadas, upload de mídia).
- Guardar as mídias enviadas no servidor em vez do `localStorage`.
