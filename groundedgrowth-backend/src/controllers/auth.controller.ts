import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { RegisterRequest, LoginRequest, ApiResponse, User, AuthenticatedRequest } from '../types';
import {
  hashPassword,
  verifyPassword,
  generateToken,
  isValidEmail,
  isValidPassword,
  sanitizeString,
} from '../utils/auth.utils';
import { createError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

// --- REGISTRO --- //
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name }: RegisterRequest = req.body;

    // Validaciones
    if (!email || !password || !name) {
      return next(createError('Email, contraseña y nombre son requeridos', 400));
    }

    if (!isValidEmail(email)) {
      return next(createError('Email inválido', 400));
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.isValid) {
      return next(createError(passwordValidation.errors.join(', '), 400));
    }

    const sanitizedName = sanitizeString(name);
    if (sanitizedName.length < 2) {
      return next(createError('El nombre debe tener al menos 2 caracteres', 400));
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return next(createError('El email ya está registrado', 409));
    }

    // Crear usuario
    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: sanitizedName,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generar token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
    });

    console.log(`✅ Usuario registrado: ${newUser.email}`);

    const response: ApiResponse<{ user: User; token: string }> = {
      success: true,
      data: {
        user: newUser,
        token,
      },
      message: 'Usuario registrado exitosamente',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// --- LOGIN --- //
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validaciones
    if (!email || !password) {
      return next(createError('Email y contraseña son requeridos', 400));
    }

    if (!isValidEmail(email)) {
      return next(createError('Email inválido', 400));
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return next(createError('Credenciales inválidas', 401));
    }

    // Verificar contraseña
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return next(createError('Credenciales inválidas', 401));
    }

    // Generar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    console.log(`✅ Usuario logueado: ${user.email}`);

    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const response: ApiResponse<{ user: User; token: string }> = {
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: 'Login exitoso',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// --- OBTENER PERFIL --- //
export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(createError('Usuario no autenticado', 401));
    }

    const response: ApiResponse<User> = {
      success: true,
      data: req.user,
      message: 'Perfil obtenido exitosamente',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// --- VERIFICAR TOKEN --- //
export const verifyTokenEndpoint = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(createError('Token inválido', 401));
    }

    const response: ApiResponse<{ valid: boolean; user: User }> = {
      success: true,
      data: {
        valid: true,
        user: req.user,
      },
      message: 'Token válido',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};
