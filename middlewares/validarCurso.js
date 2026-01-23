const mongoose = require('mongoose');
const Joi = require('joi');

const schema = Joi.object({
    titulo: Joi.string()        
        .min(10)
        .max(100)
        .required(),
    descripcion: Joi.string()
        .min(30)
        .max(400)
        .required(),    
});

const validarCurso = (req,res,next) => {

    const { error , value } = schema.validate(req.body);

    if(error){
        return res.status(400).json({
            succcess:false,
            error: error.details[0].message
        });
    }

    next();  
};

module.exports = validarCurso;