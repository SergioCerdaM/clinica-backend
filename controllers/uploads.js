const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { updateImage } = require('../helpers/updateImage');

const uploadFile = async (req, res ) => {

    const type = req.params.type;
    const id = req.params.id;
    
    const validTypes = ['usuarios', 'medicos', 'hospitales'];
    if(!validTypes.includes(type)){
        return res.status(400).json({
            ok: false,
            msg: 'El tipo para almacenar la imagen no es válido...'
        })
    }
    
    // Validación de existencia de archivos
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'Ningún archivo fue subido...'
        })
    }

    // Procesar la imagen para subirla
    const file = req.files.imagen;

    const nameCutted = file.name.split('.');
    const fileExtension = nameCutted[ nameCutted.length - 1];

    // Validar extensión
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    if(!validExtensions.includes(fileExtension)){
        return res.status(400).json({
            ok: false,
            msg: 'Extensión de archivo no permitida...'
        })
    }

    // Generar el nombre del archivo
    const fileName = `${ uuidv4() }.${ fileExtension }`;

    // Path para guardar la imagen
    const path = `./uploads/${ type }/${ fileName }`;

    // Mover el archivo
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error el mover el archivo...'
            })
        }
        
        // Actualizar imagen
        updateImage(type, id, fileName );

        res.json( {
            ok: true,
            msg: 'Success, file was uploaded.',
            fileName
        })
    });
}

const downloadFile = async (req, res) => {
    const type = req.params.type;
    const image = req.params.image;

    const pathImage = path.join( __dirname, `../uploads/${ type }/${ image }` );

    // Imagen por defecto
    if(fs.existsSync(pathImage)){
        res.sendFile( pathImage );
    } else {
        res.sendFile(path.join( __dirname, `../uploads/no-image.png`));
    }
}

module.exports = {
    uploadFile,
    downloadFile
}