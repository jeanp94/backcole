const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors'); // Agrega esta línea
const pool = require('./db');

const app = express();
// Habilita CORS para todas las solicitudes
app.use(cors());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'tu_secreto', resave: true, saveUninitialized: true }));

const routes = require('./api/routes');
app.use('/api', routes);
app.use('/public', express.static('public'));

app.listen(3100, () => {
    console.log('Servidor en ejecución en el puerto 3100');
});
