import Quiz from '../models/Quiz.js';
import { salvarArquivo, apagarArquivo } from '../utils/arquivos.js';

//Mensagem de erro de arquivo inválido vem do utils/arquivos.js; o resto é erro interno
const mensagemErro = (error, padrao) => error.message.startsWith('Arquivo') ? error.message : padrao;

class QuizController{

    static async getAllQuizzes(req, res){
        try {
            const quizzes = await Quiz.findAll();
            res.json(quizzes); //Retorna os quizzes como JSON
        } catch (error) {
            console.error('Erro ao carregar os quizzes:', error);
            res.status(500).json({message: 'Erro interno ao buscar quizzes'});
        }
    }

    static async getQuizById(req, res){
        try {
            const { id } = req.params; //Parâmetros URL
            const quizExistente = await Quiz.findById(id);

            if(!quizExistente){
                return res.status(404).json({ message: 'Quiz não encontrado'});
            }
            res.json(quizExistente); //Retorna o quiz como JSON
        } catch (error) {
            console.error('Erro ao carregar o quiz:', error);
            res.status(500).json({message: 'Erro interno ao buscar o quiz'});
        }
    }

    //O quiz fica vinculado ao usuário logado (req.usuario vem do middleware de autenticação)
    static async createQuiz(req, res){
        try {
            const { titulo, descricao, categoria, imagem } = req.body;

            if(!titulo || !descricao || !categoria){
                return res.status(400).json({ message: 'Preencha título, descrição e categoria'});
            }

            const quizExistente = await Quiz.findByTitulo(titulo);

            if(quizExistente){
                return res.status(400).json({ message: 'Já existe um quiz com esse título'});
            }
            else{
                const novoQuiz = new Quiz(req.usuario.id, titulo, descricao, categoria, salvarArquivo(imagem));
                await novoQuiz.save();
                res.status(201).json(novoQuiz);
            }
        } catch (error) {
            console.error('Erro ao cadastrar quiz', error);
            res.status(500).json({message: mensagemErro(error, 'Erro interno ao cadastrar o quiz')});
        }
    }

    static async updateQuiz(req, res){
        try {
            const { id } = req.params;
            const { titulo, descricao, categoria, imagem } = req.body;

            if(!titulo || !descricao || !categoria){
                return res.status(400).json({ message: 'Preencha título, descrição e categoria'});
            }

            const quizExistente = await Quiz.findById(id);

            if(!quizExistente){
                return res.status(404).json({ message: 'Quiz não encontrado'});
            }
            if(quizExistente.usuario_id !== req.usuario.id){
                return res.status(403).json({ message: 'Você só pode editar os seus próprios quizzes'});
            }

            //Não deixa usar um título que já pertence a outro quiz
            const quizMesmoTitulo = await Quiz.findByTitulo(titulo);

            if(quizMesmoTitulo && quizMesmoTitulo.id != id){
                return res.status(400).json({ message: 'Já existe um quiz com esse título'});
            }

            const novaImagem = salvarArquivo(imagem);
            if(quizExistente.imagem && quizExistente.imagem !== novaImagem){
                apagarArquivo(quizExistente.imagem); //Remove a imagem antiga
            }

            await Quiz.update(id, titulo, descricao, categoria, novaImagem);
            const quizAtualizado = await Quiz.findById(id);
            res.json(quizAtualizado);
        } catch (error) {
            console.error('Erro ao atualizar quiz', error);
            res.status(500).json({message: mensagemErro(error, 'Erro interno ao atualizar o quiz')});
        }
    }

    static async deleteQuiz(req, res){
        try {
            const { id } = req.params;
            const quizExistente = await Quiz.findById(id);

            if(!quizExistente){
                return res.status(404).json({ message: 'Quiz não encontrado'});
            }
            if(quizExistente.usuario_id !== req.usuario.id){
                return res.status(403).json({ message: 'Você só pode excluir os seus próprios quizzes'});
            }

            const arquivos = await Quiz.arquivosDoQuiz(id);
            await Quiz.delete(id); //As perguntas do quiz são excluídas junto (ON DELETE CASCADE)
            [quizExistente.imagem, ...arquivos].forEach(apagarArquivo);
            res.json({ message: 'Quiz excluído com sucesso'});
        } catch (error) {
            console.error('Erro ao excluir quiz', error);
            res.status(500).json({message: 'Erro interno ao excluir o quiz'});
        }
    }

}

export default QuizController;
