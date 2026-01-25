const Curso = require('../models/curso_model');

//En Express, los controladores deben manejar 
//los objetos req y res
const listarCursosActivos = async(req,res) => {    
    try{
        let cursos = await Curso
            .find({estado: true})
            .populate('autor','nombre email -_id');
        res.json({
            success:true,
            //usuario:req.usuario,
            cursos,            
        });
    }catch(error){
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
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
    

    try{

        let curso = new Curso({
            titulo: req.body.titulo,
            autor: req.usuario._id,
            descripcion: req.body.descripcion
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

const actualizarCurso = async(req,res) => {
    
    try{
        let body = req.body;
        let id = req.params.id;
        let cursoExiste = await existeCursoPorId(id);
        
        if(!cursoExiste){
            res.status(404).json({
                success:false,
                error:'Curso no existe para editar'
            })
        }                    

        let curso = await Curso.findOneAndUpdate({_id:id},{
            $set:{
                titulo: body.titulo,
                descripcion: body.descripcion
            }
        },{new:true});

        console.log("El curso es: ",curso);

        res.json({
            success: true,
            valor: curso,
        });

    }catch(error){
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }    
}

const desactivarCurso = async(req,res) => {
    try{
        let id = req.params.id;
        let curso = await Curso.findOneAndUpdate({_id:id},{
            $set: {
                estado: false
            }
        },{new:true});

        res.json({
            success:true,
            valor: curso,
        });

    }catch(error){
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
}

async function existeCursoPorId(id){
    return Curso.findById(id);
}

module.exports = {
    obtenerCursoPorId,
    listarCursosActivos,
    crearCurso,
    actualizarCurso,
    desactivarCurso,
}