const jwt = require("jsonwebtoken");

const validarToken = (req,res,next) => {
    let token = req.get('Authorization');

    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){           //No autorizado
            return res.status(401).json({
                success:false,
                err
            });
        }
        req.usuario = decoded.usuario;        
        next();
        
    });
}

module.exports = validarToken;