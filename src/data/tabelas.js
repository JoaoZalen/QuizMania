// Tabelas de dados reais usadas para gerar perguntas únicas de "certo ou errado".
// Cada pergunta gerada: [texto, certa, errada, errada, errada, { busca }]
// "busca" é o termo usado para achar uma foto do assunto no Wikimedia Commons (data/midias.js).

// ---------- dados ----------
// [estado com preposição, sigla, capital, região]
const ESTADOS = [
  ['do Acre', 'AC', 'Rio Branco', 'Norte'], ['de Alagoas', 'AL', 'Maceió', 'Nordeste'], ['do Amapá', 'AP', 'Macapá', 'Norte'],
  ['do Amazonas', 'AM', 'Manaus', 'Norte'], ['da Bahia', 'BA', 'Salvador', 'Nordeste'], ['do Ceará', 'CE', 'Fortaleza', 'Nordeste'],
  ['do Espírito Santo', 'ES', 'Vitória', 'Sudeste'], ['de Goiás', 'GO', 'Goiânia', 'Centro-Oeste'], ['do Maranhão', 'MA', 'São Luís', 'Nordeste'],
  ['de Mato Grosso', 'MT', 'Cuiabá', 'Centro-Oeste'], ['de Mato Grosso do Sul', 'MS', 'Campo Grande', 'Centro-Oeste'], ['de Minas Gerais', 'MG', 'Belo Horizonte', 'Sudeste'],
  ['do Pará', 'PA', 'Belém', 'Norte'], ['da Paraíba', 'PB', 'João Pessoa', 'Nordeste'], ['do Paraná', 'PR', 'Curitiba', 'Sul'],
  ['de Pernambuco', 'PE', 'Recife', 'Nordeste'], ['do Piauí', 'PI', 'Teresina', 'Nordeste'], ['do Rio de Janeiro', 'RJ', 'Rio de Janeiro', 'Sudeste'],
  ['do Rio Grande do Norte', 'RN', 'Natal', 'Nordeste'], ['do Rio Grande do Sul', 'RS', 'Porto Alegre', 'Sul'], ['de Rondônia', 'RO', 'Porto Velho', 'Norte'],
  ['de Roraima', 'RR', 'Boa Vista', 'Norte'], ['de Santa Catarina', 'SC', 'Florianópolis', 'Sul'], ['de São Paulo', 'SP', 'São Paulo', 'Sudeste'],
  ['de Sergipe', 'SE', 'Aracaju', 'Nordeste'], ['do Tocantins', 'TO', 'Palmas', 'Norte'],
];

