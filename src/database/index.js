// db.js

const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'disenio',
    password: '',
});

module.exports = connection;