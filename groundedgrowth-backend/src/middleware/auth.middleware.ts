import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, JWTPayload } from '../types';

const prisma = new PrismaClient();

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
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
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

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
  } catch (error) {
    console.error('❌ Error en autenticación:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido',
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
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
