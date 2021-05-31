const { response, request } = require('express');
const bcrypyjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const usuariosFun = Usuario.find({ estado: true })
                                    .skip(Number(desde))
                                    .limit(Number(limite));

    const totalFun = Usuario.countDocuments({ estado: true });

    const [ total, usuarios ] = await Promise.all([
        totalFun,
        usuariosFun
    ])
    
    res.json({
        total,
        usuarios
    })
}

const usuariosPut = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO contra base de datos
    if ( password ) {
        // Encriptar contraseña
        const salt = bcrypyjs.genSaltSync();
        resto.password = bcrypyjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}

const usuariosPost = async (req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar contraseña
    const salt = bcrypyjs.genSaltSync();
    usuario.password = bcrypyjs.hashSync( password, salt );

    // Guardar en BD
    await usuario.save();

    res.status(201).json({
        usuario
    })
}

const usuariosDelete = async (req = request, res = response) => {

    const { id } = req.params;

    // Borrado fisico
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false });

    res.json({
        usuario
    })
}

const usuarioPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API - Controlador'
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuarioPatch
}