
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/generos', require('./routes/generos'));
app.use('/api/directores', require('./routes/directores'));
app.use('/api/productoras', require('./routes/productoras'));
app.use('/api/tipos', require('./routes/tipos'));
app.use('/api/media', require('./routes/media'));

app.get('/', (req, res) => {
    res.json({ mensaje: 'API de películas funcionando correctamente' });
});

app.listen(3000, () => {
    console.log('Servidor funcionando en http://localhost:3000');
    console.log('Conexión a MySQL exitosa');
});
