const express = require('express');
const mysql = require('mysql2');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path'); // Importe o módulo 'path' do Node.js.

const app = express();
const port = 3001;

app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'phpmyadmin',
  password: 'aluno',
  database: 'mydb'
});

db.connect((err) => {
  if (err) {
    console.error('Erro na conexão com o MySQL:', err);
  } else {
    console.log('Conectado ao MySQL');
  }
});

app.use(bodyParser.urlencoded({ extended: true }));

// Define os caminhos relativos usando __dirname.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Define o diretório de visualizações.
app.use(express.static(path.join(__dirname, 'public'))); // Define a pasta de recursos estáticos.

app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) throw err;
    res.render('cadastro', { users: result });
  });
});

app.post('/cadastro', (req, res) => {
  const { name, email, cpf, senha } = req.body;
  const sql = 'INSERT INTO users (name, email, cpf, senha) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, cpf, senha], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.post('/update/:id', (req, res) => {
  const { name, email, cpf, senha } = req.body;
  const sql = 'UPDATE users SET name = ?, email = ?, cpf = ?, senha = ? WHERE id = ?';
  db.query(sql, [name, email, cpf, senha, req.params.id], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});
