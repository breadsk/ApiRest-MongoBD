const Curso = require('../models/curso_model');

const obtenerCursoPorId = async(req,res) => {
    try{

        const { id } = req.params;

        const curso = await Curso.findById(id);

        if(!curso){
            return res.status(404).json({
                success: false,
                error: 'No existe un curso con ese ID'
            });
        }

        res.json({
            success: true,
            valor: curso
        });

    }catch(error){
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        })
    }
}

module.exports = {
    obtenerCursoPorId
}