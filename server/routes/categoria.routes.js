const express = require('express');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();
let Categoria = require('../models/categoria')

// MOSTRAR TODAS LAS CATEGORIAS
app.get('/categorias', verificaToken, (req, res)=>{
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasBD)=>{
        if(err)
            res.status(500).json({
                ok: false, 
                error:err
            });
            
        res.json({
            ok:true, 
            categorias:categoriasBD
        });
    });
}); 

//MOSTRAR CATEGORIA POR ID
app.get('/categoria/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    if(!id) res.status(400).json({
        ok: false,
        message:'Debe de proporcionar un id'
    });

    Categoria.findById(id,(err, categoriaBD)=>{
        if(err) res.status(400).json({
            ok: false,
            err
        });
        if(!categoriaBD) res.status(400).json({
            ok: false,
            err:{
                message:'El ID no es correcto'
            }
        });

        res.json({
            ok:true,
            categoria:categoriaBD
        });
    });
});

//CREAR NUEVA CATEGORIA
app.post('/categoria', verificaToken, (req, res)=>{
    let descripcion = req.body.descripcion; 
    let usuarioId = req.usuario._id;
    let categoria = new Categoria({
        descripcion,
        usuario: usuarioId
    });

    categoria.save((err, categoriaBD)=>{
        if(err) res.status(500).json({
            ok: false,
            err
        });

        if(!categoriaBD) res.status(400).json({
            ok: false,
            err
        });

        res.json({
            ok: true,
            categoria: categoriaBD
        })
    });

});

//ACTUALIZAR CATEGORIA
app.put('/categoria/:id', verificaToken,  (req, res)=>{
    let id = req.params.id;
    let descripcion = req.body.descripcion;
    Categoria.findByIdAndUpdate(id, {descripcion: descripcion},{useFindAndModify:false, new:true, runValidators:true}, (err, categoriaBD)=>{
        if(err) res.status(500).json({
            ok: false,
            err
        });

        if(!categoriaBD) res.status(400).json({
            ok: false,
            err
        });

        res.json({
            ok:true,
            categoria:categoriaBD
        });
    });
});

//ELIMINAR CATEGORIA
//SOLO ADMINISTRADOR PUEDE BORRAR CATEGORIA
app.delete('/categoria/:id',[verificaToken, verificaAdminRole], (req, res)=>{
    let id = req.params.id;
    if(!id) res.status(400).json({
        ok: false,
        message:'Debe de proporcionar un id'
    });

    Categoria.findByIdAndDelete(id, (err, categoriaBD)=>{
        if(err) res.status(500).json({
            ok: false,
            err
        });

        if(!categoriaBD){
            return res.status(400).json({
                ok:false,
                message: 'Categoria no encontrada'
              });
        }

        res.json({
            ok:true,
            categoria:categoriaBD
        });
    });
});

module.exports = app;