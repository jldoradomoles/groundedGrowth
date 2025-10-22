"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    const start = Date.now();
    const { method, url, ip } = req;
    // Log de la request entrante
    console.log(`📥 ${method} ${url} - IP: ${ip}`);
    // Override del res.json para capturar la respuesta
    const originalJson = res.json;
    res.json = function (body) {
        const duration = Date.now() - start;
        const { statusCode } = res;
        // Log de la respuesta
        const statusEmoji = statusCode >= 400 ? '❌' : statusCode >= 300 ? '⚠️' : '✅';
        console.log(`📤 ${statusEmoji} ${method} ${url} - ${statusCode} - ${duration}ms`);
        return originalJson.call(this, body);
    };
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=logger.middleware.js.map