// Archivo de prueba para verificar que todo funciona
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
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
