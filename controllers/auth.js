import { response } from 'express';
import bcryptjs from 'bcryptjs';

import Usuario from '../models/usuario.js';

import { generarJWT } from '../helpers/generar-jwt.js';
// const { googleVerify } = require('../helpers/google-verify');

const register = async (req, res) => {
    //Evitar registros duplicados
    const { name, email, password } = req.body;

    if(!name) {
        const error = new Error('El Nombre es obligatorio');
        return res.status(400).json({msg: error.message});
    }

    const existeUsuario = await Usuario.findOne({email});
    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }

    try {
        const usuario = new Usuario(req.body);

        //Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        await usuario.save();

        const token = await generarJWT( usuario.id );

        res.json({
            msg: 'Usuario creado correctamente',
            id: usuario._id,
            name: usuario.name,
            email: usuario.email,
            token
        });

    } catch (error) {
        console.log(error);
    }

}

const login = async(req, res = response) => {

    const { password, email } = req.body;

    try {
      
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ email });
        if ( !usuario ) {
            const error = new Error('El email no es correcto');
            return res.status(400).json({msg: error.message});
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            const error = new Error('Los Passwords no son correctos');
            return res.status(400).json({msg: error.message});
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            id: usuario._id,
            name: usuario.name,
            email: usuario.email,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }   

}

const renovarToken = async( req, res = response ) => {

    
    const { usuario } = req;
    // Generar/ Renovar el JWT para prolongar su vida
    const token = await generarJWT( usuario.id );

    res.json({
        id: usuario._id,
        name: usuario.name,
        email: usuario.email,
        token
    });

}


const googleSignin = async(req, res = response) => {

    const { id_token } = req.body;
    
    try {
        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en DB
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        });
        
    } catch (error) {

        res.status(400).json({
            msg: 'Token de Google no es válido'
        })

    }
}


export {
    login,
    register,
    renovarToken
}
