import { response, request } from 'express';
import jwt from 'jsonwebtoken';

import Usuario from '../models/usuario.js';

const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header('xtoken');

    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { id } = await jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( id );

        if( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe DB'
            })
        }
        req.usuario = usuario;
        next();

    } catch (error) {
        res.status(401).json({
            msg: 'Token no válido'
        });
    }

}

export {
    validarJWT
}