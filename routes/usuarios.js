/*
    Ruta: /api/usuarios
*/
const { Router }  = require ('express');
const { getUsuarios, createUsuario, updateUsuario, deleteUsuario } = require ('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT, validarAdminRole, validarAdminRoleSameUser } = require('../middlewares/validar-jwt')

const router = Router();

router.get('/', validarJWT, getUsuarios);

router.post('/',
    [        
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],
    createUsuario);

router.put('/:id',
    [
        validarJWT,
        validarAdminRoleSameUser,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('role', 'El role es obligatorio').not().isEmpty(),
        validarCampos,
    ],
updateUsuario);

router.delete('/:id', 
    [ validarJWT,
    validarAdminRole ], deleteUsuario);

module.exports = router;