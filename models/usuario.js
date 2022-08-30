import pkg from 'mongoose';
const { Schema, model } = pkg;

const UsuarioSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        trim: true,
    },
    img: {
        type: String,
    },

}, {
    timestamps: true
});



UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario  } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model( 'Usuario', UsuarioSchema );
