const jwt = require('jsonwebtoken');
const User = require('../models/Usuario');


const validarJWT = (req, res, next) => {

    const token = req.header('x-token');
    
    if(!token){
        return res.status(401).json({
                ok: false,
                msg: 'No existe token...'
            }
        )
    }

    try {
        const { uid } =  jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.uid = uid;

        next();
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido...'
        })
    }
}

const validarAdminRole = async (req, res, next) => {
    const uid = req.uid;

    try {
        const usuarioDB = await User.findById(uid);

        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario not found',
            })
        }

        if(usuarioDB.role !== 'ADMIN_ROLE'){
            return res.status(403).json({
                ok: false,
                msg: 'User dont is a Administrator',
            })
        }

        next();

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Contact to Administrator'
        })
    }
}

const validarAdminRoleSameUser = async (req, res, next) => {
    const uid = req.uid;
    const id = req.params.id;

    try {

        const usuarioDB = await User.findById(uid);


        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario not found',
            })
        }
                
        if(usuarioDB.role === 'ADMIN_ROLE' || uid === id){
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: `Usuario no es administrador`,
                
            })
        }

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Contact to Administrator'
        })
    }
}


module.exports = {
    validarJWT,
    validarAdminRole,
    validarAdminRoleSameUser
}
