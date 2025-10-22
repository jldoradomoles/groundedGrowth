"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const goal_controller_1 = require("../controllers/goal.controller");
const router = (0, express_1.Router)();
// Todas las rutas de metas requieren autenticación
router.use(auth_middleware_1.authenticateToken);
// GET /api/goals - Obtener todas las metas del usuario
router.get('/', goal_controller_1.getGoals);
// POST /api/goals - Crear nueva meta
router.post('/', goal_controller_1.createGoal);
// GET /api/goals/:id - Obtener meta por ID
router.get('/:id', goal_controller_1.getGoalById);
// PUT /api/goals/:id - Actualizar meta
router.put('/:id', goal_controller_1.updateGoal);
// DELETE /api/goals/:id - Eliminar meta
router.delete('/:id', goal_controller_1.deleteGoal);
exports.default = router;
//# sourceMappingURL=goal.routes.js.map