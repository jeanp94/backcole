const pool = require('../../db');

const getAllBooks = async (req, res) => {
    try {
        const query = `
        SELECT 
            l.id,
            l.titulo,
            a.nombre AS autor_nombre,
            e.nombre AS editorial_nombre,
            l.nivel_educativo,
            l.grado,
            l.materia_id,
            l.tipo_contenido,
            l.idioma,
            l.estado,
            l."año_publicacion",
            l.paginas,
            l.peso_libro,
            l.descripcion,
            l.portada,
            l.archivo_ruta,
            l.fecha_creacion,
            l.fecha_actualizacion,
            l.fecha_eliminacion
        FROM 
            libros l
        INNER JOIN 
            autor a ON l.autor_id = a.id
        INNER JOIN 
            editorial e ON l.editorial_id = e.id;
        `;
        const result = await pool.query(query);
        const books = result.rows;
        return res.status(200).json(books);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const getLibrosPrimaria = async (req, res) => {
    try {
        const query = `
        SELECT 
            l.id,
            l.titulo,
            a.nombre AS autor_nombre,
            e.nombre AS editorial_nombre,
            l.nivel_educativo,
            l.grado,
            l.materia_id,
            l.tipo_contenido,
            l.idioma,
            l.estado,
            l."año_publicacion",
            l.paginas,
            l.peso_libro,
            l.descripcion,
            l.portada,
            l.archivo_ruta,
            l.fecha_creacion,
            l.fecha_actualizacion,
            l.fecha_eliminacion
        FROM 
            libros l
        INNER JOIN 
            autor a ON l.autor_id = a.id
        INNER JOIN 
            editorial e ON l.editorial_id = e.id
        where l.nivel_educativo = 'primaria' and l.fecha_eliminacion is null and l.estado='activo'
        LIMIT 5;
        `;
        const result = await pool.query(query);
        const books = result.rows;
        return res.status(200).json(books);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
const getLibrosPrimariaAll = async (req, res) => {
    try {
        const query = `
        SELECT 
            l.id,
            l.titulo,
            a.nombre AS autor_nombre,
            e.nombre AS editorial_nombre,
            l.nivel_educativo,
            l.grado,
            l.materia_id,
            l.tipo_contenido,
            l.idioma,
            l.estado,
            l."año_publicacion",
            l.paginas,
            l.peso_libro,
            l.descripcion,
            l.portada,
            l.archivo_ruta,
            l.fecha_creacion,
            l.fecha_actualizacion,
            l.fecha_eliminacion
        FROM 
            libros l
        INNER JOIN 
            autor a ON l.autor_id = a.id
        INNER JOIN 
            editorial e ON l.editorial_id = e.id
        where l.nivel_educativo = 'primaria' and l.fecha_eliminacion is null and l.estado='activo';
        `;
        const result = await pool.query(query);
        const books = result.rows;
        return res.status(200).json(books);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
const getLibrosSecundaria = async (req, res) => {
    try {
        const query = `
        SELECT 
            l.id,
            l.titulo,
            a.nombre AS autor_nombre,
            e.nombre AS editorial_nombre,
            l.nivel_educativo,
            l.grado,
            l.materia_id,
            l.tipo_contenido,
            l.idioma,
            l.estado,
            l."año_publicacion",
            l.paginas,
            l.peso_libro,
            l.descripcion,
            l.portada,
            l.archivo_ruta,
            l.fecha_creacion,
            l.fecha_actualizacion,
            l.fecha_eliminacion
        FROM 
            libros l
        INNER JOIN 
            autor a ON l.autor_id = a.id
        INNER JOIN 
            editorial e ON l.editorial_id = e.id
        where l.nivel_educativo = 'secundaria' and l.fecha_eliminacion is null and l.estado='activo'
        LIMIT 5;
        `;
        const result = await pool.query(query);
        const books = result.rows;
        return res.status(200).json(books);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const buscarLibroPorTitulo = async (req, res) => {
    try {
        const { titulo } = req.params; // Obtiene el título del libro desde los parámetros de la ruta

        // Ahora puedes usar "titulo" en tu consulta SQL para buscar libros por título
        const query = `
        SELECT 
            l.id,
            l.titulo,
            a.nombre AS autor_nombre,
            e.nombre AS editorial_nombre,
            l.nivel_educativo,
            l.grado,
            l.materia_id,
            l.tipo_contenido,
            l.idioma,
            l.estado,
            l."año_publicacion",
            l.paginas,
            l.peso_libro,
            l.descripcion,
            l.portada,
            l.archivo_ruta,
            l.fecha_creacion,
            l.fecha_actualizacion,
            l.fecha_eliminacion
        FROM 
            libros l
        INNER JOIN 
            autor a ON l.autor_id = a.id
        INNER JOIN 
            editorial e ON l.editorial_id = e.id
        WHERE 
            l.fecha_eliminacion IS NULL
            AND l.estado = 'activo'
            AND (l.titulo ILIKE $1 OR $1 IS NULL) -- Búsqueda por título
        `;

        const result = await pool.query(query, [`%${titulo}%`]); // Pasa el título como parámetro
        const books = result.rows;
        return res.status(200).json(books);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const getLibrosTop = async (req, res) => {
    try {
        const query = `
        SELECT 
            l.id,
            l.titulo,
            a.nombre AS autor_nombre,
            e.nombre AS editorial_nombre,
            l.nivel_educativo,
            l.grado,
            l.materia_id,
            l.tipo_contenido,
            l.idioma,
            l.estado,
            l."año_publicacion",
            l.paginas,
            l.peso_libro,
            l.descripcion,
            l.portada,
            l.archivo_ruta,
            l.fecha_creacion,
            l.fecha_actualizacion,
            l.fecha_eliminacion
        FROM 
            libros l
        INNER JOIN 
            autor a ON l.autor_id = a.id
        INNER JOIN 
            editorial e ON l.editorial_id = e.id
        where l.fecha_eliminacion is null and l.estado='activo'
        LIMIT 5;
        `;
        const result = await pool.query(query);
        const books = result.rows;
        return res.status(200).json(books);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
const getLibrosTopAll = async (req, res) => {
    try {
        const query = `
        SELECT 
            l.id,
            l.titulo,
            a.nombre AS autor_nombre,
            e.nombre AS editorial_nombre,
            l.nivel_educativo,
            l.grado,
            l.materia_id,
            l.tipo_contenido,
            l.idioma,
            l.estado,
            l."año_publicacion",
            l.paginas,
            l.peso_libro,
            l.descripcion,
            l.portada,
            l.archivo_ruta,
            l.fecha_creacion,
            l.fecha_actualizacion,
            l.fecha_eliminacion
        FROM 
            libros l
        INNER JOIN 
            autor a ON l.autor_id = a.id
        INNER JOIN 
            editorial e ON l.editorial_id = e.id
        where l.fecha_eliminacion is null and l.estado='activo';
        `;
        const result = await pool.query(query);
        const books = result.rows;
        return res.status(200).json(books);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
const getLibrosSecundariaAll = async (req, res) => {
    try {
        const query = `
        SELECT 
            l.id,
            l.titulo,
            a.nombre AS autor_nombre,
            e.nombre AS editorial_nombre,
            l.nivel_educativo,
            l.grado,
            l.materia_id,
            l.tipo_contenido,
            l.idioma,
            l.estado,
            l."año_publicacion",
            l.paginas,
            l.peso_libro,
            l.descripcion,
            l.portada,
            l.archivo_ruta,
            l.fecha_creacion,
            l.fecha_actualizacion,
            l.fecha_eliminacion
        FROM 
            libros l
        INNER JOIN 
            autor a ON l.autor_id = a.id
        INNER JOIN 
            editorial e ON l.editorial_id = e.id
        where l.nivel_educativo = 'secundaria' and l.fecha_eliminacion is null and l.estado='activo';
        `;
        const result = await pool.query(query);
        const books = result.rows;
        return res.status(200).json(books);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
const getBookById = async (req, res) => {
    const bookId = req.params.id;
    try {
        const query = `
            SELECT 
                l.id,
                l.titulo,
                a.nombre AS autor_nombre,
                a.id AS id_autor,
                e.id AS id_editorial,
                e.nombre AS editorial_nombre,
                l.nivel_educativo,
                l.grado,
                l.materia_id,
                m.nombre AS materia_nombre,
                l.tipo_contenido,
                l.idioma,
                l.estado,
                l."año_publicacion",
                l.paginas,
                l.peso_libro,
                l.descripcion,
                l.portada,
                l.archivo_ruta,
                l.fecha_creacion,
                l.fecha_actualizacion,
                l.fecha_eliminacion
            FROM 
                libros l
            INNER JOIN 
                autor a ON l.autor_id = a.id
            INNER JOIN 
                editorial e ON l.editorial_id = e.id
            INNER JOIN 
                materia m ON l.materia_id = m.id
            WHERE 
                l.id = $1;
        `;
        const result = await pool.query(query, [bookId]);
        const book = result.rows[0];
        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }
        return res.status(200).json(book);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const createBook = async (req, res) => {
    // Verifica si se cargó una portada y un archivo
    if (!req.files || !req.files.portada || !req.files.archivo_ruta) {
        return res.status(400).json({ message: 'Se requiere la portada y el archivo.' });
    }

    // Accede a los archivos cargados
    const portada = req.files.portada;
    const archivo = req.files.archivo_ruta;
    const tamañoArchivoKB = Math.ceil(archivo.size / 1024); // Redondea hacia arriba

    // Guarda la portada en la carpeta de destino
    const portadaPath = `public/portada/${portada.name}`;
    portada.mv(portadaPath, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al guardar la portada.' });
        }

        // Guarda el archivo en la carpeta de destino
        const archivoPath = `public/archivos/${archivo.name}`;
        archivo.mv(archivoPath, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al guardar el archivo.' });
            }

            try {
                const {
                    titulo,
                    autor_id,
                    editorial_id,
                    nivel_educativo,
                    grado,
                    materia_id,
                    tipo_contenido,
                    idioma,
                    estado,
                    publicacion,
                    paginas,
                    descripcion
                } = req.body;

                const query = `
                    INSERT INTO public.libros
                    (titulo, autor_id, editorial_id, nivel_educativo, grado, materia_id, tipo_contenido, idioma, estado,
                    año_publicacion, paginas, descripcion, portada, archivo_ruta, peso_libro)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                    RETURNING id`;

                const result = await pool.query(query, [
                    titulo,
                    autor_id,
                    editorial_id,
                    nivel_educativo,
                    grado,
                    materia_id,
                    tipo_contenido,
                    idioma,
                    estado,
                    publicacion,
                    paginas,
                    descripcion,
                    portadaPath,
                    archivoPath,
                    tamañoArchivoKB
                ]);

                const newBookId = result.rows[0].id;
                return res.status(201).json({ message: 'Libro creado exitosamente', id: newBookId });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error en el servidor' });
            }
        });
    });
};

const updateBook = async (req, res) => {
    const bookId = req.params.id;

    try {
        const {
            titulo,
            autor_id,
            editorial_id,
            nivel_educativo,
            grado,
            materia_id,
            tipo_contenido,
            idioma,
            estado,
            publicacion,
            paginas,
            descripcion
        } = req.body;

        const portadaFile = req.files.portada;
        const archivoFile = req.files.archivo_ruta;

        // Verifica si se cargó una nueva portada y un nuevo archivo
        if (portadaFile && archivoFile) {
            const portadaPath = `public/portada/${portadaFile.name}`;
            const archivoPath = `public/archivos/${archivoFile.name}`;

            // Guarda la nueva portada en la carpeta de destino
            portadaFile.mv(portadaPath, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error al guardar la nueva portada.' });
                }

                // Guarda el nuevo archivo en la carpeta de destino
                archivoFile.mv(archivoPath, async (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error al guardar el nuevo archivo.' });
                    }

                    // Realiza la actualización en la base de datos con los nuevos datos y rutas de archivos
                    const query = `
                        UPDATE public.libros
                        SET titulo = $1, autor_id = $2, editorial_id = $3, nivel_educativo = $4, grado = $5,
                        materia_id = $6, tipo_contenido = $7, idioma = $8, estado = $9, año_publicacion = $10,
                        paginas = $11, descripcion = $12, portada = $13, archivo_ruta = $14
                        WHERE id = $15`;

                    await pool.query(query, [
                        titulo,
                        autor_id,
                        editorial_id,
                        nivel_educativo,
                        grado,
                        materia_id,
                        tipo_contenido,
                        idioma,
                        estado,
                        publicacion,
                        paginas,
                        descripcion,
                        portadaPath,
                        archivoPath,
                        bookId
                    ]);

                    return res.status(200).json({ message: 'Libro actualizado exitosamente' });
                });
            });
        } else {
            // Si no se proporcionaron nuevos archivos, realiza la actualización sin cambiar las rutas de archivos
            const query = `
                UPDATE public.libros
                SET titulo = $1, autor_id = $2, editorial_id = $3, nivel_educativo = $4, grado = $5,
                materia_id = $6, tipo_contenido = $7, idioma = $8, estado = $9, año_publicacion = $10,
                paginas = $11, descripcion = $12
                WHERE id = $13`;

            await pool.query(query, [
                titulo,
                autor_id,
                editorial_id,
                nivel_educativo,
                grado,
                materia_id,
                tipo_contenido,
                idioma,
                estado,
                publicacion,
                paginas,
                descripcion,
                bookId
            ]);

            return res.status(200).json({ message: 'Libro actualizado exitosamente' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const deleteBookById = async (req, res) => {
    const bookId = req.params.id;

    try {
        const query = 'DELETE FROM public.libros WHERE id = $1';
        await pool.query(query, [bookId]);

        return res.status(200).json({ message: 'Libro eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};


const buscarLibrosAvanzado = async (req, res) => {
    try {
      const {
        nivel_educativo,
        grado,
        materia,
        tipo_contenido,
        idioma,
        año_publicacion,
        autor,
        editorial,
        titulo
      } = req.query; // Obtiene los parámetros de consulta
  
      // Construye la consulta SQL con condiciones dinámicas basadas en los parámetros de búsqueda
      const queryParams = [];
      let query = `
        SELECT 
          l.id,
          l.titulo,
          a.nombre AS autor_nombre,
          e.nombre AS editorial_nombre,
          l.nivel_educativo,
          l.grado,
          l.materia_id,
          l.tipo_contenido,
          l.idioma,
          l.estado,
          l."año_publicacion",
          l.paginas,
          l.peso_libro,
          l.descripcion,
          l.portada,
          l.archivo_ruta,
          l.fecha_creacion,
          l.fecha_actualizacion,
          l.fecha_eliminacion
        FROM 
          libros l
        INNER JOIN 
          autor a ON l.autor_id = a.id
        INNER JOIN 
          editorial e ON l.editorial_id = e.id
        WHERE 
          l.fecha_eliminacion IS NULL
          AND l.estado = 'activo'
      `;
  
      if (nivel_educativo) {
        query += ` AND l.nivel_educativo = $${queryParams.push(nivel_educativo)}`;
      }
  
      if (grado) {
        query += ` AND l.grado = $${queryParams.push(grado)}`;
      }
  
      if (materia) {
        query += ` AND l.materia_id = $${queryParams.push(materia)}`;
      }
  
      if (tipo_contenido) {
        query += ` AND l.tipo_contenido = $${queryParams.push(tipo_contenido)}`;
      }
  
      if (idioma) {
        query += ` AND l.idioma = $${queryParams.push(idioma)}`;
      }
  
      if (año_publicacion) {
        query += ` AND l."año_publicacion" = $${queryParams.push(año_publicacion)}`;
      }
  
      if (autor) {
        query += ` AND a.nombre ILIKE $${queryParams.push(`%${autor}%`)}`;
      }
  
      if (editorial) {
        query += ` AND e.nombre ILIKE $${queryParams.push(`%${editorial}%`)}`;
      }
      if (titulo) {
        query += ` AND l.titulo ILIKE $${queryParams.push(`%${titulo}%`)}`;
      }
  
      const result = await pool.query(query, queryParams);
      const books = result.rows;
      return res.status(200).json(books);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };


module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBookById,getLibrosPrimaria,getLibrosSecundaria,getLibrosPrimariaAll,getLibrosSecundariaAll,getLibrosTop,getLibrosTopAll,buscarLibroPorTitulo,buscarLibrosAvanzado};
