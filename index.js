//Creamos un puerto para las mandangas

const http = require('node:http');
const socketIO = require('socket.io');
const app = require('./app')
const ChatMessage = require('./models/chatmsg.model')

//Config.env
require('dotenv').config();

//Config BD
require('./config/db');

const server = http.createServer(app)



const PORT = process.env.PORT || 3000;
server.listen(PORT)



//Configuracion socket.io
const io = socketIO(server, {
    cors: { origin: '*' }
})

io.on('connection', async (socket) => {
    console.log('Nueva conxion');
    socket.broadcast.emit('chatmsg_server', {
        name: 'Chatboard',
        message: 'Se ha conectado un nuevo usuario'
    });
    //Emitimos el numero de clientes conectados
    io.emit('clients_count', io.engine.clientsCount);

    socket.on('chatmsg', (data) => {
        ChatMessage.create(data);
        io.emit('chatmsg_server', data);
    })
    //Recupero los 5 ultimos mensahes
    const Fivemsg = await ChatMessage.find().sort('-createdAt').limit(1);
    //Emito el evento chat_init
    socket.emit('chat_init', {
        socket_id: socket.id,
        arr5msg: Fivemsg
    })

    //Me suscribo para detectar lass desconexiones
    socket.on('disconnect', () => {
        socket.broadcast.emit('chatmsg_Server', {
            name: 'Chatboard',
            message: 'Se ha desconectado un nuevo usuario'
        });
        io.emit('clients_count', io.engine.clientsCount);
    })
});
