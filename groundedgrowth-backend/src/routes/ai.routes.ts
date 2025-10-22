import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  analyzeJournalEntry,
  getAnalysesForEntry,
  getAnalysisById,
  getUserAnalyses,
  setAIProvider,
} from '../controllers/ai.controller';

const router = Router();

// Todas las rutas de IA requieren autenticación
router.use(authenticateToken);

// POST /api/ai/analyze - Analizar entrada del journal
router.post('/analyze', analyzeJournalEntry);

// GET /api/ai/analyses - Obtener todos los análisis del usuario
router.get('/analyses', getUserAnalyses);

// GET /api/ai/analyses/:id - Obtener análisis por ID
router.get('/analyses/:id', getAnalysisById);

// GET /api/ai/entry/:journalEntryId - Obtener análisis de una entrada específica
router.get('/entry/:journalEntryId', getAnalysesForEntry);

// POST /api/ai/provider - Configurar proveedor de IA
router.post('/provider', setAIProvider);

export default router;
