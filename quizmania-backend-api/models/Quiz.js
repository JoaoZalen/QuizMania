import { pool } from '../config/db.js';

class Quiz{

    constructor(titulo, descricao, categoria){
        this.titulo = titulo;
        this.descricao = descricao;
        this.categoria = categoria;
    }

    async save(){
        const [resultado] = await pool.query(
            'INSERT INTO quizzes (titulo, descricao, categoria) VALUES (?, ?, ?)',
            [this.titulo, this.descricao, this.categoria]
        );

        this.id = resultado.insertId; //ID gerado pelo banco
        return this;
    }

    static async findAll(){
        //Traz também a quantidade de perguntas de cada quiz
        const [linhas] = await pool.query(
            `SELECT q.*, COUNT(p.id) AS total_perguntas
             FROM quizzes q
             LEFT JOIN perguntas p ON p.quiz_id = q.id
             GROUP BY q.id
             ORDER BY q.id DESC`
        );
        return linhas;
    }

    static async findById(id){
        const [linhas] = await pool.query('SELECT * FROM quizzes WHERE id = ?', [id]);
        return linhas[0]; //undefined se não encontrar
    }

    static async findByTitulo(titulo){
        const [linhas] = await pool.query('SELECT * FROM quizzes WHERE titulo = ?', [titulo]);
        return linhas[0];
    }

    static async update(id, titulo, descricao, categoria){
        const [resultado] = await pool.query(
            'UPDATE quizzes SET titulo = ?, descricao = ?, categoria = ? WHERE id = ?',
            [titulo, descricao, categoria, id]
        );
        return resultado;
    }

    static async delete(id){
        const [resultado] = await pool.query('DELETE FROM quizzes WHERE id = ?', [id]);
        return resultado;
    }
}

export default Quiz;
