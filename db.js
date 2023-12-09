require('dotenv').config(); // Carga las variables de entorno desde .env
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

module.exports = pool;