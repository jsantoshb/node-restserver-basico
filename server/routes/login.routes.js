const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENTID);
const Usuario = require('../models/usuario');

const app = express();
   
app.post('/login/', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email:body.email}, (err, usuarioDB)=>{
       
        if(err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'_Usuario o contraseña incorrectos'
                }
            })
        }

        if(!bcrypt.compareSync( body.password , usuarioDB.password )){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario o _contraseña incorrectos'
                }
            })
        }

        let token = jwt.sign({
            usuario:usuarioDB
        }, process.env.SEED, {expiresIn: 60 * 60 * 24 * 30})

        res.json({
            ok:true,
            usuario:usuarioDB,
            token
        });
    });

});

//GOOGLE CONFIG
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENTID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    return {
        nombre:payload.name,
        email:payload.email,
        img:payload.picture,
        google:true
    }
}

app.post('/google/', async (req, res) => {
    let token =  req.body.idtoken;
    let googleUser = await verify(token)
                                .catch(err=>{
                                    return res.status(403).json({
                                        ok:false,
                                        err
                                    })
                                });
    Usuario.findOne({email:googleUser.email}, (err, usuarioDB)=>{
        if(err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if( usuarioDB ) {
            if(!usuarioDB.google)
            {
                return res.status(500).json({
                    ok:false,
                    err:{
                        message: 'Debe de usar su autenticación por correo y contraseña'
                    }
                });
            }
            else{
                let token  = jwt.sign({
                    usuario:usuarioDB
                }, process.env.SEED, {expiresIn: 60 * 60 * 24 * 30})

                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token
                })
            }
        }
        else{
            //Si el usuario no existe se crea nuevo usario
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = 'googleUser';

            usuario.save((err, usuarioDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }

                let token  = jwt.sign({
                    usuario:usuarioDB
                }, process.env.SEED, {expiresIn: 60 * 60 * 24 * 30})

                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token
                })
            })
        }

    });
});
   
  module.exports  = app;