const Hospital = require('../models/Hospital');
const bcrypt = require('bcryptjs');
const { createJWT } = require('../helpers/jwt');

const getHospitales = async (req, res) => {

    const hospitales = await Hospital.find()
                        .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        hospitales
    });
}

const updateHospital = async (req, res) => {

    try {
        const id = req.params.id;
        const uid = req.uid;

        const existsHospital = await Hospital.findById( id );

        if(!existsHospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado... '
            })
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalUpdated = await Hospital.findByIdAndUpdate( id, cambiosHospital, { new: true });

        res.json({
            ok: true,
            msg: 'updateHospital',
            hospital: hospitalUpdated
        });        
    } catch (error) {
        res.status(500).json({
            ok: true,
            msg: 'Cóntacte al administrador...'
        });
    }
}

const deleteHospital = async (req, res) => {
    
    const id = req.params.id;

    try {        
        const existsHospital = await Hospital.findById(id);

        if(!existsHospital) {
            return res.json({
                ok: false,
                msg: 'Hospital no encontrado...'
            });
        }

        await Hospital.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Hospital eliminado...'
        });
    } catch (error) {
        res.status(404).json({
            ok: false,
            msg: 'Cóntacte al administrador...'
        });        
    }
}

const createHospital = async (req, res) => {
    
    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body});    

    try {        
        const newHospital = await  hospital.save();

        res.json({
            ok: true,
            hospital: newHospital
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Conctacte al administrador...'
        });
    }
}

module.exports = { 
    getHospitales,
    createHospital,
    updateHospital,
    deleteHospital
};