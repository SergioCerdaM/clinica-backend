const Usuario = require('../models/Usuario');
const Medico = require('../models/Medico');
const Hospital = require('../models/Hospital');

const getTodo = async (req, res) => {

    const search = req.params.search;
    
    const regex = new RegExp( search, 'i');

    const [ usuarios, medicos, hospitales ] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Medico.find({ nombre: regex }),
        Hospital.find({ nombre: regex }),
    ]);

    
    res.json({
        ok: true,
        usuarios,
        hospitales,
        medicos
    });
}

const getInfoByTable = async (req, res) => {

    const search = req.params.search;    
    const regex = new RegExp( search, 'i');
    const table = req.params.table;    

    let data = [];

    switch (table) {
        case 'usuario':
            data = await Usuario.find({ nombre: regex });
            break;    
        case 'medico':
            data = await Medico.find({ nombre: regex })
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');
            break;
        case 'hospital':
            data = await Hospital.find({ nombre: regex })
                                .populate('usuario', 'nombre img');
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser de Usuario/Medico/Hospital...'
            })
    }
    
    res.json({
        ok: true,
        data
    });
}

module.exports = {
    getTodo,
    getInfoByTable
}