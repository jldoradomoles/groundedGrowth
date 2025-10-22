#!/bin/bash
# Script de despliegue para GroundedGrowth

echo "🚀 Iniciando despliegue de GroundedGrowth..."

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Verificar archivo de variables de entorno
if [ ! -f .env.production ]; then
    echo "❌ Archivo .env.production no encontrado."
    echo "   Por favor copia .env.production.example a .env.production y configura las variables."
    exit 1
fi

echo "✅ Verificaciones completadas"

# Construir imágenes
echo "🔨 Construyendo imágenes Docker..."
docker-compose -f docker-compose.prod.yml build

# Detener contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose -f docker-compose.prod.yml down

# Ejecutar migraciones de base de datos
echo "📄 Ejecutando migraciones de base de datos..."
docker-compose -f docker-compose.prod.yml run --rm backend npx prisma migrate deploy

# Iniciar servicios
echo "🚀 Iniciando servicios..."
docker-compose -f docker-compose.prod.yml up -d

# Mostrar estado
echo "📊 Estado de los servicios:"
docker-compose -f docker-compose.prod.yml ps

echo "✅ Despliegue completado!"
echo "🌐 La aplicación estará disponible en:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:3001"
echo ""
echo "📝 Para ver logs:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"