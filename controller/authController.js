
const Usuario = require('../models/usuario_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//bcrypt es intencionalmente lento (~250ms por comparación) 
// como medida de seguridad contra ataques de fuerza bruta. 
// Por eso es todavía más importante no bloquear el 
// servidor durante ese tiempo.
const login = async(req,res) => {
    try{

        console.log("Estoy apuntando");

        console.log(req.body.email);
        console.log(req.body.password);

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
        //const jwToken = jwt.sign({_id:usuario._id,nombre:usuario.nombre,email:usuario.email},process.env.JWT_SECRET);
        const jwToken = jwt.sign({
            usuario: {_id:usuario._id,nombre:usuario.nombre,email:usuario.email}
        }, process.env.JWT_SECRET,{expiresIn: '24h'})

        //4. Si todo es correcto, devolver usuario ( sin password )
        res.json({
            success:true,
            id:usuario._id,
            nombre:usuario.nombre,
            email:usuario.email,
            jwToken
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