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
    : process.env.MONGO_DBURL
process.env.URLDB = urlDB;