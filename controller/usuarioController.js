const Usuario = require('../models/usuario_model');

//En express , los controladores deben manejar
//los objetos req y res
const listarUsuariosActivos = async(req,res) => {

    try{

        let usuarios = await Usuario.find({estado: true});
        res.json({
            success:true,
            valor:usuarios,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            error:'Error interno del servidor'
        });
    }
}

const obtenerUsuarioPorEmail = async(req,res) => {
    try{
        const { email } = req.params;

        const usuario = await Usuario.findOne({email:email});

        if(!usuario){
            return res.status(404).json({
                success:false,
                error: 'No existe un usuario con ese email'
            });
        }

         res.json({
            success: true,
            valor: {
                _id: usuario._id,
                email: usuario.email,
                nombre: usuario.nombre,
                estado: usuario.estado,
                imagen: usuario.imagen
                // No devolvemos la contraseña por seguridad
            }
        });


    }catch(error){
        res.status(500).json({
            success:false,
            error: 'Error interno del servidor'
        })
    }
}


module.exports = {
    listarUsuariosActivos,
    obtenerUsuarioPorEmail,
}