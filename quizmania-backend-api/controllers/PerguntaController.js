import Pergunta from '../models/Pergunta.js';
import Quiz from '../models/Quiz.js';

//Confere se os dados da pergunta vieram completos. Retorna a mensagem de erro ou null
function validarPergunta(dados){
    const { enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta } = dados;

    if(!enunciado || !alternativa_a || !alternativa_b || !alternativa_c || !alternativa_d){
        return 'Preencha o enunciado e as quatro alternativas';
    }
    if(!['A', 'B', 'C', 'D'].includes(correta)){
        return 'A alternativa correta deve ser A, B, C ou D';
    }
    return null;
}

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
            const { enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta } = req.body;

            const quizExistente = await Quiz.findById(id);

            if(!quizExistente){
                return res.status(404).json({ message: 'Quiz não encontrado'});
            }

            const erro = validarPergunta(req.body);

            if(erro){
                return res.status(400).json({ message: erro});
            }

            const novaPergunta = new Pergunta(id, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta);
            await novaPergunta.save();
            res.status(201).json(novaPergunta);
        } catch (error) {
            console.error('Erro ao cadastrar pergunta', error);
            res.status(500).json({message: 'Erro interno ao cadastrar a pergunta'});
        }
    }

    static async updatePergunta(req, res){
        try {
            const { id } = req.params; //ID da pergunta
            const { enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta } = req.body;

            const perguntaExistente = await Pergunta.findById(id);

            if(!perguntaExistente){
                return res.status(404).json({ message: 'Pergunta não encontrada'});
            }

            const erro = validarPergunta(req.body);

            if(erro){
                return res.status(400).json({ message: erro});
            }

            await Pergunta.update(id, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta);
            const perguntaAtualizada = await Pergunta.findById(id);
            res.json(perguntaAtualizada);
        } catch (error) {
            console.error('Erro ao atualizar pergunta', error);
            res.status(500).json({message: 'Erro interno ao atualizar a pergunta'});
        }
    }

    static async deletePergunta(req, res){
        try {
            const { id } = req.params; //ID da pergunta
            const perguntaExistente = await Pergunta.findById(id);

            if(!perguntaExistente){
                return res.status(404).json({ message: 'Pergunta não encontrada'});
            }

            await Pergunta.delete(id);
            res.json({ message: 'Pergunta excluída com sucesso'});
        } catch (error) {
            console.error('Erro ao excluir pergunta', error);
            res.status(500).json({message: 'Erro interno ao excluir a pergunta'});
        }
    }

}

export default PerguntaController;
