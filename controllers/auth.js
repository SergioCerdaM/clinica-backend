const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { createJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd} = require('../helpers/menu-frontend');

const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const existeUsuario = await Usuario.findOne( { email } );

        if(!existeUsuario) {
            return res.status(404).join({
                ok: false,
                msg: 'Credenciales no válidas...'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, existeUsuario.password );

        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida...'
            })
        }

        // Generar un Token (JWT)
        const token = await createJWT(existeUsuario.id);

        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd( existeUsuario.role)
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error en el acceso, verifique sus credenciales...'
        });
    }
}


const googleSignIn = async (req, res ) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify( googleToken );
        
        

        // Verficiar si existe el usuario en la BD
        const existsUsuario = await Usuario.findOne({ email });
        let usuario;
        
        if(!existsUsuario) {
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: '@@@',
                img: picture,
                role: 'USER_ROLE',
                google: true,
            });
        } else {
            usuario = existsUsuario;
            usuario.google = true;
            usuario.role = existsUsuario.role;
            //usuario.password = '@@@';
            
        }

        // Generar JWT
        await usuario.save();
        const token = await createJWT( usuario.id );


        res.status(200).json({
            ok: true,
            token,
            menu: getMenuFrontEnd( usuario.role)
        })
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: "Token no es el correcto..."
        })        
    }

}

const renewToken = async (req, res) => {
    const uid = req.uid;

    const token = await createJWT( uid );

    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        uid,
        token,
        usuario,
        menu: getMenuFrontEnd( usuario.role)
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}