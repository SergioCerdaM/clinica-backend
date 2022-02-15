/*
    Ruta: /api/todo/:busqueda
*/
const { Router }  = require ('express');
const { getTodo, getInfoByTable } = require ('../controllers/busquedas');

const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router();

router.get('/:search', validarJWT, getTodo);
router.get('/collection/:table/:search', validarJWT, getInfoByTable);

module.exports = router;