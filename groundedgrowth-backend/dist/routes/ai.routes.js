"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const ai_controller_1 = require("../controllers/ai.controller");
const router = (0, express_1.Router)();
// Todas las rutas de IA requieren autenticación
router.use(auth_middleware_1.authenticateToken);
// POST /api/ai/analyze - Analizar entrada del journal
router.post('/analyze', ai_controller_1.analyzeJournalEntry);
// GET /api/ai/analyses - Obtener todos los análisis del usuario
router.get('/analyses', ai_controller_1.getUserAnalyses);
// GET /api/ai/analyses/:id - Obtener análisis por ID
router.get('/analyses/:id', ai_controller_1.getAnalysisById);
// GET /api/ai/entry/:journalEntryId - Obtener análisis de una entrada específica
router.get('/entry/:journalEntryId', ai_controller_1.getAnalysesForEntry);
// POST /api/ai/provider - Configurar proveedor de IA
router.post('/provider', ai_controller_1.setAIProvider);
exports.default = router;
//# sourceMappingURL=ai.routes.js.map