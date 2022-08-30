import express from 'express';
import cors from 'cors';
// const fileUpload = require('express-fileupload');
import dbConnection from '../database/config.js';

import authRoute from '../routes/auth.js';


class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
        }


        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        // this.app.use( express.static('public') );
    }

    routes() {
        
        this.app.use( this.paths.auth, authRoute);
        
    }

    listen() {
        return this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}


export default Server;
