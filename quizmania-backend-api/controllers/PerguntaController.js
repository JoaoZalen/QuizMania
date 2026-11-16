import Pergunta from '../models/Pergunta.js';
import Quiz from '../models/Quiz.js';
import { salvarArquivo, apagarArquivo } from '../utils/arquivos.js';

//Confere se os dados da pergunta vieram completos. Retorna a mensagem de erro ou null
function validarPergunta(dados){
    const { enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta, midia_tipo, midia_url } = dados;

    if(!enunciado || !alternativa_a || !alternativa_b || !alternativa_c || !alternativa_d){
        return 'Preencha o enunciado e as quatro alternativas';
    }
    if(!['A', 'B', 'C', 'D'].includes(correta)){
        return 'A alternativa correta deve ser A, B, C ou D';
    }
    if(midia_tipo && !['imagem', 'video'].includes(midia_tipo)){
        return 'A mídia deve ser imagem ou vídeo';
    }
    if(midia_tipo && !midia_url){
        return 'Escolha o arquivo ou informe o link da mídia';
    }
    return null;
}

//Mensagem de erro de arquivo inválido vem do utils/arquivos.js; o resto é erro interno
const mensagemErro = (error, padrao) => error.message.startsWith('Arquivo') ? error.message : padrao;

class PerguntaController{

    static async getPerguntasByQuiz(req, res){
        try {
            const { id } = req.params; //ID do quiz
            const quizExistente = await Quiz.findById(id);

            if(!quizExistente){
                return res.status(404).json({ message: 'Quiz não encontrado'});
            }

            const perguntas = await Pergunta.findByQuiz(id);
            res.json(perguntas); //Retorna as perguntas como JSON
        } catch (error) {
            console.error('Erro ao carregar as perguntas:', error);
            res.status(500).json({message: 'Erro interno ao buscar perguntas'});
        }
    }

    static async getPerguntaById(req, res){
        try {
            const { id } = req.params; //ID da pergunta
            const perguntaExistente = await Pergunta.findById(id);

            if(!perguntaExistente){
                return res.status(404).json({ message: 'Pergunta não encontrada'});
            }
            res.json(perguntaExistente);
        } catch (error) {
            console.error('Erro ao carregar a pergunta:', error);
            res.status(500).json({message: 'Erro interno ao buscar a pergunta'});
        }
    }

    static async createPergunta(req, res){
        try {
            const { id } = req.params; //ID do quiz que vai receber a pergunta
            const { enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta, midia_tipo, midia_url } = req.body;

            const quizExistente = await Quiz.findById(id);

            if(!quizExistente){
                return res.status(404).json({ message: 'Quiz não encontrado'});
            }
            if(quizExistente.usuario_id !== req.usuario.id){
                return res.status(403).json({ message: 'Você só pode alterar os seus próprios quizzes'});
            }

            const erro = validarPergunta(req.body);

            if(erro){
                return res.status(400).json({ message: erro});
            }

            const novaPergunta = new Pergunta(id, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta,
                midia_tipo || null, midia_tipo ? salvarArquivo(midia_url) : null);
            await novaPergunta.save();
            res.status(201).json(novaPergunta);
        } catch (error) {
            console.error('Erro ao cadastrar pergunta', error);
            res.status(500).json({message: mensagemErro(error, 'Erro interno ao cadastrar a pergunta')});
        }
    }

    static async updatePergunta(req, res){
        try {
            const { id } = req.params; //ID da pergunta
            const { enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta, midia_tipo, midia_url } = req.body;

            const perguntaExistente = await Pergunta.findById(id);

            if(!perguntaExistente){
                return res.status(404).json({ message: 'Pergunta não encontrada'});
            }

            const quiz = await Quiz.findById(perguntaExistente.quiz_id);
            if(quiz.usuario_id !== req.usuario.id){
                return res.status(403).json({ message: 'Você só pode alterar os seus próprios quizzes'});
            }

            const erro = validarPergunta(req.body);

            if(erro){
                return res.status(400).json({ message: erro});
            }

            const novaMidia = midia_tipo ? salvarArquivo(midia_url) : null;
            if(perguntaExistente.midia_url && perguntaExistente.midia_url !== novaMidia){
                apagarArquivo(perguntaExistente.midia_url); //Remove a mídia antiga
            }

            await Pergunta.update(id, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta,
                midia_tipo || null, novaMidia);
            const perguntaAtualizada = await Pergunta.findById(id);
            res.json(perguntaAtualizada);
        } catch (error) {
            console.error('Erro ao atualizar pergunta', error);
            res.status(500).json({message: mensagemErro(error, 'Erro interno ao atualizar a pergunta')});
        }
    }

    static async deletePergunta(req, res){
        try {
            const { id } = req.params; //ID da pergunta
            const perguntaExistente = await Pergunta.findById(id);

            if(!perguntaExistente){
                return res.status(404).json({ message: 'Pergunta não encontrada'});
            }

            const quiz = await Quiz.findById(perguntaExistente.quiz_id);
            if(quiz.usuario_id !== req.usuario.id){
                return res.status(403).json({ message: 'Você só pode alterar os seus próprios quizzes'});
            }

            await Pergunta.delete(id);
            apagarArquivo(perguntaExistente.midia_url);
            res.json({ message: 'Pergunta excluída com sucesso'});
        } catch (error) {
            console.error('Erro ao excluir pergunta', error);
            res.status(500).json({message: 'Erro interno ao excluir a pergunta'});
        }
    }

}

export default PerguntaController;
