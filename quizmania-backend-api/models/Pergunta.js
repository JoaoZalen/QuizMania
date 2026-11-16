import { pool } from '../config/db.js';

class Pergunta{

    constructor(quiz_id, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta, midia_tipo, midia_url){
        this.quiz_id = quiz_id;
        this.enunciado = enunciado;
        this.alternativa_a = alternativa_a;
        this.alternativa_b = alternativa_b;
        this.alternativa_c = alternativa_c;
        this.alternativa_d = alternativa_d;
        this.correta = correta; //Letra da alternativa certa: A, B, C ou D
        this.midia_tipo = midia_tipo; //'imagem', 'video' ou null (sem mídia)
        this.midia_url = midia_url;
    }

    async save(){
        const [resultado] = await pool.query(
            `INSERT INTO perguntas
             (quiz_id, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta, midia_tipo, midia_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [this.quiz_id, this.enunciado, this.alternativa_a, this.alternativa_b,
             this.alternativa_c, this.alternativa_d, this.correta, this.midia_tipo, this.midia_url]
        );

        this.id = resultado.insertId; //ID gerado pelo banco
        return this;
    }

    static async findByQuiz(quiz_id){
        const [linhas] = await pool.query('SELECT * FROM perguntas WHERE quiz_id = ? ORDER BY id', [quiz_id]);
        return linhas;
    }

    static async findById(id){
        const [linhas] = await pool.query('SELECT * FROM perguntas WHERE id = ?', [id]);
        return linhas[0]; //undefined se não encontrar
    }

    static async update(id, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta, midia_tipo, midia_url){
        const [resultado] = await pool.query(
            `UPDATE perguntas
             SET enunciado = ?, alternativa_a = ?, alternativa_b = ?, alternativa_c = ?, alternativa_d = ?, correta = ?,
                 midia_tipo = ?, midia_url = ?
             WHERE id = ?`,
            [enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta, midia_tipo, midia_url, id]
        );
        return resultado;
    }

    static async delete(id){
        const [resultado] = await pool.query('DELETE FROM perguntas WHERE id = ?', [id]);
        return resultado;
    }
}

export default Pergunta;
