import { Router } from 'express';
import { register, login, getProfile, verifyTokenEndpoint } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// --- RUTAS PÚBLICAS --- //

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// --- RUTAS PROTEGIDAS --- //

// GET /api/auth/profile - Obtener perfil del usuario autenticado
router.get('/profile', authenticateToken, getProfile);

// POST /api/auth/verify - Verificar si el token es válido
router.post('/verify', authenticateToken, verifyTokenEndpoint);

export default router;
