const { response } = require('express');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerifiy } = require('../helpers/google-verifiy');

const login = async(req, res = response) => {
    const { email, password } = req.body;
    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no válido'
            })
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña no válido'
            })
        }
        const token = await generarJWT(usuarioDB.id);

        //Generar token
        res.json({
            ok: true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisar logs'
        })
    }
}

const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;
    let usuario;

    try {

        const { name, email, picture } = await googleVerifiy(googleToken);
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '123',
                img: picture,
                google: true
            });
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar en la BD
        await usuario.save();

        const token = await generarJWT(usuarioDB.id);

        //Generar token
        res.json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Token no es correcto'
        })
    }


}

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    const token = await generarJWT(uid);

    // Obtener el usuario por uid
    const usuario = await Usuario.findById(uid);


    res.json({
        ok: true,
        token,
        usuario
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}