const pool = require('../../db');

const getAllAdministradores = async (req, res) => {
    try {
        const query =  `
        SELECT
            a.id,
            a.codigo,
            a.dni,
            a.nombres,
            a.profesion,
            a.cargo,
            a.direccion,
            a.telefono,
            a.condicion,
            a.fecha_creacion,
            a.fecha_actualizacion,
            a.fecha_eliminacion,
            u.correo AS usuario_correo,
            u.contraseña AS usuario_contraseña,
            u.rol AS usuario_rol
        FROM
            administrador a
        INNER JOIN
            usuarios u ON a.usuario_id = u.id
        WHERE
            a.fecha_eliminacion IS NULL
            AND u.rol = 'administrador';
    `;
        const result = await pool.query(query);
        const administradores = result.rows;
        return res.status(200).json(administradores);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const getAdministradorById = async (req, res) => {
    const administradorId = req.params.id;
    try {
        const query = `
        SELECT
            a.id,
            a.codigo,
            a.dni,
            a.nombres,
            a.profesion,
            a.cargo,
            a.direccion,
            a.telefono,
            a.condicion,
            a.fecha_creacion,
            a.fecha_actualizacion,
            a.fecha_eliminacion,
            u.correo AS usuario_correo,
            u.contraseña AS usuario_contraseña,
            u.rol AS usuario_rol
        FROM
            administrador a
        INNER JOIN
            usuarios u ON a.usuario_id = u.id
        WHERE
            a.id = $1;
    `;

        const result = await pool.query(query, [administradorId]);
        const administrador = result.rows[0];
        if (!administrador) {
            return res.status(404).json({ message: 'Administrador no encontrado' });
        }
        return res.status(200).json(administrador);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const createAdministrador = async (req, res) => {
    const { codigo, dni, nombres, profesion, cargo, direccion, telefono, email, condicion } = req.body;
    try {
        // Insertar en la tabla administrador
        const query = 'INSERT INTO administrador (codigo, dni, nombres, profesion, cargo, direccion, telefono, condicion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id';
        const result = await pool.query(query, [codigo, dni, nombres, profesion, cargo, direccion, telefono, condicion]);
        const nuevoAdministradorId = result.rows[0].id;

        // Insertar en la tabla usuarios
        const insertUsuarioQuery = 'INSERT INTO usuarios (correo, contraseña, rol) VALUES ($1, $2, $3) RETURNING id';
        const usuarioResult = await pool.query(insertUsuarioQuery, [email, '', 'administrador']);
        const nuevoUsuarioId = usuarioResult.rows[0].id;

        // Relacionar el usuario con el administrador
        const updateAdministradorQuery = 'UPDATE administrador SET usuario_id = $1 WHERE id = $2';
        await pool.query(updateAdministradorQuery, [nuevoUsuarioId, nuevoAdministradorId]);

        return res.status(201).json({ message: 'Administrador creado exitosamente', id: nuevoAdministradorId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const updateAdministrador = async (req, res) => {
    const { id, codigo, dni, nombres, profesion, cargo, direccion, telefono, condicion, correo, contraseña } = req.body;

    try {
        const hashedPassword = contraseña; 
        const currentTimestamp = new Date(); // Obtener la marca de tiempo actual
        const query = 'UPDATE administrador SET codigo = $1, dni = $2, nombres = $3, profesion = $4, cargo = $5, direccion = $6, telefono = $7, condicion = $8, fecha_actualizacion = $9 WHERE id = $10';
        await pool.query(query, [codigo, dni, nombres, profesion, cargo, direccion, telefono, condicion, currentTimestamp, id]);

        // Actualizar información de usuario (correo y contraseña) si es necesario
        const updateUserQuery = 'UPDATE usuarios SET correo = $1, contraseña = $2, fecha_actualizacion = $3 WHERE id = (SELECT usuario_id FROM administrador WHERE id = $4)';
        await pool.query(updateUserQuery, [correo, hashedPassword, currentTimestamp, id]);

        return res.status(200).json({ message: 'Administrador actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const deleteAdministradorById = async (req, res) => {
    const administradorId = req.params.id;
    const currentTimestamp = new Date(); // Obtener la marca de tiempo actual
    try {
        // Actualizar tabla administrador
        const updateAdministradorQuery = 'UPDATE administrador SET fecha_eliminacion = $1, fecha_actualizacion = $1 WHERE id = $2';
        await pool.query(updateAdministradorQuery, [currentTimestamp, administradorId]);

        // Actualizar tabla usuarios (correo y contraseña también pueden establecerse en nulo o vacío)
        const updateUsuarioQuery = 'UPDATE usuarios SET fecha_eliminacion = $1, fecha_actualizacion = $1 WHERE id = (SELECT usuario_id FROM administrador WHERE id = $2)';
        await pool.query(updateUsuarioQuery, [currentTimestamp, administradorId]);

        return res.status(200).json({ message: 'Administrador eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const validarAdministrador = async (req, res) => {
    const { correo, rol } = req.body;

    // Validar si el correo ya existe
    const correoExistsQuery = 'SELECT id FROM usuarios WHERE correo = $1';
    const correoExistsResult = await pool.query(correoExistsQuery, [correo]);

    if (correoExistsResult.rows.length > 0) {
        return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Validar si el DNI ya existe (solo si es un administrador)
    if (rol === 'administrador') {
        const { dni,codigo } = req.body;
        const dniExistsQuery = 'SELECT id FROM administrador WHERE dni = $1 OR codigo = $2';
        const dniExistsResult = await pool.query(dniExistsQuery, [dni,codigo]);

        if (dniExistsResult.rows.length > 0) {
            return res.status(400).json({ message: 'El DNI o Codigo ya está registrado' });
        }
    }

    // Si no existen registros con el mismo correo o DNI, puedes responder con éxito o realizar otras acciones según tus necesidades.
    return res.status(200).json({ message: 'Validación exitosa' });
};


const createMasivoAdministrador = async (req, res) => {
    try {
        const { correo, contraseña, rol } = req.body;
        const insertQuery = 'INSERT INTO usuarios (correo, contraseña, rol) VALUES ($1, $2, $3) RETURNING id';
        const values = [correo, contraseña, rol];
        const userResult = await pool.query(insertQuery, values);
        const userId = userResult.rows[0].id;
        const { codigo, dni, nombres, profesion, cargo, direccion, telefono, condicion } = req.body;
        const insertEstudianteQuery = 'INSERT INTO administrador (usuario_id, codigo, dni, nombres, profesion, cargo, direccion, telefono, condicion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
        const adminValues = [userId, codigo, dni, nombres, profesion, cargo, direccion, telefono, condicion];
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
                    `INSERT INTO usuarios_modulos (usuario_id, modulo_id, fecha_creacion, fecha_actualizacion) VALUES ($1, 11, NOW(), NOW());`,
                    `INSERT INTO usuarios_modulos (usuario_id, modulo_id, fecha_creacion, fecha_actualizacion) VALUES ($1, 13, NOW(), NOW());`,
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


module.exports = { getAllAdministradores, getAdministradorById, createAdministrador, updateAdministrador, deleteAdministradorById,validarAdministrador,createMasivoAdministrador};
