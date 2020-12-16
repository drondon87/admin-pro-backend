const { Router } = require('express');
const fileUpload = require('express-fileupload');
const { validarJWT } = require('../middleware/validar-jwt');
const { cargarArchivo, obtenerImagen } = require('../controllers/upload.controller');

const router = Router();
router.use(fileUpload());

router.put('/:tipo/:id', validarJWT, cargarArchivo);
router.get('/:tipo/:foto', obtenerImagen);

module.exports = router;