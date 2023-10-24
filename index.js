const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'phpmyadmin',
  password: 'aluno',
  database: 'mydb',
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    throw err;
  }
  console.log('Conexão com o banco de dados MySQL estabelecida.');
});

app.use(
  session({
    secret: 'sua_chave_secreta',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(query, [username, password], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      req.session.loggedin = true;
      req.session.username = username;
      res.redirect('/dashboard');
    } else {
      res.send('Credenciais incorretas. <a href="/">Tente novamente</a>');
    }
  });
});

app.get('/dashboard', (req, res) => {
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.send('Faça login para acessar esta página. <a href="/">Login</a>');
  }
});

// Adicione esta rota para o redirecionamento para a página de cadastro.
app.get('/cadastro', (req, res) => {
  res.render('cadastro.ejs');
});

app.post('/cadastro', (req, res) => {
  const { username, password, cpf, email } = req.body;

  const query = 'INSERT INTO users (username, password, cpf, email) VALUES (?, ?, ?, ?)';

  db.query(query, [username, password, cpf, email], (err, results) => {
    if (err) throw err;

    // Redirecione para a página de login após o cadastro bem-sucedido.
    res.redirect('/');
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
