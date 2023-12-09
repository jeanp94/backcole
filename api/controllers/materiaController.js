const pool = require('../../db');
const bcrypt = require('bcrypt');

const getAllMaterias = async (req, res) => {
    try {
        const query = 'SELECT id, nombre, descripcion, estado, fecha_creacion, fecha_actualizacion FROM public.materia WHERE fecha_eliminacion IS NULL';
        const result = await pool.query(query);
        const materias = result.rows;
        return res.status(200).json(materias);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
const validarNombreMateria = async (req, res) => {
    const { nombre } = req.body; // Suponiendo que el nombre se encuentra en el cuerpo de la solicitud

    try {
        const query = 'SELECT id FROM public.materia WHERE nombre = $1';
        const result = await pool.query(query, [nombre]);

        if (result.rows.length > 0) {
            // El nombre de la materia ya existe
            return res.status(400).json({ message: 'Ya existe' });
        } else {
            // El nombre de la materia no existe
            return res.status(200).json({ message: 'No esta registrado' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
const getMateriaById = async (req, res) => {
    const materiaId = req.params.id;
    try {
        const query = 'SELECT id, nombre, descripcion, estado, fecha_creacion, fecha_actualizacion FROM public.materia WHERE id = $1';
        const result = await pool.query(query, [materiaId]);
        const materia = result.rows[0];
        if (!materia) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }
        return res.status(200).json(materia);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const createMateria = async (req, res) => {
    const { nombre, descripcion, estado } = req.body;
    try {
        const query = 'INSERT INTO public.materia (nombre, descripcion, estado) VALUES ($1, $2, $3) RETURNING id';
        const result = await pool.query(query, [nombre, descripcion, estado]);
        const nuevaMateriaId = result.rows[0].id;
        return res.status(201).json({ message: 'Materia creada exitosamente', id: nuevaMateriaId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const updateMateria = async (req, res) => {
    const { nombre, descripcion, estado, id } = req.body;
    try {
        const query = 'UPDATE public.materia SET nombre = $1, descripcion = $2, estado = $3, fecha_actualizacion = NOW() WHERE id = $4';
        await pool.query(query, [nombre, descripcion, estado, id]);
        return res.status(200).json({ message: 'Materia actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const deleteMateriaById = async (req, res) => {
    const materiaId = req.params.id;
    try {
        const query = 'UPDATE materia SET fecha_eliminacion = NOW() WHERE id = $1';
        await pool.query(query, [materiaId]);
        return res.status(200).json({ message: 'Materia eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    getAllMaterias,
    getMateriaById,
    createMateria,
    updateMateria,
    deleteMateriaById,
    validarNombreMateria
};
