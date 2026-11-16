import { pool } from '../config/db.js';

//Campos que podem ir para o Vue (nunca a senha nem o token)
const camposPublicos = 'id, nome, email, foto, criado_em';

class Usuario{

    constructor(nome, email, senha, foto){
        this.nome = nome;
        this.email = email;
        this.senha = senha; //Hash da senha (utils/senha.js)
        this.foto = foto;
    }

    async save(){
        const [resultado] = await pool.query(
            'INSERT INTO usuarios (nome, email, senha, foto) VALUES (?, ?, ?, ?)',
            [this.nome, this.email, this.senha, this.foto]
        );

        this.id = resultado.insertId; //ID gerado pelo banco
        return this;
    }

    static async findAll(){
        //Traz também a quantidade de quizzes de cada usuário
        const [linhas] = await pool.query(
            `SELECT u.id, u.nome, u.foto, u.criado_em, COUNT(q.id) AS total_quizzes
             FROM usuarios u
             LEFT JOIN quizzes q ON q.usuario_id = u.id
             GROUP BY u.id
             ORDER BY u.nome`
        );
        return linhas;
    }

    static async findById(id){
        const [linhas] = await pool.query(`SELECT ${camposPublicos} FROM usuarios WHERE id = ?`, [id]);
        return linhas[0]; //undefined se não encontrar
    }

    //Usado no login: traz a senha para conferir
    static async findByEmail(email){
        const [linhas] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        return linhas[0];
    }

    static async findByToken(token){
        const [linhas] = await pool.query(`SELECT ${camposPublicos} FROM usuarios WHERE token = ?`, [token]);
        return linhas[0];
    }

    static async updateToken(id, token){
        await pool.query('UPDATE usuarios SET token = ? WHERE id = ?', [token, id]);
    }

    static async update(id, nome, email, foto){
        const [resultado] = await pool.query(
            'UPDATE usuarios SET nome = ?, email = ?, foto = ? WHERE id = ?',
            [nome, email, foto, id]
        );
        return resultado;
    }

    static async updateSenha(id, senha){
        await pool.query('UPDATE usuarios SET senha = ? WHERE id = ?', [senha, id]);
    }

    static async delete(id){
        //Os quizzes e as perguntas do usuário são excluídos junto (ON DELETE CASCADE)
        const [resultado] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
        return resultado;
    }
}

export default Usuario;
