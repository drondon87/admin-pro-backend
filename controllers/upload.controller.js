const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { actualizarImagen } = require('../helpers/actualizar-imagen');
const fs = require('fs');

const cargarArchivo = async(req, res = response) => {

    const { tipo, id } = req.params;

    // Validar tipo
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No pertenece al tipo válido'
        });
    }

    // Se valida que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No existe archivo'
        });
    }

    //Procesar la imagen
    const file = req.files.imagen;
    const splitName = file.name.split('.');
    const fileExtension = splitName[splitName.length - 1]; //Se extrae la extension
    const validExtensions = ['jpg', 'png', 'jpeg', 'gif'];

    if (!validExtensions.includes(fileExtension)) {
        return res.status(400).json({
            ok: false,
            msg: 'No pertenece a una extensión válida'
        });
    }

    //Generar el nombre del archivo
    const fileName = `${uuidv4()}.${fileExtension}`;

    //Path para guardar la imagen
    const path = `./uploads/${tipo}/${fileName}`;

    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error servidor verifique logs'
            });
        }

        // Actualizar Base de datos
        actualizarImagen(tipo, id, fileName);

        res.json({
            ok: true,
            msg: 'Archivo Subido!',
            fileName
        })
    });
}

const obtenerImagen = async(req, res = response) => {
    const { tipo, foto } = req.params;

    // Validar tipo
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No pertenece al tipo válido'
        });
    }

    const imgPath = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath);
    } else {
        const noImagen = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(noImagen);
    }

}

module.exports = {
    cargarArchivo,
    obtenerImagen
}