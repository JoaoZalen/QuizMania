import Quiz from '../models/Quiz.js';

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

    static async createQuiz(req, res){
        try {
            const { titulo, descricao, categoria } = req.body;

            if(!titulo || !descricao || !categoria){
                return res.status(400).json({ message: 'Preencha título, descrição e categoria'});
            }

            const quizExistente = await Quiz.findByTitulo(titulo);

            if(quizExistente){
                return res.status(400).json({ message: 'Já existe um quiz com esse título'});
            }
            else{
                const novoQuiz = new Quiz(titulo, descricao, categoria);
                await novoQuiz.save();
                res.status(201).json(novoQuiz);
            }
        } catch (error) {
            console.error('Erro ao cadastrar quiz', error);
            res.status(500).json({message: 'Erro interno ao cadastrar o quiz'});
        }
    }

    static async updateQuiz(req, res){
        try {
            const { id } = req.params;
            const { titulo, descricao, categoria } = req.body;

            if(!titulo || !descricao || !categoria){
                return res.status(400).json({ message: 'Preencha título, descrição e categoria'});
            }

            const quizExistente = await Quiz.findById(id);

            if(!quizExistente){
                return res.status(404).json({ message: 'Quiz não encontrado'});
            }

            //Não deixa usar um título que já pertence a outro quiz
            const quizMesmoTitulo = await Quiz.findByTitulo(titulo);

            if(quizMesmoTitulo && quizMesmoTitulo.id != id){
                return res.status(400).json({ message: 'Já existe um quiz com esse título'});
            }

            await Quiz.update(id, titulo, descricao, categoria);
            const quizAtualizado = await Quiz.findById(id);
            res.json(quizAtualizado);
        } catch (error) {
            console.error('Erro ao atualizar quiz', error);
            res.status(500).json({message: 'Erro interno ao atualizar o quiz'});
        }
    }

    static async deleteQuiz(req, res){
        try {
            const { id } = req.params;
            const quizExistente = await Quiz.findById(id);

            if(!quizExistente){
                return res.status(404).json({ message: 'Quiz não encontrado'});
            }

            await Quiz.delete(id); //As perguntas do quiz são excluídas junto (ON DELETE CASCADE)
            res.json({ message: 'Quiz excluído com sucesso'});
        } catch (error) {
            console.error('Erro ao excluir quiz', error);
            res.status(500).json({message: 'Erro interno ao excluir o quiz'});
        }
    }

}

export default QuizController;
