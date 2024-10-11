const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const fs = require('fs');

// Adicione o http e socket.io
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

var handle = exphbs.create({
    defaultLayout: 'main'
});

app.use(session({
    secret: 'chave_secreta',
    resave: false,
    saveUninitialized: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.engine('handlebars', handle.engine);
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, "public")));

app.use(flash());

notificacao = [
    {
        "id": 1,
        "lida": false,
        "content": "Seu servidor bateu o numero maximo de players",
        "horario": '11:46'
    },
    {
        "id": 2,
        "lida": false,
        "content": "Seu servidor bateu o numero maximo de players",
        "horario": '13:46'
    }
]

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.NotiN = notificacao.length;
    next();
});

// Rota de login
app.post('/login', (req, res) => {
    const { user, senha } = req.body;

    if (!user || !senha) {
        req.flash('error_msg', 'Preencha todos os campos!');
        return res.redirect('/login');
    }  
            req.session.user = {
                "nome": "Caynnan Martins",
                "email": "caynnan666@gmail.com",
                "admin": true,
                "avatar": "assets/users/icons/1/a_4583805bb286342317c0ce69d77f1ac8.gif"
            };
            req.flash('success_msg', 'Login realizado com sucesso!');
            return res.redirect('/app');

});

// Rota de logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.redirect('/');
    });
});

// Rota de login (GET)
app.get('/login', (req, res) => {
    res.render('auth/login');
});



// Rota de index
app.get('/', function (req, res) {
    res.render('index', {
        User: req.session.user
    });
});

app.get('/app', function (req, res) {
    User = req.session.user;
    if(!User){
      return res.redirect('/');
    }

    res.render('dashboard/inicio/index', {User: User, isAppActive: true});

});

app.get('/dashboard', function (req, res) {
    User = req.session.user;
    if(!User){
      return res.redirect('/');
    }

    res.render('dashboard/index', {User: User, isDashboardActive: true});

});

app.get('/notificacao', function (req, res) {
    User = req.session.user;
    if(!User){
      return res.redirect('/');
    }

    res.render('dashboard/noti/index', {User: User, Noti: notificacao, isNotificacaoActive: true});

});

app.get('/listuser', function(req,res){
    if(!req.session.user.admin){
        return res.redirect('/');
    };

    res.render('dashboard/admin/list/index', {isListUserActive: true, User: req.session.user})
})

// Inicializando o servidor com Socket.io
server.listen(3000, function () {
    console.log('[+] Servidor rodando na porta 3000');
});