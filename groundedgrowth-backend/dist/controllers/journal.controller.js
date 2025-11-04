"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJournalEntry = exports.updateJournalEntry = exports.getJournalEntryById = exports.createJournalEntry = exports.getJournalEntries = void 0;
const client_1 = require("@prisma/client");
const error_middleware_1 = require("../middleware/error.middleware");
const prisma = new client_1.PrismaClient();
// --- OBTENER TODAS LAS ENTRADAS DEL USUARIO --- //
const getJournalEntries = async (req, res, next) => {
    try {
        if (!req.user) {
            return next((0, error_middleware_1.createError)('Usuario no autenticado', 401));
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
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
        const response = {
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
    }
    catch (error) {
        next(error);
    }
};
exports.getJournalEntries = getJournalEntries;
// --- CREAR NUEVA ENTRADA --- //
const createJournalEntry = async (req, res, next) => {
    try {
        if (!req.user) {
            return next((0, error_middleware_1.createError)('Usuario no autenticado', 401));
        }
        const { content } = req.body;
        // Validaciones
        if (!content || content.trim().length < 10) {
            return next((0, error_middleware_1.createError)('La entrada debe tener al menos 10 caracteres', 400));
        }
        if (content.length > 10000) {
            return next((0, error_middleware_1.createError)('La entrada no puede exceder 10,000 caracteres', 400));
        }
        // Crear entrada
        const newEntry = await prisma.journalEntry.create({
            data: {
                userId: req.user.id,
                content: content.trim(),
            },
        });
        console.log(`✅ Entrada del diario creada - Usuario: ${req.user.email}`);
        const response = {
            success: true,
            data: newEntry,
            message: 'Entrada del diario creada exitosamente',
        };
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.createJournalEntry = createJournalEntry;
// --- OBTENER ENTRADA POR ID --- //
const getJournalEntryById = async (req, res, next) => {
    try {
        if (!req.user) {
            return next((0, error_middleware_1.createError)('Usuario no autenticado', 401));
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
            return next((0, error_middleware_1.createError)('Entrada no encontrada', 404));
        }
        const response = {
            success: true,
            data: entry,
            message: 'Entrada obtenida exitosamente',
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getJournalEntryById = getJournalEntryById;
// --- ACTUALIZAR ENTRADA --- //
const updateJournalEntry = async (req, res, next) => {
    try {
        if (!req.user) {
            return next((0, error_middleware_1.createError)('Usuario no autenticado', 401));
        }
        const { id } = req.params;
        const { content } = req.body;
        // Verificar que la entrada existe y pertenece al usuario
        const existingEntry = await prisma.journalEntry.findFirst({
            where: {
                id,
                userId: req.user.id,
            },
        });
        if (!existingEntry) {
            return next((0, error_middleware_1.createError)('Entrada no encontrada', 404));
        }
        // Validaciones
        if (!content || content.trim().length < 10) {
            return next((0, error_middleware_1.createError)('La entrada debe tener al menos 10 caracteres', 400));
        }
        if (content.length > 10000) {
            return next((0, error_middleware_1.createError)('La entrada no puede exceder 10,000 caracteres', 400));
        }
        // Actualizar entrada
        const updatedEntry = await prisma.journalEntry.update({
            where: { id },
            data: { content: content.trim() },
        });
        console.log(`✅ Entrada del diario actualizada - Usuario: ${req.user.email}`);
        const response = {
            success: true,
            data: updatedEntry,
            message: 'Entrada actualizada exitosamente',
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.updateJournalEntry = updateJournalEntry;
// --- ELIMINAR ENTRADA --- //
const deleteJournalEntry = async (req, res, next) => {
    try {
        if (!req.user) {
            return next((0, error_middleware_1.createError)('Usuario no autenticado', 401));
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
            return next((0, error_middleware_1.createError)('Entrada no encontrada', 404));
        }
        // Eliminar entrada (los análisis de IA se eliminarán automáticamente por CASCADE)
        await prisma.journalEntry.delete({
            where: { id },
        });
        console.log(`✅ Entrada del diario eliminada - Usuario: ${req.user.email}`);
        const response = {
            success: true,
            message: 'Entrada eliminada exitosamente',
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteJournalEntry = deleteJournalEntry;
//# sourceMappingURL=journal.controller.js.map