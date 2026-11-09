// Dados de exemplo: ~100 quizzes, 24 autores, quantidade de perguntas variada.
// As capas e fotos de resultado vêm do Wikimedia Commons (data/fotos.js).
import { FOTOS } from './fotos.js';
import { MIDIAS } from './midias.js';
import { perguntasDeTabelas, termosDeBusca } from './tabelas.js';
import { PERGUNTAS_PERSONALIDADE } from './personalidade.js';

// Formato das perguntas de acerto: [pergunta, resposta certa, errada, errada, errada?]
// gerador pseudo-aleatório com semente (o resultado é sempre o mesmo)
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const R = rng(2026);
const int = (a, b) => a + Math.floor(R() * (b - a + 1));
const pega = arr => arr[Math.floor(R() * arr.length)];
const embaralha = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ---------- autores ----------
const AUTORES = [
  ['marina.lopes', 'Marina Lopes', 'Faço quiz de tudo que eu assisto.'],
  ['prof_caio', 'Caio Ribeiro', 'Professor de geografia nas horas vagas.'],
  ['zezinho_gamer', 'Zé', 'Zerei mais jogo do que deveria.'],
  ['bia.santos', 'Bia Santos', 'Bióloga e fã de bicho estranho.'],
  ['lucas_dev', 'Lucas', 'Programador. Faço quiz no intervalo do código.'],
  ['ana.clara', 'Ana Clara', ''],
  ['pedrohq', 'Pedro', 'Quadrinhos, filmes e café.'],
  ['julia.m', 'Júlia Martins', 'Estudante de medicina.'],
  ['rafa_otaku', 'Rafa', 'Assisto anime desde os 8.'],
  ['tio.beto', 'Beto', 'Contando história desde 1975.'],
  ['camila_music', 'Camila', 'Toco violão e piano.'],
  ['gui.futebol', 'Guilherme', 'Futebol de segunda a segunda.'],
  ['leticia.r', 'Letícia Rocha', 'Revisora de texto. Sim, eu reparo na vírgula.'],
  ['nando_astro', 'Fernando', 'Telescópio no quintal.'],
  ['duda.quiz', 'Duda', 'Faço quiz de personalidade pros amigos.'],
  ['mateus.exatas', 'Mateus', 'Engenharia, 5º semestre.'],
  ['isa.cine', 'Isabela', 'Cinéfila de carteirinha.'],
  ['vini_lol', 'Vinícius', ''],
  ['carol.viaja', 'Carol', 'Já fui pra 14 países.'],
  ['joaovitor', 'João Vitor', ''],
  ['nath.bio', 'Nathália', 'Professora de ciências.'],
  ['kaique.br', 'Kaique', 'História do Brasil é minha praia.'],
  ['manu_pop', 'Manu', 'Pop, k-pop e tudo que toca na rádio.'],
  ['thiago.tech', 'Thiago', 'Suporte técnico. Já reiniciou?'],
];

