import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  getJournalEntries,
  createJournalEntry,
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry,
} from '../controllers/journal.controller';

const router = Router();

// Todas las rutas de journal requieren autenticación
router.use(authenticateToken);

// GET /api/journal - Obtener todas las entradas del usuario
router.get('/', getJournalEntries);

// POST /api/journal - Crear nueva entrada
router.post('/', createJournalEntry);

// GET /api/journal/:id - Obtener entrada por ID
router.get('/:id', getJournalEntryById);

// PUT /api/journal/:id - Actualizar entrada
router.put('/:id', updateJournalEntry);

// DELETE /api/journal/:id - Eliminar entrada
router.delete('/:id', deleteJournalEntry);

export default router;
