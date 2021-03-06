
const express = require('express');
const path = require('path');
const { Socket } = require('socket.io');

const aplicacao = express();
const server = require('http').createServer(aplicacao);
const io = require('socket.io')(server);
const porta = 3000 || process.env.porta;

aplicacao.use(express.static(path.join(__dirname, 'public')));
aplicacao.set('views', path.join(__dirname, 'public'));
aplicacao.engine('html', require('ejs').renderFile);
aplicacao.set('view engine', 'html');

aplicacao.use('/', (req, res) => {
    res.render('index.html');
})

let mensagens = [];
let users = [];

io.on('connection', Socket => {
    console.log(`socket conectado: ${Socket.id}`);

    Socket.emit('mensagensAnteriores', mensagens);

    Socket.on('entrou-na-conversa', (username) =>{
        users[Socket.id] = username;
        Socket.broadcast.emit('usuario-conectado', username);
    });

    Socket.on('disconnet', () => {
        Socket.broadcast.emit('usuario-desconectado', user = users[Socket.id]);
        //users = users.filter<u>(u => u != users[Socket.id]);
        delete users[Socket.id];
    })

    Socket.on('enviarMensagem', dados => {
        //console.log(dados);
        mensagens.push(dados);
        Socket.broadcast.emit('receberMensagem', dados);
    });
});

server.listen(porta, () => console.log(`servidor em execucao na porta: ${porta}`));



