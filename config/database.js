const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Noviembre2026',
    database: 'api_peliculas'
});

connection.connect((error) => {
    if (error) {
        console.error('Error conectando a MySQL:', error);
        return;
    }

    console.log('Conexión a MySQL exitosa');
});

module.exports = connection;
