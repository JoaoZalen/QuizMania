import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

//Carrega o .env aqui porque as variáveis são usadas logo abaixo, na criação do pool
dotenv.config();

//Pool de conexões com o MySQL (usando variáveis do ambiente .env)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//Testa a conexão quando o servidor inicia
const connectBD = async () => {
    try {
        const conexao = await pool.getConnection();
        console.log('MySQL conectado com sucesso!');
        conexao.release(); //Devolve a conexão para o pool

    } catch (error) {
        console.error('Erro ao conectar no MySQL: ', error.message);
        process.exit(1); //Finaliza a aplicação
    }
};

export { pool };
export default connectBD;
