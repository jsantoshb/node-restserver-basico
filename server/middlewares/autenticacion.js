
const jwt = require("jsonwebtoken");
/// ====================
/// VERIFICAR TOKEN
/// ====================
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                error:{
                    name:'JWT',
                    message:'debe de proporcionar un token'
                }
            });
        }

        //Asignamos el valor del usuario a la request para que ahora 
        //todas nuestras peticiones tengan el objeto usuario 
        req.usuario = decoded.usuario;
        next();
    });

};

/// ====================
/// VERIFICAR TOKEN
/// ====================

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if(usuario.role != 'ADMIN_ROLE')
    {
        return res.status(401).json({
            ok: false,
            err:{
                message:'El usuario no es administrador'
            }
        });
    }
    req.admin = true;
    next();

}

let verificaTokenUrl = (req, res, next) => {
 let token = req.query.token;

 jwt.verify(token, process.env.SEED, (err, decoded)=>{
    if(err){
        return res.status(401).json({
            ok: false,
            error:{
                name:'JWT',
                message:'token no válido'
            }
        });
    }

    //Asignamos el valor del usuario a la request para que ahora 
    //todas nuestras peticiones tengan el objeto usuario 
    req.usuario = decoded.usuario;
    next();
});

}
module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenUrl
}