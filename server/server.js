require('./config/config')
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

//MIDDLEWARES
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario.routes'))

mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true
},(err)=>{
    if(err) throw err;
    console.log('Base de datos Online')
});
  
app.listen(process.env.PORT, ()=> console.log('Escuchando puerto: ', process.env.PORT))  