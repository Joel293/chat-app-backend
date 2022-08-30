import dotenv from 'dotenv';
import Server from './models/server.js';
dotenv.config();

const server = new Server();
const listener = server.listen();


//SOCKET IO
import { Server as socketServer } from 'socket.io'
import { comprobarJWT } from './helpers/generar-jwt.js';
import ChatMensajes from './models/chat-mensajes.js';

const chatMensajes = new ChatMensajes();

const io = new socketServer(listener,{
    pingTimeout: 60000,
    //direcciones permitidas
    cors: {
        origin: process.env.FRONTEND_URL
    }
});

//socketController
io.on('connection', async(socket) => {
    //Cada vez que el cliente se conecte
    
    const token = socket.handshake.headers['xtoken'];
    const usuario = await comprobarJWT(token);

    const ip = socket.handshake.headers.origin;
    console.log(`client's IP address: ${ip}`);

    if(!usuario) {
        return socket.disconnect();
    }

    console.log('Se conectó', usuario.name);

    //Agregar al usuario conectado
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios activos', chatMensajes.usuariosArr); //io enviar a todos inclusive el que lo emite
    socket.emit('recibir mensajes', chatMensajes.ultimos10);

    //Conectarlo a una sala especial 
    // socket.join(usuario.id);

    //Limpiar cuando alguien se desconecta
    socket.on('disconnect',() => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios activos', chatMensajes.usuariosArr);
    });

    //Recibir el mensaje y a quién se lo quiero enviar
    socket.on('enviar mensaje', ({ message, id }) => {
        // console.log(message);
        if( id ) {
            //Si el id existe es un mensaje privado
            socket.to( id ).emit('mensaje privado', { id: usuario.id, nombre: usuario.name, mensaje: message.text, fecha: message.sent })

        } else {
            // console.log(usuario.id, usuario.name, message.text, message.sent);
            //Es un mensaje para todo el mundo
            chatMensajes.enviarMensaje(usuario.id, usuario.name, message.text, message.sent);
            io.emit('recibir mensajes', chatMensajes.ultimos10);
        }

    });

    
    // socket.emit('enviar mensaje', {text: 'Enviado desde server'});
});





