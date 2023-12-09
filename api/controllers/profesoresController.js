const pool = require('../../db');

const getAllProfesores = async (req, res) => {
    try {
        const query = `
        SELECT
            p.id,
            p.codigo,
            p.dni,
            p.nombres,
            p.curso,
            p.cargo,
            p.direccion,
            p.telefono,
            p.condicion,
            p.fecha_creacion,
            p.fecha_actualizacion,
            p.fecha_eliminacion,
            u.correo AS usuario_correo
        FROM
            profesores p
        INNER JOIN
            usuarios u ON p.usuario_id = u.id
        WHERE
            p.fecha_eliminacion IS NULL;
        `;
        const result = await pool.query(query);
        const profesores = result.rows;
        return res.status(200).json(profesores);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const getProfesorById = async (req, res) => {
    const profesorId = req.params.id;
    try {
        const query = `
        SELECT
            p.id,
            p.codigo,
            p.dni,
            p.nombres,
            p.curso,
            p.cargo,
            p.direccion,
            p.telefono,
            p.condicion,
            p.fecha_creacion,
            p.fecha_actualizacion,
            p.fecha_eliminacion,
            u.correo AS usuario_correo,
            u.contraseña AS usuario_contraseña,
            u.rol AS usuario_rol
        FROM
            profesores p
        INNER JOIN
            usuarios u ON p.usuario_id = u.id
        WHERE
            p.id = $1;
        `;
        const result = await pool.query(query, [profesorId]);
        const profesor = result.rows[0];
        if (!profesor) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }
        return res.status(200).json(profesor);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const createProfesor = async (req, res) => {
    const { codigo, dni, nombres, curso, cargo, direccion, telefono, email, condicion } = req.body;
    try {
        // Insertar en la tabla profesores
        const query = 'INSERT INTO profesores (codigo, dni, nombres, curso, cargo, direccion, telefono, condicion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id';
        const result = await pool.query(query, [codigo, dni, nombres, curso, cargo, direccion, telefono, condicion]);
        const nuevoProfesorId = result.rows[0].id;

        // Insertar en la tabla usuarios
        const insertUsuarioQuery = 'INSERT INTO usuarios (correo, contraseña, rol) VALUES ($1, $2, $3) RETURNING id';
        const usuarioResult = await pool.query(insertUsuarioQuery, [email, '', 'profesor']);
        const nuevoUsuarioId = usuarioResult.rows[0].id;

        // Relacionar el usuario con el profesor
        const updateProfesorQuery = 'UPDATE profesores SET usuario_id = $1 WHERE id = $2';
        await pool.query(updateProfesorQuery, [nuevoUsuarioId, nuevoProfesorId]);

        return res.status(201).json({ message: 'Profesor creado exitosamente', id: nuevoProfesorId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const updateProfesor = async (req, res) => {
    const { id, codigo, dni, nombres, curso, cargo, direccion, telefono, correo,contraseña,rol, condicion } = req.body;

    try {
        const currentTimestamp = new Date();
        const query = 'UPDATE profesores SET codigo = $1, dni = $2, nombres = $3, curso = $4, cargo = $5, direccion = $6, telefono = $7, condicion = $8, fecha_actualizacion = $9 WHERE id = $10';
        await pool.query(query, [codigo, dni, nombres, curso, cargo, direccion, telefono, condicion, currentTimestamp, id]);

        // Actualizar información de usuario (correo) si es necesario
        const updateUserQuery = 'UPDATE usuarios SET correo = $1,contraseña = $2, fecha_actualizacion = $3, rol = $4  WHERE id = (SELECT usuario_id FROM profesores WHERE id = $5)';
        await pool.query(updateUserQuery, [correo,contraseña, currentTimestamp,rol, id]);

        return res.status(200).json({ message: 'Profesor actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const deleteProfesorById = async (req, res) => {
    const profesorId = req.params.id;
    const currentTimestamp = new Date();
    try {
        // Actualizar tabla profesores
        const updateProfesorQuery = 'UPDATE profesores SET fecha_eliminacion = $1, fecha_actualizacion = $1 WHERE id = $2';
        await pool.query(updateProfesorQuery, [currentTimestamp, profesorId]);

        // Actualizar tabla usuarios
        const updateUsuarioQuery = 'UPDATE usuarios SET fecha_eliminacion = $1, fecha_actualizacion = $1 WHERE id = (SELECT usuario_id FROM profesores WHERE id = $2)';
        await pool.query(updateUsuarioQuery, [currentTimestamp, profesorId]);

        return res.status(200).json({ message: 'Profesor eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const validarProfesor = async (req, res) => {
    const { correo, rol } = req.body;

    // Validar si el correo ya existe
    const correoExistsQuery = 'SELECT id FROM usuarios WHERE correo = $1';
    const correoExistsResult = await pool.query(correoExistsQuery, [correo]);

    if (correoExistsResult.rows.length > 0) {
        return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Validar si el DNI ya existe (solo si es un "profesor")
    if (rol === 'profesor') {
        const { dni,codigo } = req.body;
        const dniExistsQuery = 'SELECT id FROM profesores WHERE dni = $1 OR codigo = $2';
        const dniExistsResult = await pool.query(dniExistsQuery, [dni,codigo]);

        if (dniExistsResult.rows.length > 0) {
            return res.status(400).json({ message: 'El DNI o Codigo ya está registrado' });
        }
    }

    // Si no existen registros con el mismo correo o DNI, puedes responder con éxito o realizar otras acciones según tus necesidades.
    return res.status(200).json({ message: 'Validación exitosa' });
};

const createMasivoProfesor = async (req, res) => {
    try {
        const { correo, contraseña, rol } = req.body;
        const insertQuery = 'INSERT INTO usuarios (correo, contraseña, rol) VALUES ($1, $2, $3) RETURNING id';
        const values = [correo, contraseña, rol];
        const userResult = await pool.query(insertQuery, values);
        const userId = userResult.rows[0].id;
        const { codigo, dni, nombres, curso, cargo, direccion, telefono, condicion } = req.body;
        const insertEstudianteQuery = 'INSERT INTO profesores (usuario_id, codigo, dni, nombres, curso, cargo, direccion, telefono, condicion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
        const adminValues = [userId, codigo, dni, nombres, curso, cargo, direccion, telefono, condicion];
        await pool.query(insertEstudianteQuery, adminValues);

        // Insert records into usuarios_modulos
        const usuariosModulosInsertQueries = [
            `INSERT INTO usuarios_modulos (usuario_id, modulo_id, fecha_creacion, fecha_actualizacion) VALUES ($1, 1, NOW(), NOW());`,
            `INSERT INTO usuarios_modulos (usuario_id, modulo_id, fecha_creacion, fecha_actualizacion) VALUES ($1, 2, NOW(), NOW());`,
            `INSERT INTO usuarios_modulos (usuario_id, modulo_id, fecha_creacion, fecha_actualizacion) VALUES ($1, 3, NOW(), NOW());`,
            `INSERT INTO usuarios_modulos (usuario_id, modulo_id, fecha_creacion, fecha_actualizacion) VALUES ($1, 4, NOW(), NOW());`,
            `INSERT INTO usuarios_modulos (usuario_id, modulo_id, fecha_creacion, fecha_actualizacion) VALUES ($1, 5, NOW(), NOW());`,
            `INSERT INTO usuarios_modulos (usuario_id, modulo_id, fecha_creacion, fecha_actualizacion) VALUES ($1, 7, NOW(), NOW());`,
            `INSERT INTO usuarios_modulos (usuario_id, modulo_id, fecha_creacion, fecha_actualizacion) VALUES ($1, 8, NOW(), NOW());`,
            `INSERT INTO usuarios_modulos (usuario_id, modulo_id, fecha_creacion, fecha_actualizacion) VALUES ($1, 9, NOW(), NOW());`,
            `INSERT INTO usuarios_modulos (usuario_id, modulo_id, fecha_creacion, fecha_actualizacion) VALUES ($1, 10, NOW(), NOW());`,
            `INSERT INTO usuarios_modulos (usuario_id, modulo_id, fecha_creacion, fecha_actualizacion) VALUES ($1, 12, NOW(), NOW());`,
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


module.exports = {
    getAllProfesores,
    getProfesorById,
    createProfesor,
    updateProfesor,
    deleteProfesorById,
    validarProfesor,
    createMasivoProfesor
};
