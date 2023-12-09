const pool = require('../../db');

// Crear una relación usuario-libro
const createUserBookRelation = async (req, res) => {
    try {
        const { id_usuario, id_libro, favorito, comentario, calificacion } = req.body;

        const query = `
            INSERT INTO usuarios_libros (id_usuario, id_libro, favorito, comentario, calificacion, fecha_creacion, fecha_actualizacion) 
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            RETURNING *;
        `;

        const values = [id_usuario, id_libro, favorito, comentario, calificacion];
        const result = await pool.query(query, values);

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener todas las relaciones usuario-libro
const getAllUserBookRelations = async (req, res) => {
    try {
        const query = `
            SELECT id_usuario, id_libro, favorito, comentario, calificacion, fecha_creacion, fecha_actualizacion, fecha_eliminacion
            FROM public.usuarios_libros where fecha_eliminacion is null;
        `;
        const result = await pool.query(query);
        const relations = result.rows;
        return res.status(200).json(relations);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar una relación usuario-libro
const updateUserBookRelation = async (req, res) => {
    try {
        const { id_usuario, id_libro } = req.params;
        const { favorito, comentario, calificacion } = req.body;

        const query = `
            UPDATE usuarios_libros
            SET favorito = $1, comentario = $2, calificacion = $3
            WHERE id_usuario = $4 AND id_libro = $5
            RETURNING *;
        `;

        const values = [favorito, comentario, calificacion, id_usuario, id_libro];
        const result = await pool.query(query, values);

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar una relación usuario-libro
const deleteUserBookRelation = async (req, res) => {
    try {
        const { id_usuario, id_libro } = req.params;

        const query = `
            UPDATE usuarios_libros
            SET fecha_eliminacion = NOW() -- O la función que utilices para obtener la fecha actual
            WHERE id_usuario = $1 AND id_libro = $2
            RETURNING *;
        `;

        const result = await pool.query(query, [id_usuario, id_libro]);

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
const getUserBookRelationsByUserId = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
        SELECT u.id,u.id_usuario,u.id_libro,u.favorito,u.comentario,u.calificacion,u.fecha_creacion,u.fecha_actualizacion,u.fecha_eliminacion,l.titulo
        FROM public.usuarios_libros u inner join libros l on u.id_libro=l.id 
            WHERE u.id_usuario = $1 and u.fecha_eliminacion is null;
        `;

        const result = await pool.query(query, [id]);
        const relations = result.rows;
        return res.status(200).json(relations);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    createUserBookRelation,
    getAllUserBookRelations,
    updateUserBookRelation,
    deleteUserBookRelation,
    getUserBookRelationsByUserId

};
