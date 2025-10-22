"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    console.error('❌ Error capturado:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
    });
    // Si es un error operacional (personalizado)
    if ('statusCode' in error && 'isOperational' in error) {
        return res.status(error.statusCode).json({
            success: false,
            error: error.message,
        });
    }
    // Errores de Prisma
    if (error.message.includes('Unique constraint')) {
        return res.status(409).json({
            success: false,
            error: 'Ya existe un registro con esos datos',
        });
    }
    if (error.message.includes('Record to update not found')) {
        return res.status(404).json({
            success: false,
            error: 'Registro no encontrado',
        });
    }
    // Error genérico
    return res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : error.message,
    });
};
exports.errorHandler = errorHandler;
// Crear errores personalizados
const createError = (message, statusCode = 500) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};
exports.createError = createError;
//# sourceMappingURL=error.middleware.js.map