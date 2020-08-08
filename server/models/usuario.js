const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let roles = {
    values:['ADMIN_ROLE', 'USER_ROLE'],
    message:'{VALUE} No es un ROL valido'
}

let usuarioSchema = new Schema({
    nombre:{
        type:String,
        required:[true, 'El nombre es requerido']
    },
    email:{
        type:String,
        required:[true, 'El correo es requerido'],
        unique:true,
    },
    password:{
        type:String,
        required:[true, 'La contraseña es requerida']
    },
    img:{
        type:String,
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum: roles
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
    }, 
})

usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}
module.exports = mongoose.model('Usuario', usuarioSchema)