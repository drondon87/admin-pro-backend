const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
} = require('../controllers/medico.controller');

const router = Router();

router.get('/', validarJWT, getMedicos);
router.post('/', [
        validarJWT,
        check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
        check('hospital', 'El hospital id debe de ser valido').isMongoId(),
        validarCampos
    ],
    crearMedico);

router.put('/:id', [], actualizarMedico);

router.delete('/:id', validarJWT, borrarMedico);

module.exports = router;