"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Archivo de prueba para verificar que todo funciona
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.get('/test', (req, res) => {
    res.json({
        message: '🚀 Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        port: PORT,
    });
});
app.listen(PORT, () => {
    console.log(`✅ Servidor de prueba funcionando en puerto ${PORT}`);
    console.log(`🔗 Prueba: http://localhost:${PORT}/test`);
});
//# sourceMappingURL=test-server.js.map