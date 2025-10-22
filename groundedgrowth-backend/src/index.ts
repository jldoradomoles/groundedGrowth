import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import goalRoutes from './routes/goal.routes';
import journalRoutes from './routes/journal.routes';
import aiRoutes from './routes/ai.routes';

// Importar middleware
import { errorHandler } from './middleware/error.middleware';
import { requestLogger } from './middleware/logger.middleware';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- CONFIGURACIÓN DE MIDDLEWARE --- //

// Seguridad básica
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana de tiempo
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
});
app.use(limiter);

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  })
);

// Parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger de requests
app.use(requestLogger);

// --- RUTAS --- //

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'GroundedGrowth API',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/ai', aiRoutes);

// Ruta 404 - middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method,
  });
});

// Manejo de errores
app.use(errorHandler);

// --- INICIAR SERVIDOR --- //

app.listen(PORT, () => {
  console.log('🚀 GroundedGrowth API iniciada');
  console.log(`📡 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);

  if (process.env.NODE_ENV === 'development') {
    console.log(`🎯 Frontend: ${process.env.CORS_ORIGIN}`);
  }
});

export default app;
