"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAIProvider = exports.getUserAnalyses = exports.getAnalysisById = exports.getAnalysesForEntry = exports.analyzeJournalEntry = void 0;
const client_1 = require("@prisma/client");
const error_middleware_1 = require("../middleware/error.middleware");
const ai_analysis_service_1 = require("../services/ai-analysis.service");
const prisma = new client_1.PrismaClient();
const aiService = new ai_analysis_service_1.AIAnalysisService();
// --- ANALIZAR ENTRADA DEL DIARIO --- //
const analyzeJournalEntry = async (req, res, next) => {
    try {
        if (!req.user) {
            return next((0, error_middleware_1.createError)('Usuario no autenticado', 401));
        }
        const { journalEntryId, goalIds, aiProvider } = req.body;
        // Validaciones
        if (!journalEntryId) {
            return next((0, error_middleware_1.createError)('ID de entrada del diario requerido', 400));
        }
        // Verificar que la entrada existe y pertenece al usuario
        const journalEntry = await prisma.journalEntry.findFirst({
            where: {
                id: journalEntryId,
                userId: req.user.id
            }
        });
        if (!journalEntry) {
            return next((0, error_middleware_1.createError)('Entrada del diario no encontrada', 404));
        }
        // Obtener metas del usuario (todas si no se especifican IDs)
        let goals = [];
        if (goalIds && goalIds.length > 0) {
            const userGoals = await prisma.goal.findMany({
                where: {
                    id: { in: goalIds },
                    userId: req.user.id,
                    isActive: true
                },
                select: { title: true }
            });
            goals = userGoals.map(g => g.title);
        }
        else {
            // Si no se especifican metas, usar todas las activas
            const userGoals = await prisma.goal.findMany({
                where: {
                    userId: req.user.id,
                    isActive: true
                },
                select: { title: true },
                take: 5 // Limitar a 5 metas para no sobrecargar el prompt
            });
            goals = userGoals.map(g => g.title);
        }
        console.log(`🤖 Iniciando análisis para usuario: ${req.user.email}`);
        console.log(`📝 Entrada: ${journalEntry.content.substring(0, 100)}...`);
        console.log(`🎯 Metas: ${goals.join(', ')}`);
        // Realizar análisis con IA
        const analysisResult = await aiService.analyzeJournalEntry(journalEntry.content, goals, aiProvider);
        // Guardar análisis en la base de datos
        const newAnalysis = await prisma.aIAnalysis.create({
            data: {
                userId: req.user.id,
                journalEntryId: journalEntryId,
                analysisContent: analysisResult.analysis,
                aiProvider: analysisResult.aiProvider
            }
        });
        console.log(`✅ Análisis guardado con proveedor: ${analysisResult.aiProvider}`);
        const response = {
            success: true,
            data: newAnalysis,
            message: 'Análisis completado y guardado exitosamente'
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error('❌ Error en análisis:', error);
        next(error);
    }
};
exports.analyzeJournalEntry = analyzeJournalEntry;
// --- OBTENER ANÁLISIS DE UNA ENTRADA --- //
const getAnalysesForEntry = async (req, res, next) => {
    try {
        if (!req.user) {
            return next((0, error_middleware_1.createError)('Usuario no autenticado', 401));
        }
        const { journalEntryId } = req.params;
        // Verificar que la entrada existe y pertenece al usuario
        const journalEntry = await prisma.journalEntry.findFirst({
            where: {
                id: journalEntryId,
                userId: req.user.id
            }
        });
        if (!journalEntry) {
            return next((0, error_middleware_1.createError)('Entrada del diario no encontrada', 404));
        }
        // Obtener todos los análisis de esta entrada
        const analyses = await prisma.aIAnalysis.findMany({
            where: {
                journalEntryId: journalEntryId,
                userId: req.user.id
            },
            orderBy: { createdAt: 'desc' }
        });
        const response = {
            success: true,
            data: analyses,
            message: 'Análisis obtenidos exitosamente'
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getAnalysesForEntry = getAnalysesForEntry;
// --- OBTENER ANÁLISIS POR ID --- //
const getAnalysisById = async (req, res, next) => {
    try {
        if (!req.user) {
            return next((0, error_middleware_1.createError)('Usuario no autenticado', 401));
        }
        const { id } = req.params;
        const analysis = await prisma.aIAnalysis.findFirst({
            where: {
                id,
                userId: req.user.id
            },
            include: {
                journalEntry: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true
                    }
                }
            }
        });
        if (!analysis) {
            return next((0, error_middleware_1.createError)('Análisis no encontrado', 404));
        }
        const response = {
            success: true,
            data: analysis,
            message: 'Análisis obtenido exitosamente'
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getAnalysisById = getAnalysisById;
// --- OBTENER TODOS LOS ANÁLISIS DEL USUARIO --- //
const getUserAnalyses = async (req, res, next) => {
    try {
        if (!req.user) {
            return next((0, error_middleware_1.createError)('Usuario no autenticado', 401));
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [analyses, total] = await Promise.all([
            prisma.aIAnalysis.findMany({
                where: { userId: req.user.id },
                include: {
                    journalEntry: {
                        select: {
                            id: true,
                            content: true,
                            createdAt: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.aIAnalysis.count({
                where: { userId: req.user.id }
            })
        ]);
        const totalPages = Math.ceil(total / limit);
        const response = {
            success: true,
            data: analyses,
            pagination: {
                page,
                limit,
                total,
                totalPages
            },
            message: 'Análisis obtenidos exitosamente'
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserAnalyses = getUserAnalyses;
// --- CONFIGURAR PROVEEDOR DE IA --- //
const setAIProvider = async (req, res, next) => {
    try {
        const { provider } = req.body;
        if (!['gemini', 'openai', 'auto'].includes(provider)) {
            return next((0, error_middleware_1.createError)('Proveedor de IA inválido. Valores permitidos: gemini, openai, auto', 400));
        }
        aiService.setPreferredProvider(provider);
        const response = {
            success: true,
            data: { provider },
            message: `Proveedor de IA configurado a: ${provider}`
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.setAIProvider = setAIProvider;
//# sourceMappingURL=ai.controller.js.map