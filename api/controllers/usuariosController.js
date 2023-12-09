const pool = require('../../db');

const login = async (req, res) => {
    const { correo, contraseña } = req.body;
    const query = `
        SELECT
            usuarios.*,
            COALESCE(estudiantes.nombres, profesores.nombres, administrador.nombres) AS nombres
        FROM usuarios
        LEFT JOIN estudiantes ON usuarios.id = estudiantes.usuario_id
        LEFT JOIN profesores ON usuarios.id = profesores.usuario_id
        LEFT JOIN administrador ON usuarios.id = administrador.usuario_id
        WHERE correo = $1 AND usuarios.fecha_eliminacion IS NULL;
    `;
    const values = [correo];

    try {
        const result = await pool.query(query, values);
        const user = result.rows[0];

        if (user && contraseña === user.contraseña) {
            req.session.userId = user.id;

            const modulesQuery = `
                SELECT
                    modulos.module_name,
                    modulos.url,
                    modulos.vista
                FROM usuarios_modulos
                JOIN modulos ON usuarios_modulos.modulo_id = modulos.id
                WHERE usuarios_modulos.usuario_id = $1 and usuarios_modulos.fecha_eliminacion is null
                ORDER BY modulos.id ASC;
            `;
            const modulesValues = [user.id];
            const modulesResult = await pool.query(modulesQuery, modulesValues);
            const userModules = modulesResult.rows;

            return res.status(200).json({
                message: 'Inicio de sesión exitoso',
                id: user.id,
                correo: user.correo,
                nombres: user.nombres,
                rol: user.rol,
                modulos: userModules
            });
        } else {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const createUser = async (req, res) => {
    const { correo, contraseña, rol } = req.body;

    let insertQuery;
    let values;

    if (rol === 'estudiante' || rol === 'profesor' || rol === 'administrador') {
        insertQuery = 'INSERT INTO usuarios (correo, contraseña, rol) VALUES ($1, $2, $3) RETURNING id';
        values = [correo, contraseña, rol];

        try {
            const userResult = await pool.query(insertQuery, values);
            const userId = userResult.rows[0].id;

            // Insert data for different roles based on 'rol'
            if (rol === 'estudiante') {
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
            } else if (rol === 'profesor') {
                const { codigo, dni, nombres, curso, direccion, telefono, condicion, cargo } = req.body;
                const insertProfesorQuery = 'INSERT INTO profesores (usuario_id, codigo, dni, nombres, curso, direccion, telefono, condicion, cargo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
                const profesorValues = [userId, codigo, dni, nombres, curso, direccion, telefono, condicion, cargo];
                await pool.query(insertProfesorQuery, profesorValues);

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
            } else if (rol === 'administrador') {
                const { codigo, dni, nombres, profesion, cargo, direccion, telefono, condicion } = req.body;
                const insertAdminQuery = 'INSERT INTO administrador (usuario_id, codigo, dni, nombres, profesion, cargo, direccion, telefono, condicion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
                const adminValues = [userId, codigo, dni, nombres, profesion, cargo, direccion, telefono, condicion];
                await pool.query(insertAdminQuery, adminValues);

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
            }

            return res.status(201).json({ message: 'Usuario creado con éxito', userId });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } else {
        return res.status(400).json({ message: 'Rol inválido' });
    }
};


const dashboard = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Acceso no autorizado' });
    }

    const userId = req.session.userId;

    try {
        const userQuery = 'SELECT * FROM usuarios WHERE id = $1';
        const userResult = await pool.query(userQuery, [userId]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Get additional user data if needed
        // ...

        return res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { login, dashboard, createUser };
