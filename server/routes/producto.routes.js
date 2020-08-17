const express = require('express');
const {verificaToken} = require('../middlewares/autenticacion');
const _ = require('underscore');
let app = express();
let Producto = require('../models/producto');

// Obtener todos los productos
app.get('/productos', verificaToken, (req, res)=>{
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limit = req.query.limite || 10;
    limit = Number(limit);

    Producto.find({disponible:true})
        .skip(desde)
        .limit(limit)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosBD)=>{
            if(err)
                res.status(500).json({
                    ok: false, 
                    error:err
                });
                
            res.json({
                ok:true, 
                productos:productosBD
            });
        });
});

//Obtener producto por ID
app.get('/producto/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productoBD)=>{
        if(err)
            res.status(500).json({
                ok: false, 
                error:err
            });
            
            if(!productoBD)
            res.status(400).json({
                ok: false, 
                err:{
                    message: 'ID no existe'
                }
            });

        res.json({
            ok:true, 
            producto:productoBD
        });
    });
});

//Obtener producto por ID
app.get('/productos/buscar/:termino', verificaToken, (req, res)=>{
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex, disponible:true})
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productosBD)=>{
        if(err)
            res.status(500).json({
                ok: false, 
                error:err
            });
            
            if(!productosBD)
            res.status(400).json({
                ok: false, 
                err:{
                    message: 'ID no existe'
                }
            });

        res.json({
            ok:true, 
            productos:productosBD
        });
    });
});

//Crear nuevo producto
app.post('/producto', verificaToken, (req, res)=>{
    //Usuario
    //categoria

    let body = req.body; 
    let usuarioId = req.usuario._id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: usuarioId
    });

    producto.save((err, productoBD)=>{
        if(err) res.status(500).json({
            ok: false,
            err
        });

        if(!productoBD)
        res.status(400).json({
            ok: false, 
            err:{
                message: 'ID no existe'
            }
        });

        res.json({
            ok: true,
            producto: productoBD
        })
    });
});


//Actualizar producto
app.put('/producto/:id', verificaToken, (req, res)=>{

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']); 

    Producto.findByIdAndUpdate(id, body,{useFindAndModify:false, new:true, runValidators:true},)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoBD)=>{
            if(err)
                res.status(500).json({
                    ok: false, 
                    error:err
                });

            if(!productoBD)
            res.status(400).json({
                ok: false, 
                err:{
                    message: 'ID no existe'
                }
            });

            res.json({
                ok:true, 
                producto:productoBD
            });
        });
});


//Borrar producto
app.delete('/producto/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, {disponible:false}, {useFindAndModify:false, new:true, runValidators:true},)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoBD)=>{
            if(err)
                res.status(500).json({
                    ok: false, 
                    error:err
                });
            if(!productoBD)
            res.status(400).json({
                ok: false, 
                err:{
                    message: 'ID no existe'
                }
            });
            res.json({
                ok:true, 
                producto:productoBD
            });
        });
});

module.exports = app;
