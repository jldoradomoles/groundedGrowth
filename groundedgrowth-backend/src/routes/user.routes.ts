import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas de usuario requieren autenticación
router.use(authenticateToken);

// GET /api/users/me - Obtener información del usuario actual
router.get('/me', (req, res) => {
  res.json({
    success: true,
    message: 'Ruta de usuario - próximamente',
  });
});

export default router;
