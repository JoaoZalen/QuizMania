import { FOTOS } from '../data/fotos.js';

export const CATEGORIAS = ['Personalidade', 'Conhecimentos gerais', 'Ciências', 'História', 'Games', 'Filmes e séries', 'Música', 'Anime', 'Esportes', 'Animais', 'Tecnologia'];

// tema de foto usado na miniatura de cada categoria
const TEMA = {
  'Personalidade': 'pc5', 'Conhecimentos gerais': 'mundo', 'Ciências': 'ciencia', 'História': 'historia', 'Games': 'games',
  'Filmes e séries': 'filmes', 'Música': 'musica', 'Anime': 'anime', 'Esportes': 'esportes', 'Animais': 'bichos', 'Tecnologia': 'tech',
};

export const fotoCategoria = c => FOTOS[TEMA[c]]?.[0]?.u || '';

export const CORES_ALTERNATIVA = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5'];
export const LETRAS = 'ABCDEF';
