
const express = require('express');
const router = express.Router();
const connection = require('../config/database');

// VALIDAR RELACIONES ACTIVAS
function validarRelaciones(genero_id, director_id, productora_id, tipo_id, callback) {
    const sql = `
        SELECT
            (SELECT COUNT(*) FROM generos WHERE id = ? AND estado = 'activo') AS genero,
            (SELECT COUNT(*) FROM directores WHERE id = ? AND estado = 'activo') AS director,
            (SELECT COUNT(*) FROM productoras WHERE id = ? AND estado = 'activo') AS productora,
            (SELECT COUNT(*) FROM tipos WHERE id = ?) AS tipo
    `;

    connection.query(
        sql,
        [genero_id, director_id, productora_id, tipo_id],
        (error, results) => {
            if (error) return callback(error);

            const r = results[0];

            if (!r.genero || !r.director || !r.productora || !r.tipo) {
                return callback(null, false);
            }

            callback(null, true);
        }
    );
}

// CONSULTAR TODAS
router.get('/', (req, res) => {
    const sql = `
        SELECT m.*, g.nombre AS genero, d.nombres AS director,
               p.nombre AS productora, t.nombre AS tipo
        FROM media m
        INNER JOIN generos g ON m.genero_id = g.id
        INNER JOIN directores d ON m.director_id = d.id
        INNER JOIN productoras p ON m.productora_id = p.id
        INNER JOIN tipos t ON m.tipo_id = t.id
    `;

    connection.query(sql, (error, results) => {
        if (error) return res.status(500).json(error);
        res.json(results);
    });
});

// CONSULTAR POR ID
router.get('/:id', (req, res) => {
    const sql = `
        SELECT m.*, g.nombre AS genero, d.nombres AS director,
               p.nombre AS productora, t.nombre AS tipo
        FROM media m
        INNER JOIN generos g ON m.genero_id = g.id
        INNER JOIN directores d ON m.director_id = d.id
        INNER JOIN productoras p ON m.productora_id = p.id
        INNER JOIN tipos t ON m.tipo_id = t.id
        WHERE m.id = ?
    `;

    connection.query(sql, [req.params.id], (error, results) => {
        if (error) return res.status(500).json(error);

        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'Media no encontrada' });
        }

        res.json(results[0]);
    });
});

// REGISTRAR
router.post('/', (req, res) => {
    const datos = req.body;
    const {
        serial, titulo, sinopsis, url, imagen_portada,
        fecha_lanzamiento, anio, genero_id, director_id,
        productora_id, tipo_id
    } = datos;

    validarRelaciones(genero_id, director_id, productora_id, tipo_id, (error, valido) => {
        if (error) return res.status(500).json(error);

        if (!valido) {
            return res.status(400).json({
                mensaje: 'Género, director o productora inactivos o tipo inexistente'
            });
        }

        const sql = `
            INSERT INTO media (
                serial, titulo, sinopsis, url, imagen_portada,
                fecha_lanzamiento, anio, genero_id, director_id,
                productora_id, tipo_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(sql, [
            serial, titulo, sinopsis, url, imagen_portada,
            fecha_lanzamiento, anio, genero_id, director_id,
            productora_id, tipo_id
        ], (error, results) => {
            if (error) return res.status(500).json(error);

            res.status(201).json({
                mensaje: 'Media registrada correctamente',
                id: results.insertId
            });
        });
    });
});

// ACTUALIZAR
router.put('/:id', (req, res) => {
    const datos = req.body;
    const {
        serial, titulo, sinopsis, url, imagen_portada,
        fecha_lanzamiento, anio, genero_id, director_id,
        productora_id, tipo_id
    } = datos;

    validarRelaciones(genero_id, director_id, productora_id, tipo_id, (error, valido) => {
        if (error) return res.status(500).json(error);

        if (!valido) {
            return res.status(400).json({
                mensaje: 'Género, director o productora inactivos o tipo inexistente'
            });
        }

        const sql = `
            UPDATE media SET serial = ?, titulo = ?, sinopsis = ?, url = ?,
                imagen_portada = ?, fecha_lanzamiento = ?, anio = ?,
                genero_id = ?, director_id = ?, productora_id = ?, tipo_id = ?
            WHERE id = ?
        `;

        connection.query(sql, [
            serial, titulo, sinopsis, url, imagen_portada,
            fecha_lanzamiento, anio, genero_id, director_id,
            productora_id, tipo_id, req.params.id
        ], (error, results) => {
            if (error) return res.status(500).json(error);

            if (results.affectedRows === 0) {
                return res.status(404).json({ mensaje: 'Media no encontrada' });
            }

            res.json({ mensaje: 'Media actualizada correctamente' });
        });
    });
});

// ELIMINAR
router.delete('/:id', (req, res) => {
    connection.query(
        'DELETE FROM media WHERE id = ?',
        [req.params.id],
        (error, results) => {
            if (error) return res.status(500).json(error);

            if (results.affectedRows === 0) {
                return res.status(404).json({ mensaje: 'Media no encontrada' });
            }

            res.json({ mensaje: 'Media eliminada correctamente' });
        }
    );
});

module.exports = router;