// ---------- bancos de perguntas (acerto) ----------
const B = {
  brasil: [
    ['Qual é a capital do Brasil?', 'Brasília', 'Rio de Janeiro', 'São Paulo', 'Salvador'],
    ['Quantos estados o Brasil tem, sem contar o DF?', '26', '24', '27', '25'],
    ['Qual é o maior bioma brasileiro?', 'Amazônia', 'Cerrado', 'Caatinga', 'Pampa'],
    ['Qual estado faz fronteira com o Uruguai?', 'Rio Grande do Sul', 'Paraná', 'Santa Catarina', 'Mato Grosso do Sul'],
    ['Qual é a capital da Bahia?', 'Salvador', 'Feira de Santana', 'Ilhéus', 'Porto Seguro'],
    ['Qual é a capital de Minas Gerais?', 'Belo Horizonte', 'Uberlândia', 'Juiz de Fora', 'Ouro Preto'],
    ['Qual é o maior estado do Brasil em área?', 'Amazonas', 'Pará', 'Mato Grosso', 'Minas Gerais'],
    ['Qual é o menor estado do Brasil em área?', 'Sergipe', 'Alagoas', 'Espírito Santo', 'Rio de Janeiro'],
    ['Em qual região fica o estado de Goiás?', 'Centro-Oeste', 'Norte', 'Sudeste', 'Nordeste'],
    ['Qual rio passa pela cidade de Manaus?', 'Rio Negro', 'Rio São Francisco', 'Rio Paraná', 'Rio Tietê'],
    ['As Cataratas do Iguaçu ficam em qual estado?', 'Paraná', 'Santa Catarina', 'Mato Grosso do Sul', 'São Paulo'],
    ['Qual é a capital do Pará?', 'Belém', 'Santarém', 'Marabá', 'Macapá'],
    ['Qual é a cidade mais populosa do Brasil?', 'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
    ['Florianópolis é capital de qual estado?', 'Santa Catarina', 'Paraná', 'Rio Grande do Sul', 'Espírito Santo'],
    ['Qual estado tem a sigla TO?', 'Tocantins', 'Tocantins do Sul', 'Toledo', 'Teresina'],
    ['Qual é a capital do Ceará?', 'Fortaleza', 'Juazeiro do Norte', 'Sobral', 'Natal'],
    ['O Pantanal fica principalmente em quais estados?', 'MT e MS', 'GO e TO', 'PA e AM', 'BA e MG'],
    ['Qual é a capital do Acre?', 'Rio Branco', 'Cruzeiro do Sul', 'Porto Velho', 'Boa Vista'],
    ['Fernando de Noronha pertence a qual estado?', 'Pernambuco', 'Rio Grande do Norte', 'Paraíba', 'Ceará'],
    ['Qual é a capital do Espírito Santo?', 'Vitória', 'Vila Velha', 'Serra', 'Cariacica'],
  ],
  mundo: [
    ['Qual é a capital da França?', 'Paris', 'Lyon', 'Marselha', 'Nice'],
    ['Qual é a capital do Japão?', 'Tóquio', 'Osaka', 'Kyoto', 'Hiroshima'],
    ['Qual é a capital da Austrália?', 'Camberra', 'Sydney', 'Melbourne', 'Perth'],
    ['Qual é a capital do Canadá?', 'Ottawa', 'Toronto', 'Vancouver', 'Montreal'],
    ['Qual é a capital da Argentina?', 'Buenos Aires', 'Córdoba', 'Rosário', 'Mendoza'],
    ['Qual é o maior país do mundo em área?', 'Rússia', 'Canadá', 'China', 'Estados Unidos'],
    ['Qual é o maior oceano?', 'Pacífico', 'Atlântico', 'Índico', 'Ártico'],
    ['Em qual continente fica o Egito?', 'África', 'Ásia', 'Europa', 'Oceania'],
    ['Qual é a capital da Itália?', 'Roma', 'Milão', 'Veneza', 'Florença'],
    ['Qual é a capital da Alemanha?', 'Berlim', 'Munique', 'Hamburgo', 'Frankfurt'],
    ['Qual é o rio mais longo da América do Sul?', 'Amazonas', 'Paraná', 'Orinoco', 'São Francisco'],
    ['Qual é a capital de Portugal?', 'Lisboa', 'Porto', 'Coimbra', 'Braga'],
    ['Qual país tem formato de bota?', 'Itália', 'Grécia', 'Espanha', 'Chile'],
    ['Qual é a montanha mais alta do mundo?', 'Everest', 'K2', 'Aconcágua', 'Kilimanjaro'],
    ['Qual é a capital do México?', 'Cidade do México', 'Guadalajara', 'Cancún', 'Monterrey'],
    ['Qual é a capital da Espanha?', 'Madri', 'Barcelona', 'Sevilha', 'Valência'],
    ['Qual é o maior deserto quente do mundo?', 'Saara', 'Atacama', 'Gobi', 'Kalahari'],
    ['Qual é a capital do Chile?', 'Santiago', 'Valparaíso', 'Antofagasta', 'Concepción'],
    ['Qual é a capital da Coreia do Sul?', 'Seul', 'Busan', 'Incheon', 'Pyongyang'],
    ['Qual país é conhecido como Terra do Sol Nascente?', 'Japão', 'China', 'Tailândia', 'Coreia do Sul'],
    ['Qual é a capital do Egito?', 'Cairo', 'Alexandria', 'Luxor', 'Gizé'],
    ['Quantos continentes são considerados normalmente?', '6', '5', '7', '8'],
  ],
  ciencia: [
    ['Qual é a fórmula química da água?', 'H₂O', 'CO₂', 'O₂', 'NaCl'],
    ['Qual gás as plantas absorvem na fotossíntese?', 'Gás carbônico', 'Oxigênio', 'Nitrogênio', 'Hélio'],
    ['Qual é o planeta mais próximo do Sol?', 'Mercúrio', 'Vênus', 'Marte', 'Terra'],
    ['A que temperatura a água ferve ao nível do mar?', '100 °C', '90 °C', '80 °C', '120 °C'],
    ['Qual é a unidade de medida de força?', 'Newton', 'Joule', 'Watt', 'Pascal'],
    ['O que a célula usa para produzir energia?', 'Mitocôndria', 'Ribossomo', 'Núcleo', 'Vacúolo'],
    ['Qual é o estado físico do gelo?', 'Sólido', 'Líquido', 'Gasoso', 'Plasma'],
    ['Qual cientista formulou a teoria da relatividade?', 'Albert Einstein', 'Isaac Newton', 'Galileu Galilei', 'Marie Curie'],
    ['Quantos elementos tem a tabela periódica hoje?', '118', '108', '100', '128'],
    ['Qual é o gás mais abundante na atmosfera?', 'Nitrogênio', 'Oxigênio', 'Gás carbônico', 'Argônio'],
    ['O som se propaga no vácuo?', 'Não', 'Sim', 'Só sons graves', 'Só de dia'],
    ['Qual é a velocidade aproximada da luz?', '300 mil km/s', '30 mil km/s', '3 mil km/s', '3 milhões km/s'],
    ['Qual é o pH da água pura?', '7', '0', '14', '5'],
    ['Quem é conhecido pela lei da gravitação universal?', 'Isaac Newton', 'Einstein', 'Darwin', 'Tesla'],
    ['O que mede um termômetro?', 'Temperatura', 'Pressão', 'Umidade', 'Velocidade'],
    ['A teoria da evolução por seleção natural é de quem?', 'Charles Darwin', 'Gregor Mendel', 'Louis Pasteur', 'Lamarck'],
    ['Qual é o metal líquido à temperatura ambiente?', 'Mercúrio', 'Chumbo', 'Alumínio', 'Zinco'],
  ],
  historia: [
    ['Em que ano o Brasil declarou independência?', '1822', '1500', '1889', '1808'],
    ['Quem declarou a independência do Brasil?', 'Dom Pedro I', 'Dom Pedro II', 'Tiradentes', 'Deodoro da Fonseca'],
    ['Em que ano foi proclamada a República no Brasil?', '1889', '1822', '1888', '1930'],
    ['Qual lei aboliu a escravidão no Brasil?', 'Lei Áurea', 'Lei do Ventre Livre', 'Lei dos Sexagenários', 'Lei Eusébio de Queirós'],
    ['Em que ano a Lei Áurea foi assinada?', '1888', '1822', '1871', '1899'],
    ['Quem assinou a Lei Áurea?', 'Princesa Isabel', 'Dom Pedro II', 'Dona Leopoldina', 'Deodoro'],
    ['Quem chegou ao Brasil em 1500 com a frota portuguesa?', 'Pedro Álvares Cabral', 'Vasco da Gama', 'Cristóvão Colombo', 'Américo Vespúcio'],
    ['Qual foi a primeira capital do Brasil?', 'Salvador', 'Rio de Janeiro', 'Brasília', 'Recife'],
    ['Em que ano Brasília foi inaugurada?', '1960', '1950', '1945', '1970'],
    ['Qual presidente criou Brasília?', 'Juscelino Kubitschek', 'Getúlio Vargas', 'Jânio Quadros', 'Café Filho'],
    ['Tiradentes participou de qual movimento?', 'Inconfidência Mineira', 'Revolta da Vacina', 'Cabanagem', 'Farroupilha'],
    ['Qual era o principal produto do Brasil no início da colonização?', 'Pau-brasil', 'Café', 'Borracha', 'Soja'],
    ['A Revolução Farroupilha aconteceu em qual região?', 'Sul', 'Nordeste', 'Norte', 'Centro-Oeste'],
    ['Quem foi o primeiro presidente do Brasil?', 'Deodoro da Fonseca', 'Floriano Peixoto', 'Prudente de Morais', 'Getúlio Vargas'],
    ['Em que ano começou a Segunda Guerra Mundial?', '1939', '1914', '1945', '1929'],
    ['Qual povo construiu as pirâmides de Gizé?', 'Egípcios', 'Romanos', 'Gregos', 'Maias'],
  ],
  games: [
    ['Em qual jogo você constrói tudo com blocos?', 'Minecraft', 'Fortnite', 'FIFA', 'Tetris'],
    ['Qual desses consoles é da Nintendo?', 'Switch', 'PlayStation', 'Xbox', 'Mega Drive'],
    ['Qual empresa fabrica o PlayStation?', 'Sony', 'Microsoft', 'Nintendo', 'Sega'],
    ['Qual empresa fabrica o Xbox?', 'Microsoft', 'Sony', 'Nintendo', 'Apple'],
    ['Em Tetris, o que você encaixa?', 'Peças de blocos', 'Cartas', 'Bolas', 'Palavras'],
    ['Qual é o nome do encanador mais famoso dos games?', 'Mario', 'Luigi Jr.', 'Wario', 'Toad'],
    ['Sonic é um…', 'Ouriço', 'Rato', 'Gato', 'Raposa'],
    ['Em Among Us, quem tenta sabotar a nave?', 'Impostor', 'Tripulante', 'Capitão', 'Fantasma'],
    ['Qual jogo tem o modo battle royale com construção?', 'Fortnite', 'Tetris', 'The Sims', 'Pac-Man'],
    ['Pac-Man foge de…', 'Fantasmas', 'Zumbis', 'Robôs', 'Dragões'],
    ['Em The Sims você controla…', 'Pessoas virtuais', 'Carros', 'Exércitos', 'Naves'],
    ['Qual console portátil da Nintendo tinha duas telas?', 'Nintendo DS', 'Game Boy', 'PSP', 'Switch Lite'],
    ['Em Minecraft, qual criatura explode?', 'Creeper', 'Zumbi', 'Esqueleto', 'Enderman'],
    ['GTA é sigla de…', 'Grand Theft Auto', 'Great Turbo Action', 'Game Total Arena', 'Grand Team Attack'],
    ['Qual jogo de futebol é famoso por ter edições anuais?', 'FIFA / EA FC', 'Rocket League', 'Tony Hawk', 'NBA Jam'],
    ['Em Pokémon, Pikachu é de qual tipo?', 'Elétrico', 'Fogo', 'Água', 'Planta'],
    ['Qual é a cor do fantasma Blinky em Pac-Man?', 'Vermelho', 'Azul', 'Rosa', 'Laranja'],
    ['Qual destes é um jogo de corrida?', 'Mario Kart', 'Tetris', 'Zelda', 'Portal'],
  ],
  filmes: [
    ['Qual filme da Pixar tem um cowboy de brinquedo chamado Woody?', 'Toy Story', 'Carros', 'Up', 'Monstros S.A.'],
    ['Em "Procurando Nemo", Nemo é um peixe…', 'Palhaço', 'Dourado', 'Espada', 'Baiacu'],
    ['Qual é o nome do leão protagonista de "O Rei Leão"?', 'Simba', 'Mufasa', 'Scar', 'Nala'],
    ['Quem é o mago famoso que estuda em Hogwarts?', 'Harry Potter', 'Gandalf', 'Merlin', 'Doutor Estranho'],
    ['"Frozen" se passa em um reino chamado…', 'Arendelle', 'Corona', 'Agrabah', 'Atlântica'],
    ['Qual personagem diz "Ao infinito e além"?', 'Buzz Lightyear', 'Woody', 'Shrek', 'Wall-E'],
    ['Shrek é um…', 'Ogro', 'Troll', 'Gigante', 'Duende'],
    ['Em "Divertida Mente", qual emoção é azul?', 'Tristeza', 'Alegria', 'Raiva', 'Medo'],
    ['Qual série tem os irmãos Winchester caçando monstros?', 'Supernatural', 'Stranger Things', 'Lost', 'The Walking Dead'],
    ['Stranger Things se passa em qual cidade fictícia?', 'Hawkins', 'Springfield', 'Riverdale', 'Gotham'],
    ['Em qual cidade mora o Batman?', 'Gotham', 'Metrópolis', 'Star City', 'Central City'],
    ['O Homem-Aranha é de qual editora de quadrinhos?', 'Marvel', 'DC', 'Image', 'Dark Horse'],
    ['Qual o nome do robô de lixo da Pixar?', 'Wall-E', 'R2-D2', 'Baymax', 'Eva'],
    ['"Carros" tem como protagonista…', 'Relâmpago McQueen', 'Mate', 'Sally', 'Doc Hudson'],
    ['Em "Moana", o semideus é…', 'Maui', 'Kahu', 'Tamatoa', 'Tui'],
    ['A série "Chaves" é de qual país?', 'México', 'Brasil', 'Argentina', 'Espanha'],
  ],
  musica: [
    ['Quantas notas tem a escala musical básica?', '7', '5', '8', '12'],
    ['Qual instrumento tem 88 teclas?', 'Piano', 'Acordeon', 'Teclado infantil', 'Xilofone'],
    ['Quantas cordas tem um violão tradicional?', '6', '4', '5', '7'],
    ['Quantas cordas tem um baixo elétrico comum?', '4', '6', '3', '8'],
    ['Qual destes é um instrumento de sopro?', 'Flauta', 'Violino', 'Bateria', 'Harpa'],
    ['Qual estilo musical nasceu no Rio de Janeiro com Tom Jobim?', 'Bossa nova', 'Forró', 'Axé', 'Sertanejo'],
    ['Luiz Gonzaga é conhecido como o Rei do…', 'Baião', 'Samba', 'Rock', 'Pagode'],
    ['Qual instrumento tem um arco?', 'Violino', 'Trompete', 'Piano', 'Pandeiro'],
    ['Qual é a primeira nota da escala de Dó maior?', 'Dó', 'Ré', 'Lá', 'Sol'],
    ['Os Beatles eram de qual país?', 'Inglaterra', 'Estados Unidos', 'Irlanda', 'Austrália'],
    ['Qual instrumento é típico do samba?', 'Pandeiro', 'Gaita de fole', 'Banjo', 'Cítara'],
    ['O que significa "forte" numa partitura?', 'Tocar alto', 'Tocar rápido', 'Tocar baixo', 'Parar'],
    ['Qual cantor é conhecido como Rei do Pop?', 'Michael Jackson', 'Elvis Presley', 'Prince', 'Freddie Mercury'],
    ['Elvis Presley é conhecido como Rei do…', 'Rock', 'Pop', 'Jazz', 'Blues'],
    ['Quantos tempos tem um compasso 4/4?', '4', '2', '3', '8'],
    ['Qual destes instrumentos é de percussão?', 'Bateria', 'Clarinete', 'Violoncelo', 'Saxofone'],
  ],
  esportes: [
    ['Quantos jogadores um time de futebol tem em campo?', '11', '10', '9', '12'],
    ['Quantas Copas do Mundo o Brasil já ganhou?', '5', '4', '6', '3'],
    ['Em qual ano o Brasil ganhou sua última Copa?', '2002', '1994', '2006', '1998'],
    ['Quantos jogadores tem um time de vôlei em quadra?', '6', '5', '7', '4'],
    ['Quantos jogadores tem um time de basquete em quadra?', '5', '6', '4', '7'],
    ['Em qual esporte se usa uma raquete e uma peteca?', 'Badminton', 'Tênis', 'Squash', 'Pingue-pongue'],
    ['Quem é conhecido como Rei do Futebol?', 'Pelé', 'Maradona', 'Ronaldo', 'Zico'],
    ['De quantos em quantos anos acontecem as Olimpíadas de verão?', '4', '2', '3', '5'],
    ['Ayrton Senna era piloto de…', 'Fórmula 1', 'Rally', 'MotoGP', 'Stock Car'],
    ['Quanto vale uma cesta de três no basquete?', '3 pontos', '2 pontos', '1 ponto', '4 pontos'],
    ['Em qual esporte existe o "ace"?', 'Tênis', 'Futebol', 'Natação', 'Judô'],
    ['Qual é a cor da faixa mais alta no judô (entre estas)?', 'Preta', 'Marrom', 'Roxa', 'Verde'],
    ['Uma partida de futebol oficial tem quantos minutos de jogo?', '90', '80', '100', '60'],
    ['O skate virou esporte olímpico em qual edição?', 'Tóquio 2020', 'Rio 2016', 'Londres 2012', 'Paris 2024'],
    ['Rebeca Andrade é medalhista olímpica de…', 'Ginástica artística', 'Natação', 'Atletismo', 'Vôlei'],
    ['Qual país sediou a Copa do Mundo de 2014?', 'Brasil', 'Alemanha', 'Rússia', 'África do Sul'],
    ['Em qual esporte se faz um "home run"?', 'Beisebol', 'Críquete', 'Golfe', 'Rugby'],
    ['Quantos sets precisa vencer para ganhar no vôlei (melhor de 5)?', '3', '2', '4', '5'],
  ],
  bichos: [
    ['Qual é o maior animal do mundo?', 'Baleia-azul', 'Elefante', 'Tubarão-baleia', 'Girafa'],
    ['Qual é o animal terrestre mais rápido?', 'Guepardo', 'Leão', 'Cavalo', 'Antílope'],
    ['Quantas patas tem uma aranha?', '8', '6', '10', '4'],
    ['Quantas patas tem um inseto?', '6', '8', '4', '10'],
    ['O morcego é um…', 'Mamífero', 'Pássaro', 'Réptil', 'Inseto'],
    ['A baleia respira por…', 'Pulmões', 'Brânquias', 'Pele', 'Nadadeiras'],
    ['Qual destes animais é um anfíbio?', 'Sapo', 'Cobra', 'Lagarto', 'Tartaruga'],
    ['O que come o panda-gigante principalmente?', 'Bambu', 'Peixe', 'Frutas', 'Insetos'],
    ['Qual ave não consegue voar?', 'Pinguim', 'Pardal', 'Águia', 'Papagaio'],
    ['O polvo tem quantos braços?', '8', '6', '10', '12'],
    ['Qual é o maior felino do mundo?', 'Tigre', 'Leão', 'Onça-pintada', 'Leopardo'],
    ['Qual animal é símbolo do Brasil e tem pintas?', 'Onça-pintada', 'Leopardo', 'Guepardo', 'Lince'],
    ['Camaleões são famosos por…', 'Mudar de cor', 'Voar', 'Brilhar no escuro', 'Viver 200 anos'],
    ['O filhote do sapo se chama…', 'Girino', 'Larva', 'Alevino', 'Lagarta'],
    ['Qual destes é um marsupial?', 'Canguru', 'Urso', 'Macaco', 'Lobo'],
    ['As abelhas produzem…', 'Mel', 'Seda', 'Leite', 'Cera de vela pronta'],
    ['O tubarão é um…', 'Peixe', 'Mamífero', 'Réptil', 'Anfíbio'],
    ['Qual animal tem o pescoço mais longo?', 'Girafa', 'Avestruz', 'Camelo', 'Flamingo'],
  ],
  matematica: [], // gerado automaticamente
  portugues: [
    ['Qual é o plural de "cidadão"?', 'Cidadãos', 'Cidadões', 'Cidadães', 'Cidadãoses'],
    ['Qual palavra está escrita corretamente?', 'Exceção', 'Excessão', 'Esceção', 'Exseção'],
    ['"Rápido" é uma palavra…', 'Proparoxítona', 'Paroxítona', 'Oxítona', 'Monossílaba'],
    ['Qual é o antônimo de "alegre"?', 'Triste', 'Feliz', 'Contente', 'Animado'],
    ['Qual é o sinônimo de "veloz"?', 'Rápido', 'Lento', 'Pesado', 'Calmo'],
    ['Em "O gato dormiu", qual é o sujeito?', 'O gato', 'Dormiu', 'O', 'Não tem'],
    ['Qual destas é um substantivo?', 'Casa', 'Correr', 'Bonito', 'Rapidamente'],
    ['Qual destas é um verbo?', 'Pular', 'Mesa', 'Azul', 'Muito'],
    ['Qual frase está correta?', 'Faz dois anos que moro aqui', 'Fazem dois anos que moro aqui', 'Fazemos dois anos que moro aqui', 'Fizeram dois anos que moro aqui'],
    ['Qual é o feminino de "ator"?', 'Atriz', 'Atora', 'Atoriz', 'Atôra'],
    ['Qual frase usa "mas" corretamente?', 'Quis ir, mas choveu', 'Quero mas doce', 'Mas e mas', 'Ele é mas alto'],
    ['Quantas sílabas tem "paralelepípedo"?', '7', '6', '8', '5'],
    ['"Mal" é o oposto de…', 'Bem', 'Bom', 'Mau', 'Melhor'],
    ['Qual é o coletivo de "lobos"?', 'Alcateia', 'Cardume', 'Enxame', 'Manada'],
    ['Qual é o coletivo de "peixes"?', 'Cardume', 'Alcateia', 'Rebanho', 'Bando'],
  ],
  anime: [
    ['Em "Naruto", qual é a vila natal do protagonista?', 'Vila da Folha', 'Vila da Areia', 'Vila da Névoa', 'Vila da Pedra'],
    ['Goku é protagonista de qual anime?', 'Dragon Ball', 'One Piece', 'Naruto', 'Bleach'],
    ['Em "One Piece", Luffy quer ser o Rei dos…', 'Piratas', 'Ninjas', 'Magos', 'Samurais'],
    ['Qual é o nome do caderno que mata em "Death Note"?', 'Death Note', 'Kill Book', 'Black Note', 'Shinigami Diary'],
    ['Em "Pokémon", qual é o nome do treinador principal da série clássica?', 'Ash', 'Brock', 'Gary', 'Red Jr.'],
    ['Qual estúdio fez "A Viagem de Chihiro"?', 'Studio Ghibli', 'Toei', 'MAPPA', 'Madhouse'],
    ['"Attack on Titan" em japonês é…', 'Shingeki no Kyojin', 'Kimetsu no Yaiba', 'Boku no Hero', 'Jujutsu Kaisen'],
    ['Em "Demon Slayer", Tanjiro protege a irmã chamada…', 'Nezuko', 'Mikasa', 'Hinata', 'Sakura'],
    ['"Mangá" é…', 'Quadrinho japonês', 'Desenho animado coreano', 'Livro chinês', 'Música japonesa'],
    ['Em "My Hero Academia", o poder dos heróis se chama…', 'Individualidade', 'Chakra', 'Nen', 'Haki'],
    ['Em "Naruto", o que Naruto mais gosta de comer?', 'Lámen', 'Sushi', 'Onigiri', 'Tempurá'],
    ['Em "Dragon Ball", quantas esferas do dragão existem?', '7', '5', '9', '12'],
    ['Totoro é personagem de qual estúdio?', 'Studio Ghibli', 'Toei Animation', 'Sunrise', 'Bones'],
    ['Em "Sailor Moon", a protagonista se chama…', 'Usagi', 'Sakura', 'Hinata', 'Rei Ayanami'],
  ],
  corpo: [
    ['Quantos ossos tem o corpo humano adulto?', '206', '186', '226', '300'],
    ['Qual é o maior órgão do corpo humano?', 'Pele', 'Fígado', 'Coração', 'Pulmão'],
    ['Qual órgão bombeia o sangue?', 'Coração', 'Pulmão', 'Rim', 'Estômago'],
    ['Quantos dentes tem um adulto, com sisos?', '32', '28', '30', '36'],
    ['Onde fica o fêmur?', 'Coxa', 'Braço', 'Costas', 'Crânio'],
    ['Qual órgão filtra o sangue e produz urina?', 'Rins', 'Fígado', 'Pâncreas', 'Baço'],
    ['Qual sentido usa as papilas gustativas?', 'Paladar', 'Olfato', 'Tato', 'Audição'],
    ['As hemácias são as células…', 'Vermelhas do sangue', 'Brancas do sangue', 'Do osso', 'Do cérebro'],
    ['Qual é o menor osso do corpo?', 'Estribo (no ouvido)', 'Falange do dedinho', 'Rótula', 'Clavícula'],
    ['Onde acontece a maior parte da digestão e absorção?', 'Intestino delgado', 'Boca', 'Esôfago', 'Intestino grosso'],
    ['Que órgão controla o corpo e os pensamentos?', 'Cérebro', 'Coração', 'Estômago', 'Pulmão'],
    ['Que vitamina o corpo produz com a luz do sol?', 'Vitamina D', 'Vitamina C', 'Vitamina A', 'Vitamina B12'],
    ['Os pulmões fazem parte de qual sistema?', 'Respiratório', 'Digestório', 'Nervoso', 'Circulatório'],
    ['Quantas câmaras tem o coração humano?', '4', '2', '3', '6'],
  ],
  espaco: [
    ['Qual é o maior planeta do Sistema Solar?', 'Júpiter', 'Saturno', 'Netuno', 'Terra'],
    ['Qual planeta é conhecido como planeta vermelho?', 'Marte', 'Vênus', 'Júpiter', 'Mercúrio'],
    ['Qual planeta tem os anéis mais famosos?', 'Saturno', 'Urano', 'Marte', 'Vênus'],
    ['Quantos planetas tem o Sistema Solar?', '8', '9', '7', '10'],
    ['Quem foi o primeiro ser humano a pisar na Lua?', 'Neil Armstrong', 'Buzz Aldrin', 'Yuri Gagarin', 'Marcos Pontes'],
    ['Em que ano o homem pisou na Lua pela primeira vez?', '1969', '1959', '1975', '1981'],
    ['Qual é a estrela mais próxima da Terra?', 'Sol', 'Próxima Centauri', 'Sirius', 'Vega'],
    ['Plutão hoje é classificado como…', 'Planeta anão', 'Planeta', 'Satélite', 'Cometa'],
    ['Qual é o planeta mais quente do Sistema Solar?', 'Vênus', 'Mercúrio', 'Marte', 'Júpiter'],
    ['Como se chama a nossa galáxia?', 'Via Láctea', 'Andrômeda', 'Sombrero', 'Magalhães'],
    ['Quem foi o primeiro astronauta brasileiro?', 'Marcos Pontes', 'Santos Dumont', 'César Lattes', 'Alberto Pontes'],
    ['Quanto tempo a Terra leva para dar uma volta no Sol?', 'Cerca de 365 dias', '30 dias', '24 horas', '10 anos'],
    ['A Lua brilha porque…', 'Reflete a luz do Sol', 'Tem luz própria', 'É feita de gelo', 'Tem lava na superfície'],
    ['Qual foi o primeiro ser humano a ir ao espaço?', 'Yuri Gagarin', 'Neil Armstrong', 'John Glenn', 'Valentina Tereshkova'],
    ['Qual planeta gira "deitado", quase de lado?', 'Urano', 'Netuno', 'Saturno', 'Marte'],
    ['O que é uma estrela cadente?', 'Um meteoro queimando na atmosfera', 'Uma estrela caindo', 'Um planeta', 'Um satélite'],
  ],
  tech: [
    ['O que significa "CPU"?', 'Unidade Central de Processamento', 'Computador Pessoal Único', 'Central de Programas Úteis', 'Cabo de Placa Universal'],
    ['Qual destas é uma linguagem de programação?', 'Python', 'HTML Pro', 'Photoshop', 'Windows'],
    ['HTML serve para…', 'Estruturar páginas web', 'Editar fotos', 'Criar planilhas', 'Compactar arquivos'],
    ['Quantos bits tem um byte?', '8', '4', '16', '10'],
    ['Qual empresa criou o Windows?', 'Microsoft', 'Apple', 'Google', 'IBM'],
    ['Qual empresa criou o Android?', 'Google (comprado da Android Inc.)', 'Apple', 'Samsung', 'Microsoft'],
    ['O que é RAM?', 'Memória temporária do computador', 'Disco rígido', 'Placa de vídeo', 'Processador'],
    ['O atalho Ctrl+C serve para…', 'Copiar', 'Colar', 'Cortar', 'Fechar'],
    ['O atalho Ctrl+Z serve para…', 'Desfazer', 'Refazer', 'Salvar', 'Zoom'],
    ['CSS serve para…', 'Estilizar páginas web', 'Criar banco de dados', 'Programar servidores', 'Enviar e-mails'],
    ['O que significa "Wi-Fi" na prática?', 'Rede sem fio', 'Cabo de rede', 'Bluetooth', 'Fibra óptica'],
    ['Qual destes é um sistema operacional?', 'Linux', 'Chrome', 'Word', 'Excel'],
    ['O que é um "bug" em programação?', 'Um erro no código', 'Um vírus de verdade', 'Um teclado quebrado', 'Uma linguagem'],
    ['Quem é considerado a primeira programadora da história?', 'Ada Lovelace', 'Grace Hopper', 'Marie Curie', 'Alan Turing'],
    ['Qual é a extensão comum de arquivos JavaScript?', '.js', '.java', '.jsx.txt', '.script'],
    ['O que é "URL"?', 'Endereço de uma página na internet', 'Tipo de vírus', 'Programa de edição', 'Peça do PC'],
  ],
};

// ---------- temas (títulos variados por tema) ----------
const TEMAS = {
  brasil: { cat: 'Conhecimentos gerais', capa: 'brasil', autores: ['prof_caio', 'kaique.br', 'carol.viaja', 'joaovitor'], titulos: [
    'Geografia do Brasil: nível escola', 'Capitais brasileiras sem colar', 'Você conhece o mapa do Brasil?', 'Brasil de norte a sul', 'Estados e capitais: desafio relâmpago', 'Quiz do Enem: geografia do Brasil', 'Quanto você sabe sobre o seu país?'] },
  mundo: { cat: 'Conhecimentos gerais', capa: 'globo', autores: ['carol.viaja', 'prof_caio', 'ana.clara', 'joaovitor'], titulos: [
    'Capitais do mundo', 'Volta ao mundo em perguntas', 'Geografia mundial básica', 'Você seria um bom viajante?', 'Países, oceanos e montanhas', 'Mapa-múndi: teste rápido', 'Geografia pra quem ama viajar'] },
  ciencia: { cat: 'Ciências', capa: 'ciencia', autores: ['nath.bio', 'mateus.exatas', 'bia.santos'], titulos: [
    'Ciências do 9º ano', 'Química sem medo', 'Física e química do dia a dia', 'Você passaria em ciências?', 'Tabela periódica: o básico', 'Curiosidades científicas'] },
  historia: { cat: 'História', capa: 'historia', autores: ['tio.beto', 'kaique.br', 'prof_caio'], titulos: [
    'História do Brasil em 10 perguntas', 'Brasil Colônia e Império', 'Datas que caem na prova', 'Quiz de história pro vestibular', 'Personagens da história do Brasil'] },
  games: { cat: 'Games', capa: 'games', autores: ['zezinho_gamer', 'vini_lol', 'lucas_dev', 'joaovitor'], titulos: [
    'Você manja de videogame?', 'Games clássicos', 'Só gamer de verdade gabarita', 'Consoles e personagens', 'Quiz da jogatina', 'Nintendo, Sony ou Microsoft?', 'Gamer raiz ou Nutella?'] },
  filmes: { cat: 'Filmes e séries', capa: 'filmes', autores: ['isa.cine', 'pedrohq', 'marina.lopes', 'ana.clara'], titulos: [
    'Animações que marcaram época', 'Quiz de filmes da Pixar e Disney', 'Você lembra desses filmes?', 'Séries e filmes: teste rápido', 'Cinéfilo ou só assiste trailer?', 'Heróis e vilões do cinema'] },
  musica: { cat: 'Música', capa: 'musica', autores: ['camila_music', 'manu_pop'], titulos: [
    'Teoria musical pra iniciantes', 'Instrumentos musicais', 'Música brasileira e internacional', 'Você tem ouvido musical?', 'Quiz pra quem toca alguma coisa'] },
  esportes: { cat: 'Esportes', capa: 'esportes', autores: ['gui.futebol', 'joaovitor', 'vini_lol'], titulos: [
    'Futebol: só pra quem acompanha', 'Esportes olímpicos', 'Quiz da Copa do Mundo', 'Regras dos esportes', 'Você entende de esporte?', 'Brasil nos esportes'] },
  bichos: { cat: 'Animais', capa: 'bichos', autores: ['bia.santos', 'nath.bio', 'duda.quiz'], titulos: [
    'Curiosidades sobre animais', 'Mamífero, ave ou réptil?', 'Bichos do Brasil e do mundo', 'Você sabe tudo sobre animais?', 'Quiz pra quem ama bicho'] },
  matematica: { cat: 'Ciências', capa: 'matematica', autores: ['mateus.exatas', 'prof_caio', 'lucas_dev'], titulos: [
    'Conta de cabeça: nível 1', 'Conta de cabeça: nível 2', 'Tabuada sem calculadora', 'Matemática relâmpago', 'Desafio das contas'] },
  portugues: { cat: 'Conhecimentos gerais', capa: 'livro', autores: ['leticia.r', 'julia.m'], titulos: [
    'Português sem tropeço', 'Gramática do dia a dia', 'Você escreve certo?', 'Quiz de português pro Enem'] },
  anime: { cat: 'Anime', capa: 'anime', autores: ['rafa_otaku', 'zezinho_gamer', 'duda.quiz'], titulos: [
    'Quiz de anime pra iniciantes', 'Você é otaku de verdade?', 'Animes clássicos', 'Shonen: teste seus conhecimentos', 'Ghibli, Naruto e companhia'] },
  corpo: { cat: 'Ciências', capa: 'corpo', autores: ['julia.m', 'nath.bio'], titulos: [
    'Corpo humano: o básico', 'Quiz de biologia: corpo humano', 'Você conhece seu próprio corpo?', 'Ossos, órgãos e sistemas'] },
  espaco: { cat: 'Ciências', capa: 'espaco', autores: ['nando_astro', 'mateus.exatas'], titulos: [
    'Sistema Solar', 'Astronomia pra curiosos', 'Quiz do espaço sideral', 'Planetas, estrelas e astronautas', 'Você iria pra Marte?'] },
  tech: { cat: 'Tecnologia', capa: 'tech', autores: ['lucas_dev', 'thiago.tech'], titulos: [
    'Informática básica', 'Você entende de computador?', 'Programação pra iniciantes', 'Atalhos e tecnologia', 'Quiz do suporte técnico'] },
};

// ---------- personalidade ----------
// [título, descrição, capa, cor, resultados[4]: [nome, descrição, imagem]]
const PERS = [
  ['Qual herói você seria?', 'Responda e descubra se você é mais Tempestade, Raio, Muralha ou Sombra.', 'herois', null, [
    ['Capitã Tempestade', 'Você puxa a frente quando a coisa aperta. O grupo confia em você.', 'heroi:tempestade'],
    ['Raio', 'Rápido, impaciente e sempre o primeiro a chegar. Às vezes antes do plano existir.', 'heroi:raio'],
    ['Muralha', 'Calmo, forte e difícil de abalar. Ninguém passa por você.', 'heroi:muralha'],
    ['Sombra', 'Observa tudo em silêncio e resolve antes de alguém perceber.', 'heroi:sombra']]],
  ['Que bicho você seria?', 'Gato, sapo, urso ou raposa? A resposta pode te surpreender.', 'bichos', null, [
    ['Raposa', 'Esperta e cheia de iniciativa. Você sempre tem um plano.', 'avatar:3'],
    ['Sapo', 'Pula de uma coisa pra outra sem parar.', 'avatar:1'],
    ['Urso', 'Tranquilo, abraçável e protetor.', 'avatar:2'],
    ['Gato', 'Independente e criativo. Faz tudo do seu jeito.', 'avatar:0']]],
  ['Que sabor de pizza combina com você?', 'Sem julgamentos. Nem pra quem gosta de pizza doce.', 'pizza', null, [
    ['Calabresa', 'Clássico e confiável. Todo mundo gosta de você.', ''], ['Pepperoni', 'Intenso e cheio de energia.', ''],
    ['Marguerita', 'Simples, leve e de bem com a vida.', ''], ['Chocolate com morango', 'Imprevisível. Ninguém sabe o que esperar.', '']]],
  ['Que tipo de gamer você é?', 'Competitivo, casual, explorador ou criativo?', 'games', '#2a1a6b', [
    ['Competitivo', 'Ranqueada é sua segunda casa.', 'avatar:6'], ['Speedrunner', 'Zera tudo no modo mais rápido possível.', 'avatar:7'],
    ['Casual', 'Joga pra relaxar e tá tudo bem.', 'avatar:8'], ['Construtor', 'Passa mais tempo decorando a base do que jogando.', 'avatar:9']]],
  ['Qual estação do ano você é?', 'Verão, outono, inverno ou primavera.', 'globo', '#ffe08a', [
    ['Verão', 'Você é o sol do rolê.', ''], ['Primavera', 'Animado e sempre começando algo novo.', ''],
    ['Inverno', 'Aconchegante e tranquilo.', ''], ['Outono', 'Pensativo e cheio de estilo.', '']]],
  ['Que profissão combina com você?', 'Descubra a carreira que tem a sua cara.', 'tech', '#ffe3e0', [
    ['Gerente de projetos', 'Você nasceu pra organizar pessoas.', 'avatar:10'], ['Atleta', 'Energia de sobra precisa de um destino.', 'avatar:11'],
    ['Médico(a)', 'Paciência e cuidado com os outros.', 'avatar:6'], ['Designer', 'Vê beleza onde ninguém vê.', 'avatar:7']]],
  ['Qual matéria da escola você seria?', 'Sim, matérias têm personalidade.', 'livro', null, [
    ['História', 'Você gosta de contar e de liderar a conversa.', ''], ['Educação física', 'Parado? Nunca.', ''],
    ['Biologia', 'Observador e calmo.', ''], ['Artes', 'Criativo até no jeito de amarrar o tênis.', '']]],
  ['Que tipo de amigo você é?', 'Todo grupo tem um de cada.', 'padrao', '#ffe6f3', [
    ['O que organiza', 'Sem você, o rolê não sai do grupo do WhatsApp.', 'avatar:4'], ['O animado', 'Chega e a festa começa.', 'avatar:1'],
    ['O conselheiro', 'Todo mundo te procura pra desabafar.', 'avatar:2'], ['O diferentão', 'Sempre com uma ideia que ninguém teve.', 'avatar:0']]],
  ['Qual vilão você seria?', 'Todo mundo tem um lado sombrio. Qual é o seu?', 'herois', '#1f1b3a', [
    ['O Estrategista', 'Seu plano tem plano B, C e D.', 'heroi:sombra'], ['O Caótico', 'Nem você sabe o que vai fazer em seguida.', 'heroi:raio'],
    ['O Paciente', 'Espera anos pela vingança perfeita.', 'heroi:muralha'], ['O Gênio', 'Inventa a máquina do fim do mundo num fim de semana.', 'heroi:tempestade']]],
  ['Qual planeta você seria?', 'Do Sol a Netuno, qual tem a sua vibe?', 'espaco', null, [
    ['Sol', 'Tudo gira em torno de você (e tudo bem).', ''], ['Mercúrio', 'Rápido e inquieto.', ''],
    ['Netuno', 'Calmo, distante e profundo.', ''], ['Saturno', 'Estiloso e cheio de camadas.', '']]],
  ['Que estilo musical é a sua cara?', 'Seu fone diz muito sobre você.', 'musica', '#dff7f6', [
    ['Rock', 'Atitude e presença de palco.', ''], ['Funk', 'Energia lá em cima.', ''],
    ['MPB', 'Calmo e de bem com a vida.', ''], ['Indie', 'Você conhecia antes de ficar famoso.', '']]],
  ['Qual esporte combina com você?', 'Do xadrez ao surfe.', 'esportes', '#1fa35a', [
    ['Futebol', 'Joga em equipe e puxa o time.', ''], ['Corrida', 'Velocidade é tudo.', ''],
    ['Yoga', 'Equilíbrio e calma.', ''], ['Skate', 'Estilo próprio e manobras novas.', '']]],
  ['Que doce brasileiro você é?', 'Brigadeiro, paçoca, pudim ou pé-de-moleque?', 'pizza', '#ffe1ef', [
    ['Brigadeiro', 'Não tem festa sem você.', ''], ['Paçoca', 'Energia que esfarela pra todo lado.', ''],
    ['Pudim', 'Suave e reconfortante.', ''], ['Pé-de-moleque', 'Diferente e cheio de personalidade.', '']]],
  ['Qual personagem de anime você seria?', 'Protagonista, rival, mentor ou o misterioso?', 'anime', null, [
    ['O protagonista', 'Nunca desiste e arrasta todo mundo junto.', 'avatar:6'], ['O rival', 'Sempre correndo atrás de ser o melhor.', 'avatar:9'],
    ['O mentor', 'Sábio e tranquilo.', 'avatar:11'], ['O misterioso', 'Ninguém sabe sua história ainda.', 'avatar:8']]],
  ['Que tipo de estudante você é?', 'Na véspera da prova você é…', 'livro', '#e3f0ff', [
    ['O do resumo', 'Organiza o grupo de estudos inteiro.', ''], ['O da madrugada', 'Estuda tudo na última hora.', ''],
    ['O constante', 'Um pouquinho todo dia.', ''], ['O do mapa mental', 'Transforma tudo em desenho colorido.', '']]],
  ['Qual cidade do mundo é a sua cara?', 'Nova York, Rio, Kyoto ou Paris?', 'globo', '#efe6ff', [
    ['Nova York', 'Ambicioso e sempre ocupado.', ''], ['Rio de Janeiro', 'Animado e solar.', ''],
    ['Kyoto', 'Calmo e tradicional.', ''], ['Paris', 'Artístico e romântico.', '']]],
  ['Que tipo de cientista você seria?', 'Laboratório, campo, telescópio ou ateliê?', 'ciencia', null, [
    ['Diretor(a) de laboratório', 'Coordena a equipe toda.', ''], ['Pesquisador(a) de campo', 'Vai atrás da descoberta onde ela estiver.', ''],
    ['Astrônomo(a)', 'Noites tranquilas olhando pro céu.', ''], ['Inventor(a)', 'Cria coisas que ninguém imaginou.', '']]],
  ['Que tipo de pet você seria?', 'Cachorro, gato, peixe ou papagaio?', 'bichos', '#fff1cc', [
    ['Cachorro', 'Leal e líder da matilha.', 'avatar:3'], ['Papagaio', 'Fala sem parar.', 'avatar:1'],
    ['Peixe', 'Zen e tranquilo.', 'avatar:5'], ['Gato', 'Faz o que quer, quando quer.', 'avatar:0']]],
  ['Qual café você seria?', 'Expresso, cappuccino, chá ou frappé?', 'pizza', '#e8d5c4', [
    ['Expresso', 'Direto ao ponto.', ''], ['Energético', 'Você nem precisa de café, mas toma.', ''],
    ['Chá de camomila', 'Calma em forma de gente.', ''], ['Frappé de caramelo', 'Criativo e cheio de camadas.', '']]],
  ['Que tipo de herói de RPG você é?', 'Guerreiro, ladino, clérigo ou mago?', 'games', '#3b1f8f', [
    ['Guerreiro', 'Linha de frente sempre.', 'heroi:tempestade'], ['Ladino', 'Rápido e escorregadio.', 'heroi:raio'],
    ['Clérigo', 'Cura o grupo e mantém a calma.', 'heroi:muralha'], ['Mago', 'Resolve tudo com uma ideia brilhante.', 'heroi:sombra']]],
];


const fotoTema = (chave, n) => { const l = FOTOS[chave] || []; return l.length ? l[n % l.length] : null; };
const midiaFoto = f => (f ? { tipo: 'imagem', url: f.u, credito: f } : null);

// linha: [texto, certa, ...erradas, { busca }?]
function perguntaAcerto(linha) {
  const extra = linha[linha.length - 1] && typeof linha[linha.length - 1] === 'object' ? linha[linha.length - 1] : null;
  const [texto, certa, ...erradas] = extra ? linha.slice(0, -1) : linha;
  const opcoes = embaralha([certa, ...erradas]);
  return { texto, midia: midiaFoto(extra && MIDIAS.imagens[extra.busca]), opcoes: opcoes.map(o => ({ texto: o })), certa: opcoes.indexOf(certa) };
}

// reparte a lista entre n quizzes, cada um com min..max itens e sem repetir nenhum
function repartir(lista, n, min, max) {
  const partes = []; let i = 0;
  for (let q = 0; q < n; q++) {
    const faltam = n - q - 1, resto = lista.length - i;
    const t = q === n - 1 ? Math.min(resto, max) : Math.max(Math.min(int(min, max), resto - faltam * min), Math.min(min, resto));
    partes.push(lista.slice(i, i + t)); i += t;
  }
  return partes;
}

// garante mídia: pelo menos algumas fotos e um vídeo ou GIF por quiz
function completarMidia(perguntas, fotosExtras, movimento) {
  let k = 0;
  const minimo = Math.max(3, Math.ceil(perguntas.length * 0.4));
  perguntas.filter(p => !p.midia).forEach(p => {
    if (perguntas.filter(x => x.midia).length >= minimo || k >= fotosExtras.length) return;
    p.midia = midiaFoto(fotosExtras[k++]);
  });
  if (movimento && perguntas.length) {
    const alvo = perguntas.find(p => !p.midia) || perguntas[perguntas.length - 1];
    alvo.midia = { tipo: movimento.tipo, url: movimento.u, credito: movimento };
  }
}

export function gerar() {
  const agora = Date.now(), dia = 864e5;
  const usuarios = AUTORES.map(([user, nome, bio], i) => ({ user, senha: '1234', nome, bio, avatar: i % 12, criado: agora - int(30, 400) * dia }));
  const jogadas = () => Math.floor(Math.pow(R(), 2.4) * 4000) + int(3, 40);
  const tabelas = perguntasDeTabelas({ pega, embaralha, int });
  const usadas = new Set(); // nenhuma pergunta aparece em dois quizzes
  const unicas = linhas => linhas.filter(l => !usadas.has(l[0]) && usadas.add(l[0]));
  const movimentos = chave => embaralha([...(MIDIAS.videos[chave] || []), ...(MIDIAS.gifs[chave] || [])]);
  const quizzes = [];
  let n = 0;

  for (const [chave, t] of Object.entries(TEMAS)) {
    const banco = embaralha(unicas([...B[chave], ...(tabelas[chave] || [])]));
    const partes = repartir(banco, t.titulos.length, 6, 15);
    const mov = movimentos(chave);
    t.titulos.forEach((titulo, idx) => {
      const linhas = partes[idx];
      if (!linhas.length) return;
      const foto = fotoTema(chave, idx);
      const perguntas = linhas.map(perguntaAcerto);
      completarMidia(perguntas, embaralha(FOTOS[chave] || []), mov[idx % (mov.length || 1)]);
      quizzes.push({
        id: 's' + (++n), tipo: 'acerto', titulo, descricao: `${perguntas.length} perguntas de ${t.cat.toLowerCase()}. Veja quantas você acerta.`,
        categoria: t.cat, capa: foto?.u || '', credito: foto, autor: pega(t.autores), jogadas: jogadas(), criado: agora - int(0, 180) * dia, perguntas,
      });
    });
  }

  const partesPers = repartir(embaralha(unicas(PERGUNTAS_PERSONALIDADE)), PERS.length, 4, 7);
  const movPers = movimentos('personalidade');
  PERS.forEach(([titulo, descricao, , , res], i) => {
    const foto = [`pc${i}`, `p${i}-0`, `p${i}-1`, `p${i}-2`].map(k => FOTOS[k]?.[0]).find(Boolean) || null;
    const ids = ['a', 'b', 'c', 'd'];
    const perguntas = partesPers[i].map(([texto, a, b, c, d, busca]) => ({
      texto, midia: midiaFoto(busca && MIDIAS.imagens[busca]),
      opcoes: embaralha([a, b, c, d].map((o, k) => ({ texto: o, r: ids[k] }))),
    }));
    const fotosResultados = [0, 1, 2, 3].map(k => FOTOS[`p${i}-${k}`]?.[0]).filter(Boolean);
    completarMidia(perguntas, fotosResultados, movPers[i % (movPers.length || 1)]);
    quizzes.push({
      id: 's' + (++n), tipo: 'personalidade', titulo, descricao, categoria: 'Personalidade', capa: foto?.u || '', credito: foto,
      autor: pega(['marina.lopes', 'duda.quiz', 'ana.clara', 'manu_pop', 'isa.cine', 'rafa_otaku', 'pedrohq']),
      jogadas: jogadas() + 300, criado: agora - int(0, 120) * dia,
      resultados: res.map(([nome, desc], k) => ({ id: ids[k], nome, descricao: desc, img: FOTOS[`p${i}-${k}`]?.[0]?.u || '' })), perguntas,
    });
  });
  return { usuarios, quizzes };
}

// todos os termos de busca de imagem (usado pelo script que baixa as mídias)
export function termosDeImagem() {
  return [...new Set([...termosDeBusca(), ...PERGUNTAS_PERSONALIDADE.map(l => l[5]).filter(Boolean)])];
}
