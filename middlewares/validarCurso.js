const mongoose = require('mongoose');
const Joi = require('joi');

const schema = Joi.object({
    titulo: Joi.string()        
        .min(3)
        .max(100)
        .required(),
    descripcion: Joi.string()
        .min(10)
        .max(400)
        .required(),
    imagen: Joi.string()
        .uri()
        .allow('', null)
        .optional(),
    autor: Joi.string()  // Si lo envías, debe ser un string (ObjectId)
        .optional()      // No requerido
        .allow(''),      // Permitir string vacío (aunque no es recomendable)
    alumnos: Joi.number()
        .integer()
        .min(0)
        .optional()
        .default(0),
    califica: Joi.number()
        .min(0)
        .max(5)
        .optional()
        .default(0),
    estado: Joi.boolean()
        .optional()
        .default(true)
}).options({ stripUnknown: true });

const validarCurso = (req,res,next) => {

    const { error , value } = schema.validate(req.body, { abortEarly: false }); // abortEarly: false para ver todos los errores

    if(error){
        return res.status(400).json({
            succcess:false,
            error: error.details.map(det => det.message).join(', ')
        });
    }

    next();  
};

module.exports = validarCurso;
