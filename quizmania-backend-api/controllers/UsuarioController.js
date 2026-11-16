import Usuario from '../models/Usuario.js';
import Quiz from '../models/Quiz.js';
import { gerarHash, conferirSenha, gerarToken } from '../utils/senha.js';
import { salvarArquivo, apagarArquivo } from '../utils/arquivos.js';

//Confere o formato do e-mail
const emailValido = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//Mensagem de erro de arquivo inválido vem do utils/arquivos.js; o resto é erro interno
const mensagemErro = (error, padrao) => error.message.startsWith('Arquivo') ? error.message : padrao;

class UsuarioController{

    static async getAllUsuarios(req, res){
        try {
            const usuarios = await Usuario.findAll();
            res.json(usuarios); //Retorna os usuários como JSON
        } catch (error) {
            console.error('Erro ao carregar os usuários:', error);
            res.status(500).json({message: 'Erro interno ao buscar usuários'});
        }
    }

    static async getUsuarioById(req, res){
        try {
            const { id } = req.params;
            const usuarioExistente = await Usuario.findById(id);

            if(!usuarioExistente){
                return res.status(404).json({ message: 'Usuário não encontrado'});
            }
            res.json(usuarioExistente);
        } catch (error) {
            console.error('Erro ao carregar o usuário:', error);
            res.status(500).json({message: 'Erro interno ao buscar o usuário'});
        }
    }

    static async getQuizzesByUsuario(req, res){
        try {
            const { id } = req.params;
            const usuarioExistente = await Usuario.findById(id);

            if(!usuarioExistente){
                return res.status(404).json({ message: 'Usuário não encontrado'});
            }
            const quizzes = await Quiz.findByUsuario(id);
            res.json(quizzes);
        } catch (error) {
            console.error('Erro ao carregar os quizzes do usuário:', error);
            res.status(500).json({message: 'Erro interno ao buscar os quizzes do usuário'});
        }
    }

    //Criar conta: já devolve o token para o usuário entrar direto
    static async createUsuario(req, res){
        try {
            const { nome, email, senha, foto } = req.body;

            if(!nome || !email || !senha){
                return res.status(400).json({ message: 'Preencha nome, e-mail e senha'});
            }
            if(!emailValido(email)){
                return res.status(400).json({ message: 'E-mail inválido'});
            }
            if(senha.length < 6){
                return res.status(400).json({ message: 'A senha precisa ter pelo menos 6 caracteres'});
            }

            const usuarioExistente = await Usuario.findByEmail(email);

            if(usuarioExistente){
                return res.status(400).json({ message: 'Já existe uma conta com esse e-mail'});
            }

            const novoUsuario = new Usuario(nome, email, gerarHash(senha), salvarArquivo(foto));
            await novoUsuario.save();

            const token = gerarToken();
            await Usuario.updateToken(novoUsuario.id, token);
            res.status(201).json({ usuario: await Usuario.findById(novoUsuario.id), token });
        } catch (error) {
            console.error('Erro ao criar conta', error);
            res.status(500).json({message: mensagemErro(error, 'Erro interno ao criar a conta')});
        }
    }

    static async login(req, res){
        try {
            const { email, senha } = req.body;

            if(!email || !senha){
                return res.status(400).json({ message: 'Preencha e-mail e senha'});
            }

            const usuario = await Usuario.findByEmail(email);

            if(!usuario || !conferirSenha(senha, usuario.senha)){
                return res.status(401).json({ message: 'E-mail ou senha incorretos'});
            }

            const token = gerarToken();
            await Usuario.updateToken(usuario.id, token);
            res.json({ usuario: await Usuario.findById(usuario.id), token });
        } catch (error) {
            console.error('Erro ao entrar', error);
            res.status(500).json({message: 'Erro interno ao entrar'});
        }
    }

    static async logout(req, res){
        try {
            await Usuario.updateToken(req.usuario.id, null); //Invalida o token
            res.json({ message: 'Você saiu da conta'});
        } catch (error) {
            console.error('Erro ao sair', error);
            res.status(500).json({message: 'Erro interno ao sair'});
        }
    }

    //Editar conta: só o próprio usuário. A senha só muda se vier preenchida
    static async updateUsuario(req, res){
        try {
            const { id } = req.params;
            const { nome, email, senha, foto } = req.body;

            if(req.usuario.id != id){
                return res.status(403).json({ message: 'Você só pode editar a sua própria conta'});
            }
            if(!nome || !email){
                return res.status(400).json({ message: 'Preencha nome e e-mail'});
            }
            if(!emailValido(email)){
                return res.status(400).json({ message: 'E-mail inválido'});
            }
            if(senha && senha.length < 6){
                return res.status(400).json({ message: 'A senha precisa ter pelo menos 6 caracteres'});
            }

            //Não deixa usar um e-mail que já pertence a outra conta
            const usuarioMesmoEmail = await Usuario.findByEmail(email);

            if(usuarioMesmoEmail && usuarioMesmoEmail.id != id){
                return res.status(400).json({ message: 'Já existe uma conta com esse e-mail'});
            }

            const novaFoto = salvarArquivo(foto);
            if(req.usuario.foto && req.usuario.foto !== novaFoto){
                apagarArquivo(req.usuario.foto); //Remove a foto antiga
            }

            await Usuario.update(id, nome, email, novaFoto);
            if(senha){
                await Usuario.updateSenha(id, gerarHash(senha));
            }
            res.json(await Usuario.findById(id));
        } catch (error) {
            console.error('Erro ao atualizar conta', error);
            res.status(500).json({message: mensagemErro(error, 'Erro interno ao atualizar a conta')});
        }
    }

    //Apagar conta: exclui o usuário, os quizzes e as perguntas dele, e os arquivos enviados
    static async deleteUsuario(req, res){
        try {
            const { id } = req.params;

            if(req.usuario.id != id){
                return res.status(403).json({ message: 'Você só pode apagar a sua própria conta'});
            }

            const arquivos = await Quiz.arquivosDoUsuario(id);
            await Usuario.delete(id); //Quizzes e perguntas saem junto (ON DELETE CASCADE)
            [req.usuario.foto, ...arquivos].forEach(apagarArquivo);
            res.json({ message: 'Conta apagada com sucesso'});
        } catch (error) {
            console.error('Erro ao apagar conta', error);
            res.status(500).json({message: 'Erro interno ao apagar a conta'});
        }
    }

}

export default UsuarioController;
