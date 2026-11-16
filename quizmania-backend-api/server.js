import express from 'express'
import dotenv from 'dotenv';
import {
    urlencodedMiddleware, jsonMiddleware,
    securityMiddleware, compressionMiddlewware,
    rateLimitMiddleware, morganMiddleware,
    corsMiddleware
} from './middlewares/middlewares.js';
import router from './routes/routes.js';
import connectBD from './config/db.js';

//Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const port = process.env.PORT;

//Conecta ao banco de dados MySQL
connectBD();

//Registrando Middlewares
app.use(urlencodedMiddleware);
app.use(jsonMiddleware);
app.use(securityMiddleware);
app.use(compressionMiddlewware);
//app.use(rateLimitMiddleware);
app.use(morganMiddleware);
app.use(corsMiddleware);

//Registrando rotas (endpoints)
app.use(router);

app.listen(port, () => {
    console.log(`Servidor ativo rodando na porta ${port}`)
});
