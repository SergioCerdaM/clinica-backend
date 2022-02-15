/*
    Ruta: /api/medicos/
*/
const { Router }  = require ('express');
const { getMedicos, createMedico, updateMedico, deleteMedico, getMedicoById } = require ('../controllers/medicos');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router();

router.get('/', validarJWT, getMedicos);

router.post('/',
    [ 
        validarJWT,
        check('nombre', 'El nombre del médico es requerido').not().isEmpty(),
        check('hospital', 'El Id del hopistal debe ser válido').isMongoId(),
        validarCampos,
    ],
    createMedico);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre del médico es requerido').not().isEmpty(),
        validarCampos,
    ],
    updateMedico);

router.delete('/:id', validarJWT, deleteMedico);

router.get('/:id', validarJWT, getMedicoById);

module.exports = router;