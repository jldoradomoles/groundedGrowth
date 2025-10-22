@echo off
echo 🚀 Configurando backend de GroundedGrowth...

echo 📦 Instalando dependencias...
call npm install

echo 🔧 Generando cliente de Prisma...
call npx prisma generate

echo 💾 Creando base de datos...
call npx prisma db push

echo 🧪 Servidor listo para usar
echo Ejecuta: npm run test-server

echo ✅ Configuración completada!
pause