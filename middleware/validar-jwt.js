const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const validarJWT = (req, res = response, next) => {
    // Leer el token
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay toquen en la petición'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }

}

const validarADMIN_ROLE = async(req, res, next) => {

    const uid = req.uid;
    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if (usuarioDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'Usuario no tiene privilegios'
            });
        }

        next();

    } catch (error) {
        console.log(error);
        return res.status(403).json({
            ok: false,
            msg: 'Error Validación Role'
        })
    }

}

const validarADMIN_ROLE_o_SAME = async(req, res, next) => {

    const uid = req.uid;
    const { id } = req.params;
    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if (usuarioDB.role === 'ADMIN_ROLE' && uid === id) {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'Usuario no tiene privilegios'
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(403).json({
            ok: false,
            msg: 'Error Validación Role'
        })
    }

}

module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_SAME
}