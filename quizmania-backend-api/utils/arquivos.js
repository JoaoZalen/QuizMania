import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import __dirname from './pathUtils.js';

const pastaUploads = path.join(__dirname, 'uploads');

//Tipos de arquivo aceitos no envio (imagem e vídeo)
const tiposAceitos = {
    'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp',
    'video/mp4': 'mp4', 'video/webm': 'webm'
};

//Recebe o valor do campo de mídia vindo do Vue:
// - "data:..." (arquivo escolhido no computador): grava em /uploads e devolve o caminho
// - link (http...) ou caminho já salvo: devolve como veio
// - vazio: devolve null
function salvarArquivo(valor){
    if(!valor) return null;
    if(!valor.startsWith('data:')) return valor;

    const partes = valor.match(/^data:([^;]+);base64,(.+)$/);
    if(!partes || !tiposAceitos[partes[1]]){
        throw new Error('Arquivo inválido. Envie imagem (jpg, png, gif, webp) ou vídeo (mp4, webm)');
    }

    if(!fs.existsSync(pastaUploads)) fs.mkdirSync(pastaUploads);
    const nome = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${tiposAceitos[partes[1]]}`;
    fs.writeFileSync(path.join(pastaUploads, nome), Buffer.from(partes[2], 'base64'));
    return `/uploads/${nome}`;
}

//Apaga um arquivo enviado (só os que estão em /uploads)
function apagarArquivo(caminho){
    if(!caminho || !caminho.startsWith('/uploads/')) return;
    const arquivo = path.join(pastaUploads, path.basename(caminho));
    if(fs.existsSync(arquivo)) fs.unlinkSync(arquivo);
}

export { salvarArquivo, apagarArquivo, pastaUploads };
