
const express = require('express');
const router = express.Router();
const connection = require('../config/database');

// CONSULTAR TODAS
router.get('/', (req, res) => {
    connection.query('SELECT * FROM productoras', (error, results) => {
        if (error) return res.status(500).json(error);
        res.json(results);
    });
});

// CONSULTAR POR ID
router.get('/:id', (req, res) => {
    connection.query(
        'SELECT * FROM productoras WHERE id = ?',
        [req.params.id],
        (error, results) => {
            if (error) return res.status(500).json(error);

            if (results.length === 0) {
                return res.status(404).json({
                    mensaje: 'Productora no encontrada'
                });
            }

            res.json(results[0]);
        }
    );
});

// REGISTRAR
router.post('/', (req, res) => {
    const { nombre, slogan, descripcion, estado } = req.body;

    connection.query(
        'INSERT INTO productoras (nombre, slogan, descripcion, estado) VALUES (?, ?, ?, ?)',
        [nombre, slogan, descripcion, estado || 'activo'],
        (error, results) => {
            if (error) return res.status(500).json(error);

            res.status(201).json({
                mensaje: 'Productora registrada correctamente',
                id: results.insertId
            });
        }
    );
});

// ACTUALIZAR
router.put('/:id', (req, res) => {
    const { nombre, slogan, descripcion, estado } = req.body;

    connection.query(
        'UPDATE productoras SET nombre = ?, slogan = ?, descripcion = ?, estado = ? WHERE id = ?',
        [nombre, slogan, descripcion, estado, req.params.id],
        (error, results) => {
            if (error) return res.status(500).json(error);

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: 'Productora no encontrada'
                });
            }

            res.json({
                mensaje: 'Productora actualizada correctamente'
            });
        }
    );
});

// ELIMINAR
router.delete('/:id', (req, res) => {
    connection.query(
        'DELETE FROM productoras WHERE id = ?',
        [req.params.id],
        (error, results) => {
            if (error) return res.status(500).json(error);

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: 'Productora no encontrada'
                });
            }

            res.json({
                mensaje: 'Productora eliminada correctamente'
            });
        }
    );
});

module.exports = router;