// [país com preposição, capital, continente, busca (inglês)]
const PAISES = [
  ['da Argentina', 'Buenos Aires', 'América', 'Buenos Aires'], ['do Chile', 'Santiago', 'América', 'Santiago de Chile'], ['do Peru', 'Lima', 'América', 'Lima Peru'],
  ['da Colômbia', 'Bogotá', 'América', 'Bogotá'], ['da Venezuela', 'Caracas', 'América', 'Caracas'], ['do Uruguai', 'Montevidéu', 'América', 'Montevideo'],
  ['do Paraguai', 'Assunção', 'América', 'Asunción'], ['do Equador', 'Quito', 'América', 'Quito'], ['do Canadá', 'Ottawa', 'América', 'Ottawa'],
  ['dos Estados Unidos', 'Washington, D.C.', 'América', 'Washington Capitol'], ['do México', 'Cidade do México', 'América', 'Mexico City'], ['de Cuba', 'Havana', 'América', 'Havana'],
  ['da França', 'Paris', 'Europa', 'Paris'], ['da Alemanha', 'Berlim', 'Europa', 'Berlin'], ['da Itália', 'Roma', 'Europa', 'Rome Colosseum'],
  ['da Espanha', 'Madri', 'Europa', 'Madrid'], ['de Portugal', 'Lisboa', 'Europa', 'Lisbon'], ['do Reino Unido', 'Londres', 'Europa', 'London'],
  ['da Irlanda', 'Dublin', 'Europa', 'Dublin'], ['dos Países Baixos', 'Amsterdã', 'Europa', 'Amsterdam canal'], ['da Bélgica', 'Bruxelas', 'Europa', 'Brussels Grand Place'],
  ['da Suíça', 'Berna', 'Europa', 'Bern'], ['da Áustria', 'Viena', 'Europa', 'Vienna'], ['da Grécia', 'Atenas', 'Europa', 'Athens Acropolis'],
  ['da Suécia', 'Estocolmo', 'Europa', 'Stockholm'], ['da Noruega', 'Oslo', 'Europa', 'Oslo'], ['da Dinamarca', 'Copenhague', 'Europa', 'Copenhagen Nyhavn'],
  ['da Finlândia', 'Helsinque', 'Europa', 'Helsinki'], ['da Polônia', 'Varsóvia', 'Europa', 'Warsaw'], ['da Ucrânia', 'Kiev', 'Europa', 'Kyiv'],
  ['da Hungria', 'Budapeste', 'Europa', 'Budapest Parliament'], ['da República Tcheca', 'Praga', 'Europa', 'Prague'], ['da Islândia', 'Reykjavík', 'Europa', 'Reykjavík'],
  ['da Croácia', 'Zagreb', 'Europa', 'Zagreb'], ['do Japão', 'Tóquio', 'Ásia', 'Tokyo'], ['da China', 'Pequim', 'Ásia', 'Beijing Forbidden City'],
  ['da Coreia do Sul', 'Seul', 'Ásia', 'Seoul'], ['da Índia', 'Nova Délhi', 'Ásia', 'New Delhi India Gate'], ['da Tailândia', 'Bangkok', 'Ásia', 'Bangkok'],
  ['do Vietnã', 'Hanói', 'Ásia', 'Hanoi'], ['da Indonésia', 'Jacarta', 'Ásia', 'Jakarta'], ['das Filipinas', 'Manila', 'Ásia', 'Manila'],
  ['da Arábia Saudita', 'Riad', 'Ásia', 'Riyadh'], ['do Irã', 'Teerã', 'Ásia', 'Tehran'], ['do Iraque', 'Bagdá', 'Ásia', 'Baghdad'],
  ['do Paquistão', 'Islamabad', 'Ásia', 'Islamabad'], ['da Malásia', 'Kuala Lumpur', 'Ásia', 'Kuala Lumpur'], ['da Mongólia', 'Ulan Bator', 'Ásia', 'Ulaanbaatar'],
  ['do Nepal', 'Katmandu', 'Ásia', 'Kathmandu'], ['do Egito', 'Cairo', 'África', 'Cairo'], ['da Nigéria', 'Abuja', 'África', 'Abuja'],
  ['do Quênia', 'Nairóbi', 'África', 'Nairobi'], ['do Marrocos', 'Rabat', 'África', 'Rabat'], ['de Angola', 'Luanda', 'África', 'Luanda'],
  ['de Moçambique', 'Maputo', 'África', 'Maputo'], ['da Etiópia', 'Adis Abeba', 'África', 'Addis Ababa'], ['de Gana', 'Acra', 'África', 'Accra'],
  ['do Senegal', 'Dacar', 'África', 'Dakar'], ['da Argélia', 'Argel', 'África', 'Algiers'], ['da Tunísia', 'Túnis', 'África', 'Tunis'],
  ['da Austrália', 'Camberra', 'Oceania', 'Canberra'], ['da Nova Zelândia', 'Wellington', 'Oceania', 'Wellington New Zealand'], ['de Fiji', 'Suva', 'Oceania', 'Suva Fiji'],
];
const CONTINENTES = ['América', 'Europa', 'Ásia', 'África', 'Oceania'];

// [elemento, símbolo, busca]
const ELEMENTOS = [
  ['Hidrogênio', 'H', 'Hydrogen'], ['Hélio', 'He', 'Helium balloon'], ['Lítio', 'Li', 'Lithium metal'], ['Carbono', 'C', 'Graphite'],
  ['Nitrogênio', 'N', 'Liquid nitrogen'], ['Oxigênio', 'O', 'Liquid oxygen'], ['Flúor', 'F', 'Fluorite'], ['Neônio', 'Ne', 'Neon sign'],
  ['Sódio', 'Na', 'Sodium metal'], ['Magnésio', 'Mg', 'Magnesium'], ['Alumínio', 'Al', 'Aluminium'], ['Silício', 'Si', 'Silicon wafer'],
  ['Fósforo', 'P', 'Phosphorus'], ['Enxofre', 'S', 'Sulfur'], ['Cloro', 'Cl', 'Chlorine gas'], ['Argônio', 'Ar', 'Argon'],
  ['Potássio', 'K', 'Potassium metal'], ['Cálcio', 'Ca', 'Calcium'], ['Ferro', 'Fe', 'Iron ore'], ['Cobre', 'Cu', 'Native copper'],
  ['Zinco', 'Zn', 'Zinc'], ['Prata', 'Ag', 'Silver crystal'], ['Estanho', 'Sn', 'Tin metal'], ['Iodo', 'I', 'Iodine crystals'],
  ['Platina', 'Pt', 'Platinum nugget'], ['Ouro', 'Au', 'Gold nugget'], ['Mercúrio', 'Hg', 'Mercury liquid metal'], ['Chumbo', 'Pb', 'Lead metal'],
  ['Urânio', 'U', 'Uraninite'], ['Níquel', 'Ni', 'Nickel'], ['Cobalto', 'Co', 'Cobalt'], ['Titânio', 'Ti', 'Titanium'],
  ['Cromo', 'Cr', 'Chromium'], ['Manganês', 'Mn', 'Manganese'], ['Bromo', 'Br', 'Bromine'], ['Tungstênio', 'W', 'Tungsten'],
];

