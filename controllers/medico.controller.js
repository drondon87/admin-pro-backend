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

const actualizarMedico = async(req, res = response) => {

    const { id } = req.params;
    const uid = req.uid;

    try {

        const medicoDB = await Medico.findById(id);

        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un medico por ese id'
            })
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            msg: 'Medico Actualizado',
            hospital: medicoActualizado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const borrarMedico = async(req, res = response) => {
    const { id } = req.params;

    try {

        const medicoDB = await Medico.findById(id);

        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un medico por ese id'
            })
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Medico Eliminado'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisar logs'
        })
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}