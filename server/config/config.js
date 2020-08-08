// ======================
//  PUERTO
// ======================
process.env.PORT = process.env.PORT || 3000;
// ======================
//  ENTORNO
// ======================
process.env.NODE_ENV = process.env.NODE_ENV  || 'dev'
// ======================
//  DB
// ======================
let urlDB = process.env.NODE_ENV === 'dev' 
    ?  'mongodb://localhost:27017/cafe'
    : 'mongodb+srv://sa:qAP5usAwLirY8MjG@cluster0.juopv.mongodb.net/<cafe>?retryWrites=true&w=majority'
process.env.URLDB = urlDB;