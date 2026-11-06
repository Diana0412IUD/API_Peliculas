const express = require('express');
const connection = require('./config/database');
const generosRoutes = require('./routes/generos');
const directoresRoutes = require('./routes/directores');
const productorasRoutes = require('./routes/productoras');
const tiposRoutes = require('./routes/tipos');
const mediaRoutes = require('./routes/media');
const app = express();

app.use(express.json());
app.use('/api/generos', generosRoutes);
app.use('/api/directores', directoresRoutes);
app.use('/api/productoras', productorasRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/tipos', tiposRoutes);
app.get('/prueba', (req, res) => {
    res.send('Prueba funcionando');
});
console.log('Ruta de géneros cargada');

app.get('/', (req, res) => {
    res.send('API de películas funcionando');
});

app.listen(3000, () => {
    console.log('Servidor funcionando en http://localhost:3000');
});