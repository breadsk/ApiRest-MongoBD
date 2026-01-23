const Curso = require('../models/curso_model');

//En Express, los controladores deben manejar 
//los objetos req y res
const listarCursosActivos = async(req,res) => {    
    try{
        let cursos = await Curso.find({estado: true});
        res.json({
            success:true,
            valor:cursos
        });
    }catch(error){
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        })
    }

}

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

const crearCurso = async(req,res) => {

    let body = req.body;

    try{

        let curso = new Curso({
            titulo: body.titulo,
            descripcion: body.descripcion
        });

        const cursoAdd = await curso.save();

        res.json({
            success: true,
            valor: cursoAdd,
        });

        
    }catch(error){
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
}

module.exports = {
    obtenerCursoPorId,
    listarCursosActivos,
    crearCurso,
}