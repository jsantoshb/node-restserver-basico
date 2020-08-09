const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

app.get('/usuario', (req, res) => {
    let desde = req.query.desde || 0;
    let limit = req.query.limite || 5;
    desde = Number(desde);
    limit = Number(limit);

    Usuario.find({estado:true}, 'nombre email estado')
        .skip(desde)
        .limit(limit)
        .exec((err, usuarios)=>{
            if(err) {
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

            Usuario.countDocuments({estado:true}, (err, conteo)=>{
                res.json({
                    ok:true,
                    usuarios,
                    conteo
                });
            })
        });

});
   
app.post('/usuario/', [verificaToken, verificaAdminRole] ,  (req, res)=> {
      let body = req.body;
      let usuario = new Usuario({
         nombre:body.nombre,
         email:body.email,
         password: bcrypt.hashSync(body.password, 5),
         role: body.role
      });
      
      usuario.save((err, usuarioDB)=>{
        if(err) {
            return res.status(400).json({
                ok:false,
                err
            });
        }
        usuarioDB.password = '[PROTECTED]'
        res.json({
            ok:true,
            usuario:usuarioDB
        })
      });
  })
  
   
  app.put('/usuario/:id', [verificaToken, verificaAdminRole] ,  (req, res) => {
      let id = req.params.id;
      let body = _.pick(req.body, ['nombre', 'email', 'role', 'estado']); 
      console.log(id)
      Usuario.findByIdAndUpdate(id, body, {useFindAndModify:false, new:true, runValidators:true}, (err, usuarioDB)=>{
          if(err) {
              return res.status(400).json({
                  ok:false,
                  err
                });
            }
            res.json({ok:true, usuario:usuarioDB})
        })
        
  })
   
   
  app.delete('/usuario/:id', [verificaToken, verificaAdminRole] ,  (req, res) => {
     
    let id = req.params.id;
    console.log(id)
    //Eliminar completamente
    //Usuario.findByIdAndRemove(id, (err, usuarioEliminado)=>{
    //Cambiar estado para evitar eliminar
    Usuario.findByIdAndUpdate(id, {estado:false}, {useFindAndModify:false, new:true}, (err, usuarioEliminado)=>{
        if(err) {
            return res.status(400).json({
                ok:false,
                err
              });
          }
        if(!usuarioEliminado){
            return res.status(400).json({
                ok:false,
                message: 'Usuario no encontrado'
              });
          }
          res.json({ok:true, usuario:usuarioEliminado})
      });
  })

  module.exports  = app;