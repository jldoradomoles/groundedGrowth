"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// --- RUTAS PÚBLICAS --- //
// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', auth_controller_1.register);
// POST /api/auth/login - Iniciar sesión
router.post('/login', auth_controller_1.login);
// --- RUTAS PROTEGIDAS --- //
// GET /api/auth/profile - Obtener perfil del usuario autenticado
router.get('/profile', auth_middleware_1.authenticateToken, auth_controller_1.getProfile);
// POST /api/auth/verify - Verificar si el token es válido
router.post('/verify', auth_middleware_1.authenticateToken, auth_controller_1.verifyTokenEndpoint);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map