import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  CreateGoalRequest,
  UpdateGoalRequest,
  ApiResponse,
  Goal,
  AuthenticatedRequest,
  PaginatedResponse,
} from '../types';
import { createError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

// --- OBTENER TODAS LAS METAS DEL USUARIO --- //
export const getGoals = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(createError('Usuario no autenticado', 401));
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Obtener metas con paginación
    const [goals, total] = await Promise.all([
      prisma.goal.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.goal.count({
        where: { userId: req.user.id },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const response: PaginatedResponse<Goal> = {
      success: true,
      data: goals,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      message: 'Metas obtenidas exitosamente',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// --- CREAR NUEVA META --- //
export const createGoal = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(createError('Usuario no autenticado', 401));
    }

    const { title, description }: CreateGoalRequest = req.body;

    // Validaciones
    if (!title || title.trim().length < 2) {
      return next(createError('El título debe tener al menos 2 caracteres', 400));
    }

    if (title.length > 200) {
      return next(createError('El título no puede exceder 200 caracteres', 400));
    }

    if (description && description.length > 1000) {
      return next(createError('La descripción no puede exceder 1000 caracteres', 400));
    }

    // Crear meta
    const newGoal = await prisma.goal.create({
      data: {
        userId: req.user.id,
        title: title.trim(),
        description: description?.trim() || null,
      },
    });

    console.log(`✅ Meta creada: ${newGoal.title} - Usuario: ${req.user.email}`);

    const response: ApiResponse<Goal> = {
      success: true,
      data: newGoal,
      message: 'Meta creada exitosamente',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// --- OBTENER META POR ID --- //
export const getGoalById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(createError('Usuario no autenticado', 401));
    }

    const { id } = req.params;

    const goal = await prisma.goal.findFirst({
      where: {
        id,
        userId: req.user.id, // Asegurar que solo puede ver sus propias metas
      },
    });

    if (!goal) {
      return next(createError('Meta no encontrada', 404));
    }

    const response: ApiResponse<Goal> = {
      success: true,
      data: goal,
      message: 'Meta obtenida exitosamente',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// --- ACTUALIZAR META --- //
export const updateGoal = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(createError('Usuario no autenticado', 401));
    }

    const { id } = req.params;
    const { title, description, isActive }: UpdateGoalRequest = req.body;

    // Verificar que la meta existe y pertenece al usuario
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingGoal) {
      return next(createError('Meta no encontrada', 404));
    }

    // Validaciones
    if (title !== undefined) {
      if (!title || title.trim().length < 2) {
        return next(createError('El título debe tener al menos 2 caracteres', 400));
      }
      if (title.length > 200) {
        return next(createError('El título no puede exceder 200 caracteres', 400));
      }
    }

    if (description !== undefined && description && description.length > 1000) {
      return next(createError('La descripción no puede exceder 1000 caracteres', 400));
    }

    // Construir objeto de actualización
    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Actualizar meta
    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: updateData,
    });

    console.log(`✅ Meta actualizada: ${updatedGoal.title} - Usuario: ${req.user.email}`);

    const response: ApiResponse<Goal> = {
      success: true,
      data: updatedGoal,
      message: 'Meta actualizada exitosamente',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// --- ELIMINAR META --- //
export const deleteGoal = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(createError('Usuario no autenticado', 401));
    }

    const { id } = req.params;

    // Verificar que la meta existe y pertenece al usuario
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingGoal) {
      return next(createError('Meta no encontrada', 404));
    }

    // Eliminar meta
    await prisma.goal.delete({
      where: { id },
    });

    console.log(`✅ Meta eliminada: ${existingGoal.title} - Usuario: ${req.user.email}`);

    const response: ApiResponse = {
      success: true,
      message: 'Meta eliminada exitosamente',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};
