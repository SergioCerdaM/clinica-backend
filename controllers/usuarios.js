const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { createJWT } = require('../helpers/jwt');


const getUsuarios = async (req, res) => {

    const from = Number(req.query.from) || 0;
    const page = Number(req.query.page) || 10;

    /*
    const usuarios = await Usuario.find({}, 'nombre email role google')
                            .skip(from)
                            .limit(page);

    const total = await Usuario.count();*/

    const [ usuarios, total ] = await Promise.all([
        Usuario.find({}, 'nombre email role google img')
            .skip(from)
            .limit(page),
        Usuario.countDocuments()
    ])

    res.json({
        ok: true,
        usuarios,
        total
    });
}

const createUsuario = async (req, res) => {

    const { password, email } = req.body;

    try {
        const existsUsuario = await Usuario.findOne( { email });

        if(existsUsuario) {
            return res.status(400).json({
                ok:false,
                msg: 'El email ya está registrado.'
            })
        }
        const usuario = new Usuario( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
    
        await usuario.save();

        // Generar un Token (JWT)
        const token = await createJWT(usuario.id);

    
        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error inesperado..."
        })
    }
}

const deleteUsuario = async (req, res) => {
    const uid = req.params.id;

    try {
        const existsUsuario = Usuario.findById(uid);
        //const deleted = await Usuario.findOneAndDelete( uid );

        if(!existsUsuario){
            res.status(500).json({
                ok: false,
                msg: 'Usario no pudo ser eliminado...'
            })
        }
        
        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario ha sido eliminado...'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            mg: 'Error al eliminar usuario...'
        })        
    }
}

const updateUsuario = async (req, res) => {

    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;       

    try {
        const existeUsuario = await Usuario.findById( uid );

        if(!existeUsuario){
            return res.status(404).json({
                ok: false,
                msg:'Usuario no existe en la base de datos...'
            })
        }

        // Actualizaciones        
        const { password, google, email,  ...campos } = req.body;

        if(existeUsuario.email !== email){            
            const existsEmail = await Usuario.findOne( { email } );
            if(existsEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Email se encuentra en uso...'
                })
            }
        }

        if(!existeUsuario.google) {
            campos.email = email;
        } else if (existeUsuario.email !== email){
            return res.status(400).json({
                ok: false,
                msg: "Google user cannot change his email."
            })
        }

        const userUpdated = await Usuario.findByIdAndUpdate( uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: userUpdated,
            uid
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            mg: 'Error al actualizar usuario...'
        })
        
    }
};

module.exports = {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario
}