// [pergunta "Em que ano…", ano, busca]
const EVENTOS = [
  ['Em que ano os portugueses chegaram ao Brasil?', 1500, 'Landing of Cabral'],
  ['Em que ano a família real portuguesa chegou ao Brasil?', 1808, 'Arrival of the Portuguese royal family Brazil'],
  ['Em que ano Getúlio Vargas chegou ao poder?', 1930, 'Getúlio Vargas'],
  ['Em que ano começou a Primeira Guerra Mundial?', 1914, 'World War I trenches'],
  ['Em que ano terminou a Segunda Guerra Mundial?', 1945, 'V-J Day'],
  ['Em que ano caiu o Muro de Berlim?', 1989, 'Berlin Wall 1989'],
  ['Em que ano começou a Revolução Francesa?', 1789, 'Storming of the Bastille'],
  ['Em que ano Colombo chegou à América?', 1492, 'Columbus landing'],
  ['Em que ano foi promulgada a atual Constituição do Brasil?', 1988, 'Constituição 1988 Ulysses Guimarães'],
  ['Em que ano começou o regime militar no Brasil?', 1964, 'Golpe de 1964'],
  ['Em que ano o Brasil sediou sua primeira Copa do Mundo?', 1950, 'Maracanã 1950'],
  ['Em que ano foi lançado o Plano Real?', 1994, 'Real brasileiro cédulas'],
  ['Em que ano aconteceu a Semana de Arte Moderna?', 1922, 'Semana de Arte Moderna 1922'],
  ['Em que ano a União Soviética deixou de existir?', 1991, 'Kremlin 1991'],
  ['Em que ano os Estados Unidos declararam independência?', 1776, 'Declaration of Independence Trumbull'],
  ['Em que ano Tiradentes foi executado?', 1792, 'Tiradentes esquartejado'],
  ['Em que ano Santos Dumont voou com o 14-Bis em Paris?', 1906, '14-bis Santos Dumont'],
  ['Em que ano terminou o regime militar no Brasil?', 1985, 'Diretas Já'],
  ['Em que ano foi inaugurado o Cristo Redentor?', 1931, 'Christ the Redeemer Rio'],
  ['Em que ano o Titanic afundou?', 1912, 'RMS Titanic'],
  ['Em que ano Pedro Álvares Cabral partiu de Lisboa rumo às Índias?', 1500, 'Pedro Álvares Cabral'],
];

// [jogo, empresa que criou]
const JOGOS = [
  ['Super Mario Bros.', 'Nintendo'], ['The Legend of Zelda', 'Nintendo'], ['Halo', 'Bungie'], ['Uncharted', 'Naughty Dog'],
  ['The Last of Us', 'Naughty Dog'], ['Minecraft', 'Mojang'], ['Fortnite', 'Epic Games'], ['Grand Theft Auto V', 'Rockstar Games'],
  ['Red Dead Redemption 2', 'Rockstar Games'], ['The Sims', 'Maxis'], ['Overwatch', 'Blizzard'], ['World of Warcraft', 'Blizzard'],
  ['League of Legends', 'Riot Games'], ['Valorant', 'Riot Games'], ['Half-Life', 'Valve'], ['Portal', 'Valve'],
  ['Counter-Strike 2', 'Valve'], ['Sonic the Hedgehog', 'Sega'], ['Street Fighter', 'Capcom'], ['Resident Evil', 'Capcom'],
  ['Metal Gear Solid', 'Konami'], ['Pac-Man', 'Namco'], ['Among Us', 'Innersloth'], ['Free Fire', 'Garena'],
  ['Candy Crush Saga', 'King'], ['Angry Birds', 'Rovio'], ['The Witcher 3', 'CD Projekt Red'], ['Cyberpunk 2077', 'CD Projekt Red'],
  ['Elden Ring', 'FromSoftware'], ['Dark Souls', 'FromSoftware'], ['Hollow Knight', 'Team Cherry'], ['Fall Guys', 'Mediatonic'],
];

