@echo off
REM Script de despliegue para Windows - GroundedGrowth

echo 🚀 Iniciando despliegue de GroundedGrowth...

REM Verificar que Docker esté instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker no está instalado. Por favor instala Docker Desktop primero.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose no está instalado. Por favor instala Docker Desktop primero.
    pause
    exit /b 1
)

REM Verificar archivo de variables de entorno
if not exist .env.production (
    echo ❌ Archivo .env.production no encontrado.
    echo    Por favor crea el archivo .env.production y configura las variables.
    pause
    exit /b 1
)

echo ✅ Verificaciones completadas

REM Construir imágenes
echo 🔨 Construyendo imágenes Docker...
docker-compose -f docker-compose.prod.yml build

REM Detener contenedores existentes
echo 🛑 Deteniendo contenedores existentes...
docker-compose -f docker-compose.prod.yml down

REM Ejecutar migraciones de base de datos
echo 📄 Ejecutando migraciones de base de datos...
docker-compose -f docker-compose.prod.yml run --rm backend npx prisma migrate deploy

REM Iniciar servicios
echo 🚀 Iniciando servicios...
docker-compose -f docker-compose.prod.yml up -d

REM Mostrar estado
echo 📊 Estado de los servicios:
docker-compose -f docker-compose.prod.yml ps

echo ✅ Despliegue completado!
echo 🌐 La aplicación estará disponible en:
echo    Frontend: http://localhost
echo    Backend API: http://localhost:3001
echo.
echo 📝 Para ver logs:
echo    docker-compose -f docker-compose.prod.yml logs -f
pause