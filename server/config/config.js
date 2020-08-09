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
// ======================
//  VENCIMIENTO TOKEN
// ======================
// 60 segundos
// 60 monutos
// 24 horas
// 30 dias
process.env.EXP_TOKEN = 60 * 60 * 24 * 30;
// ======================
//  SEED TOKEN
// ======================
process.env.SEED = process.env.SEED_TOKEN || 'jwt-development-test-seed';
//256-bit-seed