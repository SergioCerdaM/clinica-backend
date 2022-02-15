const fs = require ('fs');
const Usuario = require('../models/Usuario')
const Medico = require('../models/Medico')
const Hospital = require('../models/Hospital')

const deleteImage = (path) => {   

    if(fs.existsSync(path)){
        fs.unlinkSync(path);
    }
}

const updateImage = async (type, id, fileName) => {
    const validTypes = ['usuarios', 'medicos', 'hospitales'];
    let pathViejo = '';

    switch (type) {
        case 'usuarios':
            const usuario = await Usuario.findById(id);

            if(!usuario) {
                console.log('El Id no corresponde a un usuario...');
                return false;
            }

            pathViejo = `./uploads/usuarios/${ usuario.img }`;
            deleteImage( pathViejo );
            
            usuario.img = fileName;
            await usuario.save();
            return true;
        case 'medicos':
            const medico = await Medico.findById(id);

            if(!medico) {
                console.log('El Id no corresponde a un médico...');
                return false;
            }

            pathViejo = `./uploads/medicos/${ medico.img }`;
            deleteImage( pathViejo );
            
            medico.img = fileName;
            await medico.save();
            return true;
            
        case 'hospitales':
            const hospital = await Hospital.findById(id);

            if(!hospital) {
                console.log('El Id no corresponde a un hospital...');
                return false;
            }

            pathViejo = `./uploads/hospitales/${ hospital.img }`;
            deleteImage( pathViejo );
            
            hospital.img = fileName;
            await hospital.save();
            return true;    
        default:
            break;
    }

}

module.exports = {
    updateImage
}