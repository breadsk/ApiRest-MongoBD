const mongoose = require('mongoose');

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        
        console.log('Conectado a mi base mongo BD');
        return mongoose.connection;

    }catch(error){
        process.exit(1);//Detiene la app si no hay conexión.
    }
}

module.exports = connectDB;