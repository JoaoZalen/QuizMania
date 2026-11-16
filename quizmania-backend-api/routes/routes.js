import express from "express";
import QuizController from '../controllers/QuizController.js';
import PerguntaController from '../controllers/PerguntaController.js';
import UsuarioController from '../controllers/UsuarioController.js';
import { authMiddleware } from '../middlewares/middlewares.js';

const router = express.Router();

//authMiddleware: a rota só funciona com o usuário logado (token no cabeçalho Authorization)

//API RESTful - Rotas de conta (login)

//POST entrar (devolve o usuário e o token)
router.post('/login', UsuarioController.login);

//POST sair (invalida o token)
router.post('/logout', authMiddleware, UsuarioController.logout);

//API RESTful - Rotas dos usuários

//GET todos os usuários
router.get('/usuarios', UsuarioController.getAllUsuarios);

//GET usuário por ID
router.get('/usuarios/:id', UsuarioController.getUsuarioById);

//GET quizzes de um usuário
router.get('/usuarios/:id/quizzes', UsuarioController.getQuizzesByUsuario);

//POST criar conta
router.post('/usuarios', UsuarioController.createUsuario);

//PUT editar conta (só a própria)
router.put('/usuarios/:id', authMiddleware, UsuarioController.updateUsuario);

//DELETE apagar conta (só a própria) e os quizzes dela
router.delete('/usuarios/:id', authMiddleware, UsuarioController.deleteUsuario);

//API RESTful - Rotas dos quizzes

//GET todos os quizzes
router.get('/quizzes', QuizController.getAllQuizzes);

//GET quiz por ID
router.get('/quizzes/:id', QuizController.getQuizById);

//POST novo quiz (vinculado ao usuário logado)
router.post('/quizzes', authMiddleware, QuizController.createQuiz);

//PUT atualizar quiz por ID (só o dono)
router.put('/quizzes/:id', authMiddleware, QuizController.updateQuiz);

//DELETE quiz por ID (só o dono)
router.delete('/quizzes/:id', authMiddleware, QuizController.deleteQuiz);

//API RESTful - Rotas das perguntas

//GET todas as perguntas de um quiz
router.get('/quizzes/:id/perguntas', PerguntaController.getPerguntasByQuiz);

//POST nova pergunta dentro de um quiz (só o dono do quiz)
router.post('/quizzes/:id/perguntas', authMiddleware, PerguntaController.createPergunta);

//GET pergunta por ID
router.get('/perguntas/:id', PerguntaController.getPerguntaById);

//PUT atualizar pergunta por ID (só o dono do quiz)
router.put('/perguntas/:id', authMiddleware, PerguntaController.updatePergunta);

//DELETE pergunta por ID (só o dono do quiz)
router.delete('/perguntas/:id', authMiddleware, PerguntaController.deletePergunta);

export default router;
