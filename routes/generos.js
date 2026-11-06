const express = require('express');
const router = express.Router();

const connection = require('../config/database');

router.get('/', (req, res) => {
    connection.query('SELECT * FROM generos', (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }

        res.json(results);
    });
});


router.get('/:id', (req, res) => {
    const id = req.params.id;

    connection.query(
        'SELECT * FROM generos WHERE id = ?',
        [id],
        (error, results) => {
            if (error) {
                return res.status(500).json(error);
            }

            if (results.length === 0) {
                return res.status(404).json({
                    mensaje: 'Género no encontrado'
                });
            }

            res.json(results[0]);
        }
    );
});

router.post('/', (req, res) => {
    const { nombre, descripcion } = req.body;

    connection.query(
        'INSERT INTO generos (nombre, descripcion) VALUES (?, ?)',
        [nombre, descripcion],
        (error, results) => {
            if (error) {
                return res.status(500).json(error);
            }

            res.status(201).json({
                mensaje: 'Género registrado correctamente',
                id: results.insertId
            });
        }
    );
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, descripcion } = req.body;

    connection.query(
        'UPDATE generos SET nombre = ?, descripcion = ? WHERE id = ?',
        [nombre, descripcion, id],
        (error, results) => {
            if (error) {
                return res.status(500).json(error);
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: 'Género no encontrado'
                });
            }

            res.json({
                mensaje: 'Género actualizado correctamente'
            });
        }
    );
});


router.delete('/:id', (req, res) => {
    const id = req.params.id;

    connection.query(
        'DELETE FROM generos WHERE id = ?',
        [id],
        (error, results) => {
            if (error) {
                return res.status(500).json(error);
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: 'Género no encontrado'
                });
            }

            res.json({
                mensaje: 'Género eliminado correctamente'
            });
        }
    );
});

module.exports = router;