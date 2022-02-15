const jwt = require('jsonwebtoken');

const createJWT = ( uid ) => {

    return new Promise((resolve, reject ) => {

        const payload = {
            uid
        }
    
        jwt.sign( payload, process.env.JWT_SECRET_KEY, {
            expiresIn: '12h'
        }, (err, token) => {
            if(err) {
                console.log(err);
                reject('No se pudo crear el JWT');
            } else {
                resolve(token);
            }
        });
    })
}

module.exports = {
    createJWT
}