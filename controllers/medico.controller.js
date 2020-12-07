const { response } = require('express');
const Medico = require('../models/medico.model');

const getMedicos = async(req, res = response) => {
    const medicos = await Medico.find()
        .populate('usuario', 'nombre email img')
        .populate('hospital', 'nombre');

    res.json({
        ok: true,
        medicos
    })
}

const crearMedico = async(req, res = response) => {
    const uid = req.uid;
    const medicoModel = new Medico({
        usuario: uid,
        ...req.body
    });

    try {
        const medico = await medicoModel.save();

        res.json({
            ok: true,
            medico
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const actualizarMedico = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'Actualizar Medicos'
    })
}

const borrarMedico = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'Borrar Medicos'
    })
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}