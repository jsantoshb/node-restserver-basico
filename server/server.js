require('./config/config')
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path')
// MIDDLEWARES
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Parse application/json
app.use(bodyParser.json())
// Routes
app.use(require('./routes/index.routes'));
app.use(express.static(path.resolve(__dirname, '../public')));

mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true
},(err)=>{
    if(err) throw err;
    console.log('Base de datos Online')
});
  
app.listen(process.env.PORT, ()=> console.log('Escuchando puerto: ', process.env.PORT))  