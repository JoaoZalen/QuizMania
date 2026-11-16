import express from 'express';
import __dirname from '../utils/pathUtils.js';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import cors from 'cors';
import Usuario from '../models/Usuario.js';
import { pastaUploads } from '../utils/arquivos.js';

//Middlewares
//Limite maior porque fotos e vídeos chegam dentro do JSON (base64)
const urlencodedMiddleware = express.urlencoded({ extended: true, limit: '60mb'});
const jsonMiddleware = express.json({ limit: '60mb'});

//cross-origin: deixa o Vue (porta 8080) exibir as imagens e vídeos servidos pela API
const securityMiddleware = helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } });

const compressionMiddlewware = compression();

const rateLimitMiddleware = rateLimit({
    windowMs: 10 * 60 * 1000,  // 10 minutos
    max: 100,                  // Limita cada IP a 100 requisições por janela
    message: 'Muitas requisições, tente novamente em 10 minutos.'
});

const logFile = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags:'a'});
const morganMiddleware = morgan('combined', { stream: logFile});

const corsMiddleware = cors({
    origin: '*' //Possibilita acesso por qualquer origem URL de consumo
});

//Arquivos enviados (fotos de perfil, imagens dos quizzes e mídias das perguntas)
const uploadsMiddleware = express.static(pastaUploads);

//Autenticação: lê o token do cabeçalho "Authorization: Bearer <token>" e coloca o usuário em req.usuario
const authMiddleware = async (req, res, next) => {
    try {
        const token = (req.headers.authorization || '').replace('Bearer ', '');
        const usuario = token ? await Usuario.findByToken(token) : null;

        if(!usuario){
            return res.status(401).json({ message: 'Entre na sua conta para continuar'});
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        console.error('Erro na autenticação', error);
        res.status(500).json({ message: 'Erro interno na autenticação'});
    }
};

export {
    uploadsMiddleware,
    authMiddleware,
    urlencodedMiddleware,
    jsonMiddleware,
    securityMiddleware,
    compressionMiddlewware,
    rateLimitMiddleware,
    morganMiddleware,
    corsMiddleware
};
