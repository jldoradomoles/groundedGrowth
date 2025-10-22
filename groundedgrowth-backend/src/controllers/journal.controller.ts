import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  CreateJournalEntryRequest,
  UpdateJournalEntryRequest,
  ApiResponse,
  JournalEntry,
  AuthenticatedRequest,
  PaginatedResponse,
} from '../types';
import { createError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

// --- OBTENER TODAS LAS ENTRADAS DEL USUARIO --- //
export const getJournalEntries = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(createError('Usuario no autenticado', 401));
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Obtener entradas con paginación
    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          aiAnalyses: {
            select: {
              id: true,
              aiProvider: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 1, // Solo el análisis más reciente
          },
        },
      }),
      prisma.journalEntry.count({
        where: { userId: req.user.id },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const response: PaginatedResponse<any> = {
      success: true,
      data: entries,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      message: 'Entradas del diario obtenidas exitosamente',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// --- CREAR NUEVA ENTRADA --- //
export const createJournalEntry = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(createError('Usuario no autenticado', 401));
    }

    const { content }: CreateJournalEntryRequest = req.body;

    // Validaciones
    if (!content || content.trim().length < 10) {
      return next(createError('La entrada debe tener al menos 10 caracteres', 400));
    }

    if (content.length > 10000) {
      return next(createError('La entrada no puede exceder 10,000 caracteres', 400));
    }

    // Crear entrada
    const newEntry = await prisma.journalEntry.create({
      data: {
        userId: req.user.id,
        content: content.trim(),
      },
    });

    console.log(`✅ Entrada del diario creada - Usuario: ${req.user.email}`);

    const response: ApiResponse<JournalEntry> = {
      success: true,
      data: newEntry,
      message: 'Entrada del diario creada exitosamente',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// --- OBTENER ENTRADA POR ID --- //
export const getJournalEntryById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(createError('Usuario no autenticado', 401));
    }

    const { id } = req.params;

    const entry = await prisma.journalEntry.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
      include: {
        aiAnalyses: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!entry) {
      return next(createError('Entrada no encontrada', 404));
    }

    const response: ApiResponse<any> = {
      success: true,
      data: entry,
      message: 'Entrada obtenida exitosamente',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// --- ACTUALIZAR ENTRADA --- //
export const updateJournalEntry = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(createError('Usuario no autenticado', 401));
    }

    const { id } = req.params;
    const { content }: UpdateJournalEntryRequest = req.body;

    // Verificar que la entrada existe y pertenece al usuario
    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingEntry) {
      return next(createError('Entrada no encontrada', 404));
    }

    // Validaciones
    if (!content || content.trim().length < 10) {
      return next(createError('La entrada debe tener al menos 10 caracteres', 400));
    }

    if (content.length > 10000) {
      return next(createError('La entrada no puede exceder 10,000 caracteres', 400));
    }

    // Actualizar entrada
    const updatedEntry = await prisma.journalEntry.update({
      where: { id },
      data: { content: content.trim() },
    });

    console.log(`✅ Entrada del diario actualizada - Usuario: ${req.user.email}`);

    const response: ApiResponse<JournalEntry> = {
      success: true,
      data: updatedEntry,
      message: 'Entrada actualizada exitosamente',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// --- ELIMINAR ENTRADA --- //
export const deleteJournalEntry = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(createError('Usuario no autenticado', 401));
    }

    const { id } = req.params;

    // Verificar que la entrada existe y pertenece al usuario
    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingEntry) {
      return next(createError('Entrada no encontrada', 404));
    }

    // Eliminar entrada (los análisis de IA se eliminarán automáticamente por CASCADE)
    await prisma.journalEntry.delete({
      where: { id },
    });

    console.log(`✅ Entrada del diario eliminada - Usuario: ${req.user.email}`);

    const response: ApiResponse = {
      success: true,
      message: 'Entrada eliminada exitosamente',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};