// [filme, diretor(a)]
const FILMES = [
  ['Titanic', 'James Cameron'], ['Avatar', 'James Cameron'], ['Jurassic Park', 'Steven Spielberg'], ['E.T. – O Extraterrestre', 'Steven Spielberg'],
  ['Tubarão', 'Steven Spielberg'], ['Pulp Fiction', 'Quentin Tarantino'], ['Kill Bill', 'Quentin Tarantino'], ['A Origem', 'Christopher Nolan'],
  ['Interestelar', 'Christopher Nolan'], ['Oppenheimer', 'Christopher Nolan'], ['O Poderoso Chefão', 'Francis Ford Coppola'], ['Cidade de Deus', 'Fernando Meirelles'],
  ['Central do Brasil', 'Walter Salles'], ['Ainda Estou Aqui', 'Walter Salles'], ['Tropa de Elite', 'José Padilha'], ['Psicose', 'Alfred Hitchcock'],
  ['O Senhor dos Anéis: A Sociedade do Anel', 'Peter Jackson'], ['Parasita', 'Bong Joon-ho'], ['A Viagem de Chihiro', 'Hayao Miyazaki'], ['Barbie', 'Greta Gerwig'],
  ['Pantera Negra', 'Ryan Coogler'], ['Clube da Luta', 'David Fincher'], ['Forrest Gump', 'Robert Zemeckis'], ['De Volta para o Futuro', 'Robert Zemeckis'],
  ['Star Wars: Uma Nova Esperança', 'George Lucas'], ['Alien, o Oitavo Passageiro', 'Ridley Scott'], ['Gladiador', 'Ridley Scott'], ['Taxi Driver', 'Martin Scorsese'],
  ['O Iluminado', 'Stanley Kubrick'], ['2001: Uma Odisseia no Espaço', 'Stanley Kubrick'],
];

// [atleta, esporte]
const ATLETAS = [
  ['Ayrton Senna', 'Fórmula 1'], ['Gustavo Kuerten (Guga)', 'Tênis'], ['Oscar Schmidt', 'Basquete'], ['Rayssa Leal', 'Skate'],
  ['Gabriel Medina', 'Surfe'], ['Marta', 'Futebol'], ['Daiane dos Santos', 'Ginástica artística'], ['César Cielo', 'Natação'],
  ['Isaquias Queiroz', 'Canoagem'], ['Sarah Menezes', 'Judô'], ['Hortência', 'Basquete'], ['Nelson Piquet', 'Fórmula 1'],
  ['Maurren Maggi', 'Atletismo'], ['Usain Bolt', 'Atletismo'], ['Michael Phelps', 'Natação'], ['Serena Williams', 'Tênis'],
  ['Michael Jordan', 'Basquete'], ['LeBron James', 'Basquete'], ['Simone Biles', 'Ginástica artística'], ['Roger Federer', 'Tênis'],
  ['Lionel Messi', 'Futebol'], ['Tom Brady', 'Futebol americano'], ['Lewis Hamilton', 'Fórmula 1'], ['Ítalo Ferreira', 'Surfe'],
  ['Mayra Aguiar', 'Judô'], ['Ana Marcela Cunha', 'Maratona aquática'],
];

// [animal, classe, busca]
const ANIMAIS = [
  ['golfinho', 'Mamífero', 'Bottlenose dolphin'], ['ornitorrinco', 'Mamífero', 'Platypus'], ['avestruz', 'Ave', 'Ostrich'], ['beija-flor', 'Ave', 'Hummingbird'],
  ['jacaré', 'Réptil', 'Caiman yacare'], ['camaleão', 'Réptil', 'Chameleon'], ['salamandra', 'Anfíbio', 'Fire salamander'], ['perereca', 'Anfíbio', 'Tree frog'],
  ['cavalo-marinho', 'Peixe', 'Seahorse'], ['tubarão-baleia', 'Peixe', 'Whale shark'], ['orca', 'Mamífero', 'Orca'], ['morsa', 'Mamífero', 'Walrus'],
  ['coruja', 'Ave', 'Owl'], ['iguana', 'Réptil', 'Green iguana'], ['axolote', 'Anfíbio', 'Axolotl'], ['peixe-palhaço', 'Peixe', 'Clownfish'],
  ['ema', 'Ave', 'Greater rhea'], ['tamanduá-bandeira', 'Mamífero', 'Giant anteater'], ['bicho-preguiça', 'Mamífero', 'Sloth'], ['sucuri', 'Réptil', 'Green anaconda'],
  ['piranha', 'Peixe', 'Piranha'], ['arara-azul', 'Ave', 'Hyacinth macaw'], ['tartaruga-marinha', 'Réptil', 'Sea turtle'], ['cobra-coral', 'Réptil', 'Coral snake'],
  ['lobo-guará', 'Mamífero', 'Maned wolf'], ['tucano', 'Ave', 'Toco toucan'], ['raia', 'Peixe', 'Stingray'], ['sapo-cururu', 'Anfíbio', 'Cane toad'],
];
const CLASSES = ['Mamífero', 'Ave', 'Réptil', 'Anfíbio', 'Peixe'];

// [instrumento, família, busca]
const INSTRUMENTOS = [
  ['violino', 'Cordas', 'Violin'], ['violoncelo', 'Cordas', 'Cello'], ['contrabaixo', 'Cordas', 'Double bass'], ['harpa', 'Cordas', 'Concert harp'],
  ['cavaquinho', 'Cordas', 'Cavaquinho'], ['ukulele', 'Cordas', 'Ukulele'], ['bandolim', 'Cordas', 'Mandolin'], ['flauta transversal', 'Sopro', 'Western concert flute'],
  ['clarinete', 'Sopro', 'Clarinet'], ['oboé', 'Sopro', 'Oboe'], ['fagote', 'Sopro', 'Bassoon'], ['trompete', 'Sopro', 'Trumpet'],
  ['trombone', 'Sopro', 'Trombone'], ['tuba', 'Sopro', 'Tuba'], ['saxofone', 'Sopro', 'Saxophone'], ['tímpano', 'Percussão', 'Timpani'],
  ['xilofone', 'Percussão', 'Xylophone'], ['triângulo', 'Percussão', 'Triangle instrument'], ['surdo', 'Percussão', 'Surdo drum'], ['cuíca', 'Percussão', 'Cuíca'],
  ['agogô', 'Percussão', 'Agogô'], ['cravo', 'Teclado', 'Harpsichord'], ['órgão de tubos', 'Teclado', 'Pipe organ'], ['sintetizador', 'Teclado', 'Synthesizer'],
];
const FAMILIAS = ['Cordas', 'Sopro', 'Percussão', 'Teclado'];

// [artista, estilo]
const ARTISTAS = [
  ['João Gilberto', 'Bossa nova'], ['Cartola', 'Samba'], ['Pixinguinha', 'Choro'], ['Raul Seixas', 'Rock'], ['Legião Urbana', 'Rock'],
  ['Ivete Sangalo', 'Axé'], ['Marília Mendonça', 'Sertanejo'], ['Chitãozinho & Xororó', 'Sertanejo'], ['Zeca Pagodinho', 'Samba'],
  ['Dominguinhos', 'Forró'], ['Gilberto Gil', 'MPB'], ['Elis Regina', 'MPB'], ['Racionais MC\'s', 'Rap'], ['Sepultura', 'Metal'],
];

// [planeta, posição a partir do Sol]
const PLANETAS = [['Mercúrio', 1, 'Mercury MESSENGER'], ['Vênus', 2, 'Venus planet'], ['Terra', 3, 'Blue Marble'], ['Marte', 4, 'Mars Hubble'],
  ['Júpiter', 5, 'Jupiter Juno'], ['Saturno', 6, 'Saturn Cassini'], ['Urano', 7, 'Uranus Voyager'], ['Netuno', 8, 'Neptune Voyager']];
// [lua, planeta, busca]
const LUAS = [['Titã', 'Saturno', 'Titan moon'], ['Europa', 'Júpiter', 'Europa moon Galileo'], ['Ganimedes', 'Júpiter', 'Ganymede moon'], ['Io', 'Júpiter', 'Io moon Galileo'],
  ['Tritão', 'Netuno', 'Triton moon'], ['Fobos', 'Marte', 'Phobos moon'], ['Encélado', 'Saturno', 'Enceladus'], ['Caronte', 'Plutão', 'Charon New Horizons']];

// [órgão, sistema]
const ORGAOS = [
  ['estômago', 'Digestório'], ['fígado', 'Digestório'], ['esôfago', 'Digestório'], ['intestino grosso', 'Digestório'], ['traqueia', 'Respiratório'],
  ['brônquios', 'Respiratório'], ['diafragma', 'Respiratório'], ['alvéolos', 'Respiratório'], ['cérebro', 'Nervoso'], ['medula espinhal', 'Nervoso'],
  ['nervos', 'Nervoso'], ['artérias', 'Circulatório'], ['veias', 'Circulatório'], ['bexiga', 'Urinário'], ['ureteres', 'Urinário'],
];
const SISTEMAS = ['Digestório', 'Respiratório', 'Nervoso', 'Circulatório', 'Urinário'];

// [coletivo de…, coletivo, busca]
const COLETIVOS = [
  ['abelhas', 'Enxame', 'Bee swarm'], ['ovelhas', 'Rebanho', 'Flock of sheep'], ['estrelas', 'Constelação', 'Orion constellation'], ['navios', 'Frota', 'Fleet of ships'],
  ['músicos', 'Orquestra', 'Symphony orchestra'], ['ilhas', 'Arquipélago', 'Fernando de Noronha'], ['cães', 'Matilha', 'Pack of dogs'], ['aves', 'Bando', 'Flock of birds'],
  ['alunos', 'Turma', 'Classroom students'], ['chaves', 'Molho', 'Bunch of keys'], ['uvas', 'Cacho', 'Bunch of grapes'], ['montanhas', 'Cordilheira', 'Andes mountains'],
  ['artistas de um filme', 'Elenco', 'Film cast'], ['camelos', 'Cáfila', 'Camel caravan'], ['soldados', 'Tropa', 'Soldiers marching'],
];
// [palavra, antônimo]
const ANTONIMOS = [['alto', 'Baixo'], ['quente', 'Frio'], ['rico', 'Pobre'], ['cheio', 'Vazio'], ['claro', 'Escuro'], ['forte', 'Fraco'],
  ['rápido', 'Lento'], ['novo', 'Velho'], ['aberto', 'Fechado'], ['ganhar', 'Perder'], ['início', 'Fim'], ['sempre', 'Nunca']];

// [criação, criador(es)]
const CRIADORES = [
  ['Microsoft', 'Bill Gates e Paul Allen'], ['Apple', 'Steve Jobs e Steve Wozniak'], ['Facebook', 'Mark Zuckerberg'], ['Amazon', 'Jeff Bezos'],
  ['SpaceX', 'Elon Musk'], ['Google', 'Larry Page e Sergey Brin'], ['Linux', 'Linus Torvalds'], ['linguagem Python', 'Guido van Rossum'],
  ['linguagem JavaScript', 'Brendan Eich'], ['World Wide Web (www)', 'Tim Berners-Lee'], ['Nubank', 'David Vélez, Cristina Junqueira e Edward Wible'], ['Wikipédia', 'Jimmy Wales e Larry Sanger'],
];
// [extensão, tipo de arquivo]
const EXTENSOES = [['.pdf', 'Documento PDF'], ['.mp3', 'Áudio'], ['.jpg', 'Imagem'], ['.mp4', 'Vídeo'], ['.zip', 'Arquivo compactado'],
  ['.exe', 'Programa do Windows'], ['.xlsx', 'Planilha'], ['.docx', 'Documento de texto'], ['.html', 'Página web'], ['.css', 'Folha de estilo']];

// [anime/fato, resposta, erradas…]
const ANIME_EXTRA = [
  ['Quem criou o mangá "Naruto"?', 'Masashi Kishimoto', 'Eiichiro Oda', 'Akira Toriyama', 'Hajime Isayama'],
  ['Quem criou o mangá "One Piece"?', 'Eiichiro Oda', 'Masashi Kishimoto', 'Tite Kubo', 'Akira Toriyama'],
  ['Quem criou "Dragon Ball"?', 'Akira Toriyama', 'Eiichiro Oda', 'Rumiko Takahashi', 'Yoshihiro Togashi'],
  ['Quem criou "Attack on Titan"?', 'Hajime Isayama', 'Masashi Kishimoto', 'Gege Akutami', 'Kohei Horikoshi'],
  ['Qual é o nome do protagonista de "Death Note"?', 'Light Yagami', 'L Lawliet', 'Ryuk', 'Near'],
  ['Em "Fullmetal Alchemist", os protagonistas são os irmãos…', 'Elric', 'Uchiha', 'Kurosaki', 'Yagami'],
  ['Quem é o protagonista de "Hunter x Hunter"?', 'Gon', 'Killua', 'Kurapika', 'Leorio'],
  ['Quem é o protagonista de "Bleach"?', 'Ichigo Kurosaki', 'Rukia Kuchiki', 'Renji Abarai', 'Uryu Ishida'],
  ['Quem é o protagonista de "Jujutsu Kaisen"?', 'Yuji Itadori', 'Megumi Fushiguro', 'Satoru Gojo', 'Nobara Kugisaki'],
  ['Quem é o protagonista de "Chainsaw Man"?', 'Denji', 'Aki', 'Power', 'Makima'],
  ['Em "Spy x Family", qual é o sobrenome da família?', 'Forger', 'Briar', 'Desmond', 'Blackbell'],
  ['Em "Os Cavaleiros do Zodíaco", Seiya é o cavaleiro de…', 'Pégaso', 'Dragão', 'Cisne', 'Andrômeda'],
  ['Qual é o nome do herói careca de "One Punch Man"?', 'Saitama', 'Genos', 'Bang', 'Mumen Rider'],
  ['"Haikyuu!!" é um anime sobre qual esporte?', 'Vôlei', 'Basquete', 'Futebol', 'Beisebol'],
  ['"Slam Dunk" é um anime sobre qual esporte?', 'Basquete', 'Vôlei', 'Tênis', 'Futebol'],
  ['"Super Campeões" (Captain Tsubasa) é sobre qual esporte?', 'Futebol', 'Basquete', 'Beisebol', 'Rugby'],
  ['Em "Yu-Gi-Oh!", os duelos são feitos com…', 'Cartas', 'Pião', 'Robôs', 'Espadas'],
  ['Quem pilota a Unidade 01 em "Evangelion"?', 'Shinji Ikari', 'Asuka Langley', 'Rei Ayanami', 'Kaworu Nagisa'],
  ['Em "Pokémon", Pikachu evolui para…', 'Raichu', 'Pichu', 'Jolteon', 'Electabuzz'],
  ['Qual é o Pokémon número 1 da Pokédex?', 'Bulbasaur', 'Pikachu', 'Charmander', 'Mew'],
  ['"Kimetsu no Yaiba" é o nome original de…', 'Demon Slayer', 'Jujutsu Kaisen', 'Bleach', 'Black Clover'],
  ['Quem dirigiu "Meu Vizinho Totoro"?', 'Hayao Miyazaki', 'Makoto Shinkai', 'Mamoru Hosoda', 'Satoshi Kon'],
  ['Quem dirigiu "Your Name" (Kimi no Na wa)?', 'Makoto Shinkai', 'Hayao Miyazaki', 'Isao Takahata', 'Mamoru Oshii'],
];

