const Usuario = require('../models/usuario_model');
const bcrypt = require('bcrypt');

//bcrypt es intencionalmente lento (~250ms por comparación) 
// como medida de seguridad contra ataques de fuerza bruta. 
// Por eso es todavía más importante no bloquear el 
// servidor durante ese tiempo.
const login = async(req,res) => {
    try{

        const { email , password } = req.body;

        //1. Buscar usuario por email
        const usuario = await Usuario.findOne({email});

        //2. Si no existe el usuario
        if(!usuario){
            return res.status(400).json({
                success: false,
                error:'usuario o contraseña incorrecta'
            });
        }

        //3. Verificar contraseña
        const passwordValido = await bcrypt.compare(password,usuario.password);

        if(!passwordValido){
            return res.status(400).json({
                success: false,
                error: 'Usuario o contraseña incorrecta'
            });
        }

        //4. Si todo es correcto, devolver usuario ( sin password )
        res.json({
            success:true,
            email:usuario.email,
            nombre:usuario.nombre,
            estado:usuario.estado
        });

    }catch(error){
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        })
    }
}

module.exports = {
    login
}