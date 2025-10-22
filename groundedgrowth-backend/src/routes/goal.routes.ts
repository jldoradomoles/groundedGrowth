import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  getGoals,
  createGoal,
  getGoalById,
  updateGoal,
  deleteGoal,
} from '../controllers/goal.controller';

const router = Router();

// Todas las rutas de metas requieren autenticación
router.use(authenticateToken);

// GET /api/goals - Obtener todas las metas del usuario
router.get('/', getGoals);

// POST /api/goals - Crear nueva meta
router.post('/', createGoal);

// GET /api/goals/:id - Obtener meta por ID
router.get('/:id', getGoalById);

// PUT /api/goals/:id - Actualizar meta
router.put('/:id', updateGoal);

// DELETE /api/goals/:id - Eliminar meta
router.delete('/:id', deleteGoal);

export default router;
