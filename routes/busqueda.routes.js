const { Router } = require('express');
const { validarJWT } = require('../middleware/validar-jwt');
const { getTodo, getDocumentsColeccion } = require('../controllers/busqueda.controller');

const router = Router();

router.get('/:busqueda', validarJWT, getTodo);
router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentsColeccion);

module.exports = router;