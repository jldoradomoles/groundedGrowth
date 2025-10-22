# Dockerfile para el backend de GroundedGrowth
FROM node:18-alpine

# Crear directorio de aplicación
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci --only=production

# Instalar TypeScript globalmente para el build
RUN npm install -g typescript

# Copiar código fuente
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Cambiar propietario de archivos
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exponer puerto
EXPOSE 3001

# Comando de inicio
CMD ["npm", "start"]