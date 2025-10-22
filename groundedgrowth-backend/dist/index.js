"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
// Importar rutas
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const goal_routes_1 = __importDefault(require("./routes/goal.routes"));
const journal_routes_1 = __importDefault(require("./routes/journal.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
// Importar middleware
const error_middleware_1 = require("./middleware/error.middleware");
const logger_middleware_1 = require("./middleware/logger.middleware");
// Cargar variables de entorno
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// --- CONFIGURACIÓN DE MIDDLEWARE --- //
// Seguridad básica
app.use((0, helmet_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana de tiempo
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
});
app.use(limiter);
// CORS
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
}));
// Parsing de JSON
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Logger de requests
app.use(logger_middleware_1.requestLogger);
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
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/goals', goal_routes_1.default);
app.use('/api/journal', journal_routes_1.default);
app.use('/api/ai', ai_routes_1.default);
// Ruta 404
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint no encontrado',
        path: req.originalUrl,
        method: req.method,
    });
});
// Manejo de errores
app.use(error_middleware_1.errorHandler);
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
exports.default = app;
//# sourceMappingURL=index.js.map