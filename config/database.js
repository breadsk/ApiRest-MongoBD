const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Asegúrate de que la URI esté definida
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI no está definida en las variables de entorno.');
        }
        
        await mongoose.connect(process.env.MONGODB_URI, {
            // Opciones de conexión para evitar warnings
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('Conectado a mi base mongo BD');
        return mongoose.connection;
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        // Detiene la app si no hay conexión.
        process.exit(1);
    }
};


module.exports = connectDB;