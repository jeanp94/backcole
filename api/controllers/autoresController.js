const pool = require('../../db');
const bcrypt = require('bcrypt');

const getAllAutores = async (req, res) => {
    try {
        const query = 'SELECT id, nombre, descripcion, estado, fecha_creacion, fecha_actualizacion FROM public.autor WHERE fecha_eliminacion IS NULL';
        const result = await pool.query(query);
        const autores = result.rows;
        return res.status(200).json(autores);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};


const getAutorById = async (req, res) => {
    const autorId = req.params.id; // Suponiendo que el ID esté en los parámetros de la URL
    try {
        const query = 'SELECT id, nombre, descripcion, estado, fecha_creacion, fecha_actualizacion FROM public.autor WHERE id = $1';
        const result = await pool.query(query, [autorId]);
        const autor = result.rows[0];
        if (!autor) {
            return res.status(404).json({ message: 'Autor no encontrado' });
        }
        return res.status(200).json(autor);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const createAutor = async (req, res) => {
    const { nombre, descripcion, estado } = req.body;
    try {
        const query = 'INSERT INTO public.autor (nombre, descripcion, estado) VALUES ($1, $2, $3) RETURNING id';
        const result = await pool.query(query, [nombre, descripcion, estado]);
        const nuevoAutorId = result.rows[0].id;
        return res.status(201).json({ message: 'Autor creado exitosamente', id: nuevoAutorId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const updateAutor = async (req, res) => {
    // const autorId = req.params.id; // Suponiendo que el ID esté en los parámetros de la URL
    const { nombre, descripcion,estado,id } = req.body;
    try {
        const query = 'UPDATE public.autor SET nombre = $1, descripcion = $2, estado = $3, fecha_actualizacion = NOW() WHERE id = $4';
        await pool.query(query, [nombre, descripcion,estado, id]);
        return res.status(200).json({ message: 'Autor actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const deleteAutorById = async (req, res) => {
    const autorId = req.params.id; // Suponiendo que el ID esté en los parámetros de la URL
    try {
        const query = 'UPDATE autor SET fecha_eliminacion= NOW() WHERE id = $1';
        await pool.query(query, [autorId]);
        return res.status(200).json({ message: 'Autor eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const validarAutores = async (req, res) => {
    const { nombre } = req.body; // Suponiendo que el nombre se encuentra en el cuerpo de la solicitud

    try {
        const query = 'SELECT id FROM public.autor WHERE nombre = $1';
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

module.exports = { getAllAutores, getAutorById,createAutor,updateAutor,deleteAutorById,validarAutores};

