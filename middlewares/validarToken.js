const jwt = require("jsonwebtoken");

const validarToken = (req,res,next) => {
    let token = req.get('Autorization');

    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){           //No autorizado
            return res.status(401).json({
                success:false,
                err
            });
        }else{            
            next();
        }
    });
}

module.exports = validarToken;