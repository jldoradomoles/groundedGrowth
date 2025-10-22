"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas de usuario requieren autenticación
router.use(auth_middleware_1.authenticateToken);
// GET /api/users/me - Obtener información del usuario actual
router.get('/me', (req, res) => {
    res.json({
        success: true,
        message: 'Ruta de usuario - próximamente',
    });
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map