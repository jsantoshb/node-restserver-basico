const express = require('express');
const fileUpload = require('express-fileupload');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload({useTempFiles : true}));

app.put('/upload/:tipo/:id', (req, res)=>{

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ok: false,
            err:{
                mressage:'No se ha seleccionado ningun archivo.'
            }
        });
    }

    let tipos = ['productos', 'usuarios'];
    if(!_.contains(tipos, tipo)){
        return res.status(400).json({ok: false,
            err:{
                mressage:'Los tipos permitidos son: ' + tipos.join(', '),
                tipo
            }
        }); 
    }


    let imagen = req.files.imagen;
    //Extenciones permitidas
    let extensiones = ['png', 'jpg', 'jpeg'];
    let nombreArchivo = imagen.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length -1];

    if(!_.contains(extensiones, extension))
    {
        return res.status(400).json({ok: false,
            err:{
                mressage:'Las extensiones permitidas son: ' + extensiones.join(', '),
                ext:extension
            }
        }); 
    }

    //Renombrar archivo
    let nombreSeguro = `${id}-${new Date().getMilliseconds()}.${extension}`

    // Use the mv() method to place the file somewhere on your server
    imagen.mv(`uploads/${tipo}/${nombreSeguro}`, function(err) {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
         
        switch(tipo){
            case 'usuarios':
                imagenUsuario(id, res, nombreSeguro);
                break;
            case 'productos':
                imagenProducto(id, res, nombreSeguro);
                break;
        }
    });
});

const imagenUsuario = (id, res, nombre)=>{

    Usuario.findById(id, (err, usuarioDB)=>{
        if(err){
            borrarArchivo(nombre, 'usuarios');
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDB) {
            borrarArchivo(nombre, 'usuarios');
            return res.status(500).json({
                ok:false,
                err:{
                    message:'El usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombre;
        usuarioDB.save((err, usuarioGuardado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            res.json({ok:true,
            usuario:usuarioGuardado,
            img:nombre
            })
        })
    });

} 

const imagenProducto = (id, res, nombre)=>{
    Producto.findById(id, (err, productoDB)=>{
        if(err){
            borrarArchivo(nombre, 'productos');
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!productoDB) {
            borrarArchivo(nombre, 'productos');
            return res.status(500).json({
                ok:false,
                err:{
                    message:'El producto no existe'
                }
            });
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombre;
        productoDB.save((err, productoGuardado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            res.json({ok:true,
            producto:productoGuardado,
            img:nombre
            })
        })
    })
}

const borrarArchivo = (nombreImagen, tipo) =>{
    //se verifica si la imagen del usuario existe aun en el servidor para eliminarla
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app;