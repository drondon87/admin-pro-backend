const { response } = require('express');
const Hospital = require('../models/hospital.model');

const getHospitales = async(req, res = response) => {
    const hospitales = await Hospital.find().populate('usuario', 'nombre email img');
    res.json({
        ok: true,
        hospitales,
    })
}

const crearHospital = async(req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {
        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const actualizarHospital = async(req, res = response) => {

    const { id } = req.params;
    const uid = req.uid;

    try {

        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital por ese id'
            })
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

        res.json({
            ok: true,
            msg: 'Hospital Actualizado',
            hospital: hospitalActualizado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

    res.json({
        ok: true,
        msg: 'Actualizar Hospital'
    })
}

const borrarHospital = async(req, res = response) => {

    const { id } = req.params;

    try {

        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital por ese id'
            })
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Hospital Eliminado'
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
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}