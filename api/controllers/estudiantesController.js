const pool = require('../../db');

const getAllEstudiantes = async (req, res) => {
    try {
        const query =  `
        SELECT
        e.id,
        e.codigo,
        e.dni,
        e.nombres,
        e.nivel_educativo,
        e.grado,
        e.direccion,
        e.telefono,
        e.condicion,
        u.correo AS usuario_correo,
        u.contraseña AS usuario_contraseña,
        u.rol AS usuario_rol
    FROM
        estudiantes e
    INNER JOIN
        usuarios u ON e.usuario_id = u.id
    WHERE
        e.fecha_eliminacion IS NULL
        AND u.rol = 'estudiante';
    `;
        const result = await pool.query(query);
        const estudiantes = result.rows;
        return res.status(200).json(estudiantes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const getEstudianteById = async (req, res) => {
    const estudianteId = req.params.id;
    try {
        const query = `
        SELECT
            e.id,
            e.codigo,
            e.dni,
            e.nombres,
            e.nivel_educativo,
            e.grado,
            e.direccion,
            e.telefono,
            e.condicion,
            u.correo AS usuario_correo,
            u.contraseña AS usuario_contraseña,
            u.rol AS usuario_rol
        FROM
            estudiantes e
        INNER JOIN
            usuarios u ON e.usuario_id = u.id
        WHERE
            e.id = $1;
    `;

        const result = await pool.query(query, [estudianteId]);
        const estudiante = result.rows[0];
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
        return res.status(200).json(estudiante);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const createEstudiante = async (req, res) => {
    const { codigo, dni, nombres, nivel_educativo, grado, direccion, telefono, email, condicion } = req.body;
    try {
        const query = 'INSERT INTO estudiantes (codigo, dni, nombres, nivel_educativo, grado, direccion, telefono, condicion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id';
        const result = await pool.query(query, [codigo, dni, nombres, nivel_educativo, grado, direccion, telefono, email, condicion]);
        const nuevoEstudianteId = result.rows[0].id;
        return res.status(201).json({ message: 'Estudiante creado exitosamente', id: nuevoEstudianteId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
const updateEstudiante = async (req, res) => {
    const { id, codigo, dni, nombres, nivel_educativo, grado, direccion, telefono, condicion, correo, contraseña } = req.body;

    try {
        const hashedPassword = contraseña; 
        const currentTimestamp = new Date(); // Get the current timestamp
        const query = 'UPDATE estudiantes SET codigo = $1, dni = $2, nombres = $3, nivel_educativo = $4, grado = $5, direccion = $6, telefono = $7, condicion = $8, fecha_actualizacion = $9 WHERE id = $10';
        await pool.query(query, [codigo, dni, nombres, nivel_educativo, grado, direccion, telefono, condicion, currentTimestamp, id]);

        // Actualiza la información de usuario (correo y contraseña) si es necesario
        const updateUserQuery = 'UPDATE usuarios SET correo = $1, contraseña = $2, fecha_actualizacion = $3 WHERE id = (SELECT usuario_id FROM estudiantes WHERE id = $4)';
        await pool.query(updateUserQuery, [correo, hashedPassword, currentTimestamp, id]);

        return res.status(200).json({ message: 'Estudiante actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const deleteEstudianteById = async (req, res) => {
    const estudianteId = req.params.id;
    const currentTimestamp = new Date(); // Get the current timestamp
    try {
        // Update estudiantes table
        const updateEstudianteQuery = 'UPDATE estudiantes SET fecha_eliminacion = $1, fecha_actualizacion = $1 WHERE id = $2';
        await pool.query(updateEstudianteQuery, [currentTimestamp, estudianteId]);

        // Update usuarios table (correo and contraseña can also be set to null or empty)
        const updateUsuarioQuery = 'UPDATE usuarios SET ffecha_eliminacion = $1, fecha_actualizacion = $1 WHERE id = (SELECT usuario_id FROM estudiantes WHERE id = $2)';
        await pool.query(updateUsuarioQuery, [currentTimestamp, estudianteId]);

        return res.status(200).json({ message: 'Estudiante eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};


const validarEstudiante = async (req, res) => {
    const { correo, rol } = req.body;

    // Validar si el correo ya existe
    const correoExistsQuery = 'SELECT id FROM usuarios WHERE correo = $1';
    const correoExistsResult = await pool.query(correoExistsQuery, [correo]);

    if (correoExistsResult.rows.length > 0) {
        return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Validar si el DNI ya existe (solo si es un estudiante)
    if (rol === 'estudiante') {
        const { dni,codigo } = req.body;
        const dniExistsQuery = 'SELECT id FROM estudiantes WHERE dni = $1 OR codigo = $2';
        const dniExistsResult = await pool.query(dniExistsQuery, [dni,codigo]);

        if (dniExistsResult.rows.length > 0) {
            return res.status(400).json({ message: 'El DNI o Codigo ya está registrado' });
        }
    }

    // Si no existen registros con el mismo correo o DNI, puedes responder con éxito o realizar otras acciones según tus necesidades.
    return res.status(200).json({ message: 'Validación exitosa' });
};


const createMasivo = async (req, res) => {
    try {
        const { correo, contraseña, rol } = req.body;
        const insertQuery = 'INSERT INTO usuarios (correo, contraseña, rol) VALUES ($1, $2, $3) RETURNING id';
        const values = [correo, contraseña, rol];
        const userResult = await pool.query(insertQuery, values);
        const userId = userResult.rows[0].id;
        const { codigo, dni, nombres, nivel_educativo, grado, direccion, telefono, condicion } = req.body;
        const insertEstudianteQuery = 'INSERT INTO estudiantes (usuario_id, codigo, dni, nombres, nivel_educativo, grado, direccion, telefono, condicion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
        const estudianteValues = [userId, codigo, dni, nombres, nivel_educativo, grado, direccion, telefono, condicion];
        await pool.query(insertEstudianteQuery, estudianteValues);

        // Insert records into usuarios_modulos
        const usuariosModulosInsertQueries = [
            `INSERT INTO usuarios_modulos (usuario_id, modulo_id, fecha_creacion, fecha_actualizacion) VALUES ($1, 1, NOW(), NOW());`,
            `INSERT INTO usuarios_modulos (usuario_id, modulo_id, fecha_creacion, fecha_actualizacion) VALUES ($1, 3, NOW(), NOW());`,
            `INSERT INTO usuarios_modulos (usuario_id, modulo_id, fecha_creacion, fecha_actualizacion) VALUES ($1, 4, NOW(), NOW());`
        ];

        for (const query of usuariosModulosInsertQueries) {
            await pool.query(query, [userId]);
        }

        return res.status(201).json({ message: 'Usuario creado con éxito', userId });
    } catch (error) {
        console.error('Error en createMasivo:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { getAllEstudiantes, getEstudianteById, createEstudiante, updateEstudiante, deleteEstudianteById,validarEstudiante,createMasivo};
