
class Mensaje{
    constructor( id, nombre, mensaje, fecha ) {
        this.id     = id;
        this.nombre  = nombre;
        this.mensaje = mensaje;
        this.fecha = fecha;
    }
}

class ChatMensajes{
    constructor(){
        this.mensajes = [];
        this.usuarios = {};
    }

    get ultimos10() {
        this.mensajes = this.mensajes.splice(0,10);
        return this.mensajes;
    }

    get usuariosArr() {
        return Object.values( this.usuarios );
    }

    enviarMensaje( id, nombre, mensaje, fecha ){
        this.mensajes.unshift(  
            new Mensaje(id, nombre, mensaje, fecha) 
        );
    }

    conectarUsuario( usuario ) {
        this.usuarios[usuario.id] = usuario;
    }

    desconectarUsuario( id ){
        delete this.usuarios[id];
    }


}

export default ChatMensajes;


