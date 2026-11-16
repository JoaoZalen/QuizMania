import crypto from 'crypto';

//Gera o hash da senha com um "sal" aleatório. Formato salvo no banco: sal:hash
function gerarHash(senha){
    const sal = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(senha, sal, 64).toString('hex');
    return `${sal}:${hash}`;
}

//Confere se a senha digitada bate com o hash salvo no banco
function conferirSenha(senha, salvo){
    const [sal, hash] = String(salvo).split(':');
    if(!sal || !hash) return false;
    const teste = crypto.scryptSync(senha, sal, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(teste, 'hex'));
}

//Token de sessão enviado no cabeçalho Authorization
function gerarToken(){
    return crypto.randomBytes(32).toString('hex');
}

export { gerarHash, conferirSenha, gerarToken };
