import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.js';

const generarJWT = ( id = '' ) => {

    return new Promise( (resolve, reject) => {

        const payload = { id };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, ( err, token ) => {

            if ( err ) {
                console.log(err);
                reject( 'No se pudo generar el token' )
            } else {
                resolve( token );
            }
        })

    })
}

const comprobarJWT = async( token = '' ) => {

    try {
        
        if ( token.length < 10 ){
            return null;
        }

        const { id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById( id );

        if( usuario ){
            return usuario;
        } else {
            return null;
        }


    } catch (error) {
        return null;
    }

}


export {
    generarJWT,
    comprobarJWT
}

