"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const journal_controller_1 = require("../controllers/journal.controller");
const router = (0, express_1.Router)();
// Todas las rutas de journal requieren autenticación
router.use(auth_middleware_1.authenticateToken);
// GET /api/journal - Obtener todas las entradas del usuario
router.get('/', journal_controller_1.getJournalEntries);
// POST /api/journal - Crear nueva entrada
router.post('/', journal_controller_1.createJournalEntry);
// GET /api/journal/:id - Obtener entrada por ID
router.get('/:id', journal_controller_1.getJournalEntryById);
// PUT /api/journal/:id - Actualizar entrada
router.put('/:id', journal_controller_1.updateJournalEntry);
// DELETE /api/journal/:id - Eliminar entrada
router.delete('/:id', journal_controller_1.deleteJournalEntry);
exports.default = router;
//# sourceMappingURL=journal.routes.js.map