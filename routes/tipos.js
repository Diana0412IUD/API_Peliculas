
const express = require('express');
const router = express.Router();

const connection = require('../config/database');

// CONSULTAR TODOS
router.get('/', (req, res) => {
    connection.query('SELECT * FROM tipos', (error, results) => {
        if (error) return res.status(500).json(error);
        res.json(results);
    });
});

// CONSULTAR POR ID
router.get('/:id', (req, res) => {
    connection.query(
        'SELECT * FROM tipos WHERE id = ?',
        [req.params.id],
        (error, results) => {
            if (error) return res.status(500).json(error);

            if (results.length === 0) {
                return res.status(404).json({
                    mensaje: 'Tipo no encontrado'
                });
            }

            res.json(results[0]);
        }
    );
});

// REGISTRAR
router.post('/', (req, res) => {
    const { nombre, descripcion } = req.body;

    connection.query(
        'INSERT INTO tipos (nombre, descripcion) VALUES (?, ?)',
        [nombre, descripcion],
        (error, results) => {
            if (error) return res.status(500).json(error);

            res.status(201).json({
                mensaje: 'Tipo registrado correctamente',
                id: results.insertId
            });
        }
    );
});

// ACTUALIZAR
router.put('/:id', (req, res) => {
    const { nombre, descripcion } = req.body;

    connection.query(
        'UPDATE tipos SET nombre = ?, descripcion = ? WHERE id = ?',
        [nombre, descripcion, req.params.id],
        (error, results) => {
            if (error) return res.status(500).json(error);

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: 'Tipo no encontrado'
                });
            }

            res.json({
                mensaje: 'Tipo actualizado correctamente'
            });
        }
    );
});

// ELIMINAR
router.delete('/:id', (req, res) => {
    connection.query(
        'DELETE FROM tipos WHERE id = ?',
        [req.params.id],
        (error, results) => {
            if (error) return res.status(500).json(error);

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: 'Tipo no encontrado'
                });
            }

            res.json({
                mensaje: 'Tipo eliminado correctamente'
            });
        }
    );
});

module.exports = router;
