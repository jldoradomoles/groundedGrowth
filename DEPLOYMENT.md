# 🌱 GroundedGrowth - Guía de Despliegue en Producción

## 📋 Requisitos Previos

### Software Necesario

- **Docker** y **Docker Compose** instalados
- **Node.js 18+** (para desarrollo local)
- **Git** para clonar el repositorio

### APIs Externas (Opcionales)

- **OpenAI API Key** - Para análisis IA con GPT-3.5/GPT-4

## 🚀 Despliegue Rápido con Docker

### 1. Clonar el Repositorio

```bash
git clone <tu-repositorio>
cd groundedGrowth
```

### 2. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.production.example .env.production

# Editar variables (IMPORTANTE: cambiar todas las claves)
nano .env.production
```

**Variables requeridas en `.env.production`:**

```env
# Base de datos
POSTGRES_PASSWORD=tu_password_super_seguro
DATABASE_URL=postgresql://groundedgrowth:tu_password_super_seguro@postgres:5432/groundedgrowth_prod

# JWT (generar una clave de 64+ caracteres)
JWT_SECRET=tu_jwt_secret_muy_largo_y_seguro

# API de IA (opcional)
OPENAI_API_KEY=sk-tu_clave_openai

# Puertos
BACKEND_PORT=3001
FRONTEND_PORT=80
```

### 3. Ejecutar Despliegue

**En Linux/Mac:**

```bash
chmod +x deploy.sh
./deploy.sh
```

**En Windows:**

```cmd
deploy.bat
```

### 4. Verificar Despliegue

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001
- **Documentación API**: http://localhost:3001/api/docs (si está configurada)

## 🔧 Despliegue Manual

### Frontend (Angular)

```bash
# Build para producción
npm run build:prod

# Construir imagen Docker
docker build -t groundedgrowth-frontend .

# Ejecutar contenedor
docker run -p 80:80 groundedgrowth-frontend
```

### Backend (Node.js + Express)

```bash
cd groundedgrowth-backend

# Instalar dependencias
npm ci --only=production

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Compilar TypeScript
npm run build

# Iniciar servidor
npm start
```

## 🌐 Despliegue en Proveedores Cloud

### Vercel (Frontend)

1. Conectar repositorio a Vercel
2. Configurar build command: `npm run build:prod`
3. Configurar output directory: `dist/grounded-growth`
4. Agregar variables de entorno en el dashboard

### Railway/Render (Backend)

1. Conectar repositorio
2. Configurar directorio: `groundedgrowth-backend`
3. Agregar variables de entorno
4. Configurar base de datos PostgreSQL

### DigitalOcean App Platform

1. Crear nueva app desde repositorio
2. Configurar servicios:
   - **Frontend**: Static Site (directorio raíz)
   - **Backend**: Web Service (directorio `groundedgrowth-backend`)
   - **Database**: PostgreSQL

## 🛠️ Configuración Avanzada

### Variables de Entorno del Backend

```env
# Servidor
NODE_ENV=production
PORT=3001

# Base de datos
DATABASE_URL=postgresql://user:password@host:5432/database

# Autenticación
JWT_SECRET=tu-secret-key
JWT_EXPIRES_IN=7d

# API externa
OPENAI_API_KEY=sk-...

# CORS
FRONTEND_URL=https://tu-dominio.com
```

### Nginx con SSL (Opcional)

```nginx
server {
    listen 443 ssl;
    server_name tu-dominio.com;

    ssl_certificate /path/to/certificate.pem;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 Monitoreo y Logs

### Ver Logs en Tiempo Real

```bash
# Todos los servicios
docker-compose -f docker-compose.prod.yml logs -f

# Solo backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Solo frontend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Comandos Útiles

```bash
# Estado de servicios
docker-compose -f docker-compose.prod.yml ps

# Reiniciar servicio específico
docker-compose -f docker-compose.prod.yml restart backend

# Acceder a contenedor
docker-compose -f docker-compose.prod.yml exec backend sh

# Backup de base de datos
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U groundedgrowth groundedgrowth_prod > backup.sql
```

## 🔐 Seguridad

### Checklist de Seguridad

- [ ] Cambiar todas las claves por defecto
- [ ] Usar HTTPS en producción
- [ ] Configurar firewall adecuadamente
- [ ] Actualizar dependencias regularmente
- [ ] Configurar backups automáticos
- [ ] Monitorear logs de seguridad

### Headers de Seguridad (ya incluidos)

- Helmet.js para headers básicos
- CORS configurado correctamente
- Rate limiting implementado
- Validación de entrada en todas las APIs

## 🆘 Resolución de Problemas

### Error: "Database connection failed"

1. Verificar variables de entorno de base de datos
2. Comprobar que PostgreSQL esté ejecutándose
3. Verificar conectividad de red

### Error: "JWT token invalid"

1. Verificar que JWT_SECRET esté configurado
2. Comprobar formato del token
3. Verificar expiración del token

### Error: "CORS blocked"

1. Verificar FRONTEND_URL en variables de entorno
2. Comprobar configuración CORS en backend
3. Verificar que el dominio sea correcto

## 🔄 Actualizaciones

### Actualizar Aplicación

```bash
# Pull cambios
git pull origin main

# Reconstruir y redesplegar
./deploy.sh
```

### Rollback a Versión Anterior

```bash
# Ver imágenes disponibles
docker images

# Usar imagen anterior
docker-compose -f docker-compose.prod.yml down
docker tag groundedgrowth-backend:backup groundedgrowth-backend:latest
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📞 Soporte

Para problemas o preguntas:

1. Revisar logs con `docker-compose logs`
2. Consultar esta documentación
3. Crear issue en el repositorio

**¡Tu aplicación GroundedGrowth está lista para producción! 🎉**
