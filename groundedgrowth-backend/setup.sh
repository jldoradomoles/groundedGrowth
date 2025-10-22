#!/bin/bash

# Script para configurar el backend de GroundedGrowth
echo "🚀 Configurando backend de GroundedGrowth..."

# 1. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# 2. Generar cliente de Prisma
echo "🔧 Generando cliente de Prisma..."
npx prisma generate

# 3. Crear base de datos SQLite
echo "💾 Creando base de datos..."
npx prisma db push

# 4. Probar servidor
echo "🧪 Probando servidor..."
npm run test-server

echo "✅ Configuración completada!"