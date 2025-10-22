"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Token de acceso requerido',
            });
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('❌ JWT_SECRET no configurado');
            return res.status(500).json({
                success: false,
                error: 'Error de configuración del servidor',
            });
        }
        // Verificar token
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        // Buscar usuario en la base de datos
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no encontrado',
            });
        }
        // Agregar usuario al request
        req.user = user;
        next();
    }
    catch (error) {
        console.error('❌ Error en autenticación:', error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                error: 'Token inválido',
            });
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                error: 'Token expirado',
            });
        }
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
        });
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.middleware.js.map