import { Router } from 'express';
// import { check } from 'express-validator';

import { validarJWT } from '../middlewares/validar-jwt.js';

import { login, register, renovarToken } from '../controllers/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', validarJWT, renovarToken);


export default router;