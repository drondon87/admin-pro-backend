const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos')
const {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_SAME
} = require('../middleware/validar-jwt');
const { getUsuarios, crearUsuarios, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios.controller');


const router = Router();

router.get('/', validarJWT, getUsuarios);
router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos
    ],
    crearUsuarios);

router.put('/:id', [
    validarJWT,
    validarADMIN_ROLE_o_SAME,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
], actualizarUsuario);

router.delete('/:id', [validarJWT, validarADMIN_ROLE], borrarUsuario);

module.exports = router;