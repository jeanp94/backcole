const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');

const usuariosController = require('./controllers/usuariosController');
const autoresController = require('./controllers/autoresController');
const editorialesController = require('./controllers/editorialesController');
const materiaController = require('./controllers/materiaController');
const estudiantesController = require('./controllers/estudiantesController');
const administradorController = require('./controllers/administradorController');
const profesoresController = require('./controllers/profesoresController');
const librosController = require('./controllers/librosController');
const favoritosController = require('./controllers/favoritosController');


// POST iniciar sessión
router.post('/login', usuariosController.login);
// POST crear usuarios
router.post('/createUser', usuariosController.createUser);
// GET Obtener información
router.get('/dashboard', usuariosController.dashboard);

// GET para obtener todos los autores
router.get('/getAllAutores', autoresController.getAllAutores);

// POST para obtener un autor por ID
router.get('/getAutorById/:id', autoresController.getAutorById);

// POST para crear un nuevo autor
router.post('/createAutor', autoresController.createAutor);

// POST para actualizar un autor por ID
router.put('/updateAutorById', autoresController.updateAutor);

// POST para eliminar un autor por ID
router.delete('/deleteAutorById/:id', autoresController.deleteAutorById);

// GET para obtener todas las editoriales
router.get('/getAllEditoriales', editorialesController.getAllEditoriales);

// GET para obtener una editorial por ID
router.get('/getEditorialById/:id', editorialesController.getEditorialById);

// POST para crear una nueva editorial
router.post('/createEditorial', editorialesController.createEditorial);

// PUT para actualizar una editorial por ID
router.put('/updateEditorialById', editorialesController.updateEditorial);

// DELETE para eliminar una editorial por ID
router.delete('/deleteEditorialById/:id', editorialesController.deleteEditorialById);


// GET para obtener todas las materias
router.get('/getAllMaterias', materiaController.getAllMaterias);

// GET para obtener una materia por ID
router.get('/getMateriaById/:id', materiaController.getMateriaById);

// POST para crear una nueva materia
router.post('/createMateria', materiaController.createMateria);

// PUT para actualizar una materia por ID
router.put('/updateMateriaById', materiaController.updateMateria);

// DELETE para eliminar una materia por ID
router.delete('/deleteMateriaById/:id', materiaController.deleteMateriaById);

// Validar la materia
router.post('/validarNombreMateria', materiaController.validarNombreMateria);

// Validar la editoriales
router.post('/validarEditoriales', editorialesController.validarEditoriales);
// Validar la autores
router.post('/validarAutores', autoresController.validarAutores);

// GET para obtener todos los estudiantes
router.get('/getAllEstudiantes', estudiantesController.getAllEstudiantes);

// Validar Estudiantes registrados
router.post('/validarEstudiante', estudiantesController.validarEstudiante);
router.post('/createMasivo', estudiantesController.createMasivo);
//Validar administrador
router.post('/validarAdministrador', administradorController.validarAdministrador);
router.post('/createMasivoAdministrador', administradorController.createMasivoAdministrador);

//Validar profesor
router.post('/validarProfesor', profesoresController.validarProfesor);
router.post('/createMasivoProfesor', profesoresController.createMasivoProfesor);





// GET para obtener un estudiante por ID
router.get('/getEstudianteById/:id', estudiantesController.getEstudianteById);

// POST para crear un nuevo estudiante
router.post('/createEstudiante', estudiantesController.createEstudiante);

// PUT para actualizar un estudiante por ID
router.put('/updateEstudianteById', estudiantesController.updateEstudiante);

// DELETE para eliminar un estudiante por ID
router.delete('/deleteEstudianteById/:id', estudiantesController.deleteEstudianteById);

// GET para obtener todos los administradores
router.get('/getAllAdministradores', administradorController.getAllAdministradores);

// GET para obtener un administrador por ID
router.get('/getAdministradorById/:id', administradorController.getAdministradorById);

// POST para crear un nuevo administrador
router.post('/createAdministrador', administradorController.createAdministrador);

// PUT para actualizar un administrador por ID
router.put('/updateAdministradorById', administradorController.updateAdministrador);

// DELETE para eliminar un administrador por ID
router.delete('/deleteAdministradorById/:id', administradorController.deleteAdministradorById);

// GET para obtener todos los profesores
router.get('/getAllProfesores', profesoresController.getAllProfesores);

// GET para obtener un profesor por ID
router.get('/getProfesorById/:id', profesoresController.getProfesorById);

// POST para crear un nuevo profesor
router.post('/createProfesor', profesoresController.createProfesor);

// PUT para actualizar un profesor por ID
router.put('/updateProfesorById', profesoresController.updateProfesor);

// DELETE para eliminar un profesor por ID
router.delete('/deleteProfesorById/:id', profesoresController.deleteProfesorById);

//Obtener todos los libros
router.get('/getAllBooks',librosController.getAllBooks);
//Obtener todos los libros
router.get('/getLibrosPrimaria',librosController.getLibrosPrimaria);
router.get('/getLibrosSecundaria',librosController.getLibrosSecundaria);
router.get('/getLibrosPrimariaAll',librosController.getLibrosPrimariaAll);
router.get('/getLibrosSecundariaAll',librosController.getLibrosSecundariaAll);
router.get('/getLibrosTop',librosController.getLibrosTop);
router.get('/getLibrosTopAll',librosController.getLibrosTopAll);

//Obtener libro por id
router.get('/getBookById/:id',librosController.getBookById);
// POST para crear un libro
// Validación de Multer en la ruta
router.use(fileUpload());

// Ruta para cargar un libro con portada y archivo
router.post('/createBook', librosController.createBook);

// DELETE para eliminar un libro por ID
router.delete('/deleteBookById/:id', librosController.deleteBookById);

router.get('/buscarlibro/:titulo', librosController.buscarLibroPorTitulo);
router.get('/buscarlibroavanzado/:titulo', librosController.buscarLibrosAvanzado);

//favoritos
router.post('/createUserBookRelation', favoritosController.createUserBookRelation);
router.delete('/createUserBookRelation', favoritosController.deleteUserBookRelation);
router.get('/getAllUserBookRelations', favoritosController.getAllUserBookRelations);
router.get('/getUserBookRelationsByUserId/:id', favoritosController.getUserBookRelationsByUserId);
router.put('/usuarios/:id_usuario/libros/:id_libro', favoritosController.updateUserBookRelation);


module.exports = router;