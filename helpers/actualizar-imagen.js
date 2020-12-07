const fs = require('fs');
const UsuarioModel = require('../models/usuario.model');
const MedicoModel = require('../models/medico.model');
const HospitalModel = require('../models/hospital.model');

const actualizarImagen = async(tipo, id, fileName) => {
    let oldPath = '';
    switch (tipo) {
        case 'medicos':
            const medico = await MedicoModel.findById(id);
            if (!medico) {
                return false;
            }

            oldPath = `./uploads/medicos/${medico.img}`;
            borrarImagen(oldPath);

            medico.img = fileName;
            await medico.save();
            return true;

            break;
        case 'hospitales':
            const hospital = await HospitalModel.findById(id);
            if (!hospital) {
                return false;
            }

            oldPath = `./uploads/hospitales/${hospital.img}`;
            borrarImagen(oldPath);

            hospital.img = fileName;
            await hospital.save();
            return true;

            break;
        case 'usuarios':
            const usuario = await UsuarioModel.findById(id);
            if (!usuario) {
                return false;
            }

            oldPath = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(oldPath);

            usuario.img = fileName;
            await usuario.save();
            return true;

            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'El tipo usuarios/medicos/hospitales'
            });
    }
}

const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        // Borra la imagen anterior
        fs.unlinkSync(path);
    }
}

module.exports = {
    actualizarImagen
}