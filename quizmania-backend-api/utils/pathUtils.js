import path from 'path';
import { fileURLToPath } from 'url';

//Pasta raiz da API (um nível acima de utils)
const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export default __dirname;
