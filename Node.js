const express = require('express');
const mysql = require('mysql2');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3001;

// ... Configurações do banco de dados e outras configurações ...

// Defina a pasta de visualizações.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use as pastas de recursos estáticos.
app.use(express.static(path.join(__dirname, 'public')));

// Use o middleware de sessão.
app.use(
  session({
    secret: 'sua_chave_secreta',
    resave: true,
    saveUninitialized: true,
  })
);

// Rotas para a página de login e processamento do formulário de login.
app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.post('/login', (req, res) => {
  // Lógica de autenticação aqui...
});

// Rota para a página de cadastro
app.get('/cadastro', (req, res) => {
    res.render('cadastro.ejs');
  });

// Outras rotas e funcionalidades do aplicativo.

app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
