const mongoose = require('mongoose');

const validarObjectId = (paramName) => {
    return (req,res,next) => {
        const id = req.params[paramName];//En lugar de req.params.id

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                error: `ID ${id} no tiene formato válido. Debe ser un ObjectId de 24 caracteres hexadecimales`
            });
        }

        next(); //Si es valido, pasa al siguiente middleware/controlador
        //Si el next la peticion quedaria atascada en el middleware
    };
};

module.exports = validarObjectId;
//¿Qué hace next()?
//next() le dice a Express: "Ya terminé mi trabajo en este middleware, 
// pasa al siguiente paso". Es como un semáforo en verde para que la petición continúe su camino.