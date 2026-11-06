
const express = require('express');
const router = express.Router();
const connection = require('../config/database');

// CONSULTAR TODOS
router.get('/', (req, res) => {
    connection.query('SELECT * FROM directores', (error, results) => {
        if (error) return res.status(500).json(error);
        res.json(results);
    });
});

// CONSULTAR POR ID
router.get('/:id', (req, res) => {
    connection.query(
        'SELECT * FROM directores WHERE id = ?',
        [req.params.id],
        (error, results) => {
            if (error) return res.status(500).json(error);

            if (results.length === 0) {
                return res.status(404).json({
                    mensaje: 'Director no encontrado'
                });
            }

            res.json(results[0]);
        }
    );
});

// REGISTRAR
router.post('/', (req, res) => {
    const { nombres, estado } = req.body;

    connection.query(
        'INSERT INTO directores (nombres, estado) VALUES (?, ?)',
        [nombres, estado || 'activo'],
        (error, results) => {
            if (error) return res.status(500).json(error);

            res.status(201).json({
                mensaje: 'Director registrado correctamente',
                id: results.insertId
            });
        }
    );
});

// ACTUALIZAR
router.put('/:id', (req, res) => {
    const { nombres, estado } = req.body;

    connection.query(
        'UPDATE directores SET nombres = ?, estado = ? WHERE id = ?',
        [nombres, estado, req.params.id],
        (error, results) => {
            if (error) return res.status(500).json(error);

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: 'Director no encontrado'
                });
            }

            res.json({
                mensaje: 'Director actualizado correctamente'
            });
        }
    );
});

// ELIMINAR
router.delete('/:id', (req, res) => {
    connection.query(
        'DELETE FROM directores WHERE id = ?',
        [req.params.id],
        (error, results) => {
            if (error) return res.status(500).json(error);

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: 'Director no encontrado'
                });
            }

            res.json({
                mensaje: 'Director eliminado correctamente'
            });
        }
    );
});

module.exports = router;
