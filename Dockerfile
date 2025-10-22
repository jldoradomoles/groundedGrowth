# Multi-stage Dockerfile para el frontend Angular

# Etapa 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build para producción
RUN npm run build

# Etapa 2: Servidor web
FROM nginx:alpine

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos build
COPY --from=build /app/dist/grounded-growth /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]