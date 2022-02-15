/*
    Ruta: api/uploads/
*/
const { Router } = require ('express');
const { uploadFile, downloadFile } = require ('../controllers/uploads');
const { validarJWT } = require('../middlewares/validar-jwt');

const expressFileUpload = require('express-fileupload');

const router = Router();

router.use(expressFileUpload());

router.put('/:type/:id', validarJWT, uploadFile);

router.get('/:type/:image', downloadFile);


module.exports = router;