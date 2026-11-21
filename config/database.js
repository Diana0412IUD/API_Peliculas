
require('dotenv').config();

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.MYSQLHOST || 'localhost',
    port: process.env.MYSQLPORT || 3306,
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || 'Noviembre2026',
    database: process.env.MYSQLDATABASE || 'api_peliculas'
});

connection.connect((error) => {
    if (error) {
        console.error('Error conectando a MySQL:', error.message);
        return;
    }

    console.log('Conexión a MySQL exitosa');
});

module.exports = connection;
