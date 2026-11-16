-- Script de criação do banco de dados do QuizMania
-- Como usar: abrir o phpMyAdmin (http://localhost/phpmyadmin), aba "Importar" e escolher este arquivo.

CREATE DATABASE IF NOT EXISTS quizmania_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE quizmania_db;

DROP TABLE IF EXISTS perguntas;
DROP TABLE IF EXISTS quizzes;

-- Tabela de quizzes
CREATE TABLE quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(255) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de perguntas (cada pergunta pertence a um quiz)
-- ON DELETE CASCADE: ao excluir um quiz, as perguntas dele são excluídas junto
CREATE TABLE perguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    enunciado VARCHAR(255) NOT NULL,
    alternativa_a VARCHAR(150) NOT NULL,
    alternativa_b VARCHAR(150) NOT NULL,
    alternativa_c VARCHAR(150) NOT NULL,
    alternativa_d VARCHAR(150) NOT NULL,
    correta CHAR(1) NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Dados de exemplo
INSERT INTO quizzes (id, titulo, descricao, categoria) VALUES
(1, 'Capitais do Brasil', 'Você sabe qual é a capital de cada estado?', 'Conhecimentos gerais'),
(2, 'Sistema Solar', 'Perguntas sobre os planetas e o Sol.', 'Ciências'),
(3, 'Copas do Mundo', 'Teste o que você lembra das Copas.', 'Esportes');

INSERT INTO perguntas (quiz_id, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta) VALUES
(1, 'Qual é a capital do Paraná?', 'Londrina', 'Curitiba', 'Maringá', 'Florianópolis', 'B'),
(1, 'Qual é a capital da Bahia?', 'Salvador', 'Recife', 'Ilhéus', 'Aracaju', 'A'),
(1, 'Qual é a capital do Amazonas?', 'Belém', 'Porto Velho', 'Manaus', 'Rio Branco', 'C'),
(1, 'Qual é a capital de Santa Catarina?', 'Joinville', 'Blumenau', 'Porto Alegre', 'Florianópolis', 'D'),
(2, 'Qual é o maior planeta do Sistema Solar?', 'Saturno', 'Terra', 'Júpiter', 'Netuno', 'C'),
(2, 'Qual planeta é conhecido como planeta vermelho?', 'Marte', 'Vênus', 'Mercúrio', 'Urano', 'A'),
(2, 'Qual é o planeta mais próximo do Sol?', 'Vênus', 'Mercúrio', 'Terra', 'Marte', 'B'),
(2, 'Quantos planetas o Sistema Solar tem?', '7', '9', '10', '8', 'D'),
(3, 'Quantas Copas do Mundo o Brasil já ganhou?', '3', '4', '5', '6', 'C'),
(3, 'Em que país foi a Copa do Mundo de 2014?', 'Brasil', 'África do Sul', 'Alemanha', 'Rússia', 'A'),
(3, 'Qual seleção ganhou a Copa do Mundo de 2022?', 'França', 'Argentina', 'Croácia', 'Brasil', 'B');
