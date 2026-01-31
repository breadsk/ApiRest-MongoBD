// middlewares/validarToken.js - VERSIÓN CORREGIDA
const jwt = require('jsonwebtoken');

const validarToken = (req, res, next) => {    
    
    // 1. Obtener el token del header
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    
    
    if (!authHeader) {        
        return res.status(401).json({ 
            message: 'Acceso denegado. No hay token en el header.' 
        });
    }
    
    // 2. Verificar formato "Bearer <token>"
    if (!authHeader.startsWith('Bearer ')) {        
        return res.status(401).json({ 
            message: 'Formato de token incorrecto. Use: Bearer <token>' 
        });
    }
    
    // 3. Extraer token
    const token = authHeader.substring(7); // Quita "Bearer "    
    
    if (!token || token.trim() === '') {
        console.log('❌ Token vacío después de Bearer');
        return res.status(401).json({ 
            message: 'Token vacío después de Bearer' 
        });
    }
    
    try {
        // 4. Verificar token con JWT        
        const secret = process.env.JWT_SECRET || 'secreto-desarrollo';        
        
        const decoded = jwt.verify(token, secret);
                
        
        // 5. Adjuntar usuario a la request
        req.user = decoded;
        next();
        
    } catch (error) {        
        
        if (error.name === 'TokenExpiredError') {            
            return res.status(401).json({ 
                message: 'Token expirado. Por favor, inicie sesión nuevamente.',
                expiredAt: error.expiredAt 
            });
        }
        
        if (error.name === 'JsonWebTokenError') {            
            return res.status(401).json({ 
                message: `Token inválido: ${error.message}` 
            });
        }
        
        return res.status(401).json({ 
            message: 'Error de autenticación',
            error: error.message 
        });
    }
};

module.exports = validarToken;