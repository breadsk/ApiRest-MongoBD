const mongoose = require('mongoose');

const validarObjectId = (paramName) => {
    return (req,res,next) => {
        const id = req.params[paramName];

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                error: `ID ${id} no tiene formato válido. Debe ser un ObjectId de 24 caracteres hexadecimales`
            });
        }

        next(); //Si es valido, pasa al siguiente middleware/controlador
    };
};

module.exports = validarObjectId;