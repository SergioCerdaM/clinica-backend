const Medico = require('../models/Medico');

const getMedicos = async (req, res) => {

    const medicos = await Medico.find()
                        .populate('usuario', 'nombre img')
                        .populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos
    });
}

const updateMedico = async (req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        const existsMedico = await Medico.findById(id);

        if(!existsMedico) {
            res.json({
                ok: true,
                msg: 'Médico no encontrado...'
            });        
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoUpdated = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            msg: 'Médico actualizado...',
            medico: medicoUpdated,
        });        
    } catch (error) {
        res.json({
            ok: true,
            msg: 'Error, cóntacte al administrador...'
        });        
    }
}

const deleteMedico = async (req, res) => {

    const id = req.params.id;

    try {
        const existsMedico = await Medico.findById(id);

        if(!existsMedico) {
            return res.json({
                ok: false,
                msg: 'Médico no encontrado...'
            });            
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Médico eliminado...'
        });        
    } catch (error) {
        res.json({
            ok: false,
            msg: 'Error, cóntacte al administrador...'
        });        
    }
}

const createMedico = async (req, res) => {

    const uid = req.uid;    
    const medico = new Medico({
        usuario: uid,        
        ...req.body});
    
    try {        
        const newMedico = await medico.save();

        res.json({
            ok: true,
            medico: newMedico,
        });
    } catch (error) {
        console.log(error);

        res.status(501).json({
            ok: false,
            msg: "Error al crear el registro del médico..."
        });
    }
}

const getMedicoById = async( req, res ) => {
    const id = req.params.id;

    try {        
        const medico = await Medico.findById(id)
                            .populate('usuario', 'nombre, img')
                            .populate('hospital', 'nombre img');
    
        res.json( {
            ok: true,
            medico
        })
    } catch (error) {
        console.log(error);
        res.json( {
            ok: false,
            msg: 'Contact to manager.'
        })
    }
}

module.exports = { 
    getMedicos,
    createMedico,
    updateMedico,
    deleteMedico,
    getMedicoById
};