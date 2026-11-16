import { pool } from '../config/db.js';

//SELECT base: quiz + dados do autor + quantidade de perguntas
const selectQuiz = `SELECT q.*, u.nome AS autor_nome, u.foto AS autor_foto, COUNT(p.id) AS total_perguntas
                    FROM quizzes q
                    JOIN usuarios u ON u.id = q.usuario_id
                    LEFT JOIN perguntas p ON p.quiz_id = q.id`;

class Quiz{

    constructor(usuario_id, titulo, descricao, categoria, imagem){
        this.usuario_id = usuario_id; //Usuário que criou o quiz
        this.titulo = titulo;
        this.descricao = descricao;
        this.categoria = categoria;
        this.imagem = imagem;
    }

    async save(){
        const [resultado] = await pool.query(
            'INSERT INTO quizzes (usuario_id, titulo, descricao, categoria, imagem) VALUES (?, ?, ?, ?, ?)',
            [this.usuario_id, this.titulo, this.descricao, this.categoria, this.imagem]
        );

        this.id = resultado.insertId; //ID gerado pelo banco
        return this;
    }

    static async findAll(){
        const [linhas] = await pool.query(`${selectQuiz} GROUP BY q.id ORDER BY q.id DESC`);
        return linhas;
    }

    static async findByUsuario(usuario_id){
        const [linhas] = await pool.query(`${selectQuiz} WHERE q.usuario_id = ? GROUP BY q.id ORDER BY q.id DESC`, [usuario_id]);
        return linhas;
    }

    static async findById(id){
        const [linhas] = await pool.query(`${selectQuiz} WHERE q.id = ? GROUP BY q.id`, [id]);
        return linhas[0]; //undefined se não encontrar
    }

    static async findByTitulo(titulo){
        const [linhas] = await pool.query('SELECT * FROM quizzes WHERE titulo = ?', [titulo]);
        return linhas[0];
    }

    //Caminhos de todos os arquivos (capas e mídias) dos quizzes de um usuário
    static async arquivosDoUsuario(usuario_id){
        const [linhas] = await pool.query(
            `SELECT q.imagem AS caminho FROM quizzes q WHERE q.usuario_id = ?
             UNION ALL
             SELECT p.midia_url FROM perguntas p JOIN quizzes q ON q.id = p.quiz_id WHERE q.usuario_id = ?`,
            [usuario_id, usuario_id]
        );
        return linhas.map(l => l.caminho);
    }

    //Caminhos das mídias das perguntas de um quiz
    static async arquivosDoQuiz(id){
        const [linhas] = await pool.query('SELECT midia_url AS caminho FROM perguntas WHERE quiz_id = ?', [id]);
        return linhas.map(l => l.caminho);
    }

    static async update(id, titulo, descricao, categoria, imagem){
        const [resultado] = await pool.query(
            'UPDATE quizzes SET titulo = ?, descricao = ?, categoria = ?, imagem = ? WHERE id = ?',
            [titulo, descricao, categoria, imagem, id]
        );
        return resultado;
    }

    static async delete(id){
        const [resultado] = await pool.query('DELETE FROM quizzes WHERE id = ?', [id]);
        return resultado;
    }
}

export default Quiz;
