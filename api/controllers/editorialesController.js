const pool = require('../../db');
const bcrypt = require('bcrypt');

const getAllEditoriales = async (req, res) => {
    try {
        const query = 'SELECT id, nombre, descripcion, estado, fecha_creacion, fecha_actualizacion FROM public.editorial WHERE fecha_eliminacion IS NULL';
        const result = await pool.query(query);
        const editoriales = result.rows;
        return res.status(200).json(editoriales);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const getEditorialById = async (req, res) => {
    const editorialId = req.params.id;
    try {
        const query = 'SELECT id, nombre, descripcion, estado, fecha_creacion, fecha_actualizacion FROM public.editorial WHERE id = $1';
        const result = await pool.query(query, [editorialId]);
        const editorial = result.rows[0];
        if (!editorial) {
            return res.status(404).json({ message: 'Editorial no encontrada' });
        }
        return res.status(200).json(editorial);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const createEditorial = async (req, res) => {
    const { nombre, descripcion, estado } = req.body;
    try {
        const query = 'INSERT INTO public.editorial (nombre, descripcion, estado) VALUES ($1, $2, $3) RETURNING id';
        const result = await pool.query(query, [nombre, descripcion, estado]);
        const nuevaEditorialId = result.rows[0].id;
        return res.status(201).json({ message: 'Editorial creada exitosamente', id: nuevaEditorialId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const updateEditorial = async (req, res) => {
    const { nombre, descripcion, estado, id } = req.body;
    try {
        const query = 'UPDATE public.editorial SET nombre = $1, descripcion = $2, estado = $3, fecha_actualizacion = NOW() WHERE id = $4';
        await pool.query(query, [nombre, descripcion, estado, id]);
        return res.status(200).json({ message: 'Editorial actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const deleteEditorialById = async (req, res) => {
    const editorialId = req.params.id;
    try {
        const query = 'UPDATE editorial SET fecha_eliminacion = NOW() WHERE id = $1';
        await pool.query(query, [editorialId]);
        return res.status(200).json({ message: 'Editorial eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};


const validarEditoriales = async (req, res) => {
    const { nombre } = req.body; // Suponiendo que el nombre se encuentra en el cuerpo de la solicitud

    try {
        const query = 'SELECT id FROM public.editorial WHERE nombre = $1';
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


module.exports = {
    getAllEditoriales,
    getEditorialById,
    createEditorial,
    updateEditorial,
    deleteEditorialById,
    validarEditoriales
};
