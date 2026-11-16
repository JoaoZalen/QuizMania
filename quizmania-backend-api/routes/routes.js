import express from "express";
import QuizController from '../controllers/QuizController.js';
import PerguntaController from '../controllers/PerguntaController.js';

const router = express.Router();

//API RESTful - Rotas dos quizzes

//GET todos os quizzes
router.get('/quizzes', QuizController.getAllQuizzes);

//GET quiz por ID
router.get('/quizzes/:id', QuizController.getQuizById);

//POST novo quiz
router.post('/quizzes', QuizController.createQuiz);

//PUT atualizar quiz por ID
router.put('/quizzes/:id', QuizController.updateQuiz);

//DELETE quiz por ID
router.delete('/quizzes/:id', QuizController.deleteQuiz);

//API RESTful - Rotas das perguntas

//GET todas as perguntas de um quiz
router.get('/quizzes/:id/perguntas', PerguntaController.getPerguntasByQuiz);

//POST nova pergunta dentro de um quiz
router.post('/quizzes/:id/perguntas', PerguntaController.createPergunta);

//GET pergunta por ID
router.get('/perguntas/:id', PerguntaController.getPerguntaById);

//PUT atualizar pergunta por ID
router.put('/perguntas/:id', PerguntaController.updatePergunta);

//DELETE pergunta por ID
router.delete('/perguntas/:id', PerguntaController.deletePergunta);

export default router;