// ---------- gerador ----------
export function perguntasDeTabelas({ pega, embaralha, int }) {
  const outras = (lista, certa, n = 3) => embaralha([...new Set(lista)].filter(x => x !== certa)).slice(0, n);
  const busca = b => (b ? [{ busca: b }] : []);
  const sem = s => s.replace(/^(da|do|de|dos|das) /, '');
  const P = {};
  const add = (tema, ...linhas) => (P[tema] ||= []).push(...linhas);

  ESTADOS.forEach(([e, sigla, cap, reg]) => {
    const foto = busca(`${cap} ${sem(e)} Brazil`);
    if (cap !== sem(e)) add('brasil', [`Qual é a capital ${e}?`, cap, ...outras(ESTADOS.map(x => x[2]), cap), ...foto]);
    add('brasil', [`Qual é a sigla ${e}?`, sigla, ...outras(ESTADOS.map(x => x[1]), sigla), ...foto]);
    add('brasil', [`Em que região fica o estado ${e}?`, reg, ...outras(['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'], reg), ...foto]);
    if (cap !== sem(e)) add('brasil', [`${cap} é capital de qual estado?`, sem(e), ...outras(ESTADOS.map(x => sem(x[0])), sem(e)), ...foto]);
  });
  PAISES.forEach(([p, cap, cont, b]) => {
    add('mundo', [`Qual é a capital ${p}?`, cap, ...outras(PAISES.filter(x => x[2] === cont).map(x => x[1]), cap), ...busca(b)]);
    add('mundo', [`Em que continente fica ${p.startsWith('d') ? sem(p) : p}?`, cont, ...outras(CONTINENTES, cont), ...busca(b)]);
  });
  ELEMENTOS.forEach(([nome, s, b]) => {
    add('ciencia', [`Qual é o símbolo químico do elemento ${nome}?`, s, ...outras(ELEMENTOS.map(x => x[1]), s), ...busca(b)]);
    add('ciencia', [`O símbolo "${s}" representa qual elemento?`, nome, ...outras(ELEMENTOS.map(x => x[0]), nome), ...busca(b)]);
  });
  EVENTOS.forEach(([texto, ano, b]) => {
    const erradas = new Set(); while (erradas.size < 3) { const d = ano + pega([-60, -40, -25, -12, -8, -4, 4, 8, 12, 25, 40]); if (d !== ano) erradas.add(String(d)); }
    add('historia', [texto, String(ano), ...erradas, ...busca(b)]);
  });
  JOGOS.forEach(([j, emp]) => add('games', [`Qual empresa criou "${j}"?`, emp, ...outras(JOGOS.map(x => x[1]), emp)]));
  FILMES.forEach(([f, d]) => add('filmes', [`Quem dirigiu "${f}"?`, d, ...outras(FILMES.map(x => x[1]), d)]));
  ATLETAS.forEach(([a, e]) => add('esportes', [`Em qual esporte ${a} ficou conhecido(a)?`, e, ...outras(ATLETAS.map(x => x[1]), e)]));
  const mai = s => s[0].toUpperCase() + s.slice(1);
  ANIMAIS.forEach(([a, c, b]) => add('bichos', [`${mai(a)}: que tipo de animal é?`, c, ...outras(CLASSES, c), ...busca(b)]));
  INSTRUMENTOS.forEach(([i, f, b]) => add('musica', [`${mai(i)}: de qual família de instrumentos?`, f, ...outras(FAMILIAS, f), ...busca(b)]));
  ARTISTAS.forEach(([a, e]) => add('musica', [`${a} é um nome importante de qual estilo?`, e, ...outras(ARTISTAS.map(x => x[1]), e)]));
  PLANETAS.forEach(([p, n, b]) => add('espaco', [`Qual é a posição de ${p} a partir do Sol?`, `${n}º`, ...outras(PLANETAS.map(x => `${x[1]}º`), `${n}º`), ...busca(b)]));
  LUAS.forEach(([l, p, b]) => add('espaco', [`${l} é uma lua de qual astro?`, p, ...outras(['Júpiter', 'Saturno', 'Netuno', 'Marte', 'Urano', 'Plutão'], p), ...busca(b)]));
  ORGAOS.forEach(([o, s]) => add('corpo', [`A que sistema do corpo pertence: ${o}?`, s, ...outras(SISTEMAS, s)]));
  COLETIVOS.forEach(([de, c, b]) => add('portugues', [`Qual é o coletivo de ${de}?`, c, ...outras(COLETIVOS.map(x => x[1]), c), ...busca(b)]));
  ANTONIMOS.forEach(([p, a]) => add('portugues', [`Qual é o antônimo de "${p}"?`, a, ...outras(ANTONIMOS.map(x => x[1]), a)]));
  CRIADORES.forEach(([c, q]) => add('tech', [`Quem criou ${c}?`, q, ...outras(CRIADORES.map(x => x[1]), q)]));
  EXTENSOES.forEach(([e, t]) => add('tech', [`Um arquivo terminado em "${e}" normalmente é…`, t, ...outras(EXTENSOES.map(x => x[1]), t)]));
  ANIME_EXTRA.forEach(l => add('anime', l));

  // matemática: contas sem repetir
  const vistas = new Set();
  while (vistas.size < 90) {
    const op = pega(['+', '−', '×', '÷']); let a = int(6, 99), b = int(2, 49);
    if (op === '×') { a = int(3, 15); b = int(3, 15); }
    if (op === '÷') { b = int(2, 12); a = b * int(2, 12); }
    if (op === '−' && b > a) [a, b] = [b, a];
    const texto = `Quanto é ${a} ${op} ${b}?`;
    if (vistas.has(texto)) continue;
    vistas.add(texto);
    const c = op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : a / b;
    const err = new Set(); while (err.size < 3) { const e = c + pega([-10, -3, -2, -1, 1, 2, 3, 10]); if (e !== c && e >= 0) err.add(String(e)); }
    add('matematica', [texto, String(c), ...err]);
  }
  return P;
}

// termos de busca de mídia usados pelas tabelas (para o script que baixa as fotos)
export function termosDeBusca() {
  const t = new Set();
  ESTADOS.forEach(([e, , cap]) => t.add(`${cap} ${e.replace(/^(da|do|de) /, '')} Brazil`));
  [PAISES.map(x => x[3]), ELEMENTOS.map(x => x[2]), EVENTOS.map(x => x[2]), ANIMAIS.map(x => x[2]), INSTRUMENTOS.map(x => x[2]),
    PLANETAS.map(x => x[2]), LUAS.map(x => x[2]), COLETIVOS.map(x => x[2])].flat().forEach(x => t.add(x));
  return [...t];
}
