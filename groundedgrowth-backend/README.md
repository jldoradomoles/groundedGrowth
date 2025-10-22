# 🚀 GroundedGrowth Backend API

Backend API para la aplicación de crecimiento personal GroundedGrowth.

## 🛠️ Stack Tecnológico

- **Node.js** + **Express** - Framework web
- **TypeScript** - Tipado estático
- **Prisma** - ORM moderno para base de datos
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación
- **bcryptjs** - Hashing de contraseñas

## 📦 Instalación

```bash
# Clonar e instalar dependencias
npm install

# Copiar archivo de entorno
cp .env.example .env
```

## ⚙️ Configuración

Edita el archivo `.env`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/groundedgrowth?schema=public"

# JWT
JWT_SECRET="tu-clave-secreta-super-segura"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:4200"
```

## 🗄️ Base de Datos

### Configurar PostgreSQL

1. **Instalar PostgreSQL** (si no lo tienes):

   - Windows: [Descargar PostgreSQL](https://www.postgresql.org/download/windows/)
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Crear base de datos:**
   ```sql
   CREATE DATABASE groundedgrowth;
   CREATE USER groundedgrowth_user WITH PASSWORD 'tu_password';
   GRANT ALL PRIVILEGES ON DATABASE groundedgrowth TO groundedgrowth_user;
   ```

### Migraciones con Prisma

```bash
# Generar cliente de Prisma
npm run db:generate

# Crear y aplicar migración
npm run db:migrate

# Ver base de datos en navegador
npm run db:studio
```

## 🚀 Ejecutar

### Configuración inicial (solo primera vez)

**Windows:**

```cmd
setup.bat
```

**Linux/Mac:**

```bash
chmod +x setup.sh
./setup.sh
```

**Manual:**

```bash
# 1. Instalar dependencias
npm install

# 2. Generar cliente de Prisma
npx prisma generate

# 3. Crear base de datos
npx prisma db push
```

### Ejecutar servidor

```bash
# Desarrollo (con hot reload)
npm run dev

# Servidor de prueba (para debugging)
npm run test-server

# Producción
npm run build
npm start
```

### 🚨 Solución de problemas

Si el servidor se crashea:

1. **Verificar dependencias:**

   ```bash
   npm install
   ```

2. **Regenerar Prisma:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Probar servidor simple:**

   ```bash
   npm run test-server
   ```

4. **Verificar archivo .env:**
   - Debe existir en la raíz del backend
   - DATABASE_URL debe estar configurada

## 📚 API Endpoints

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint    | Descripción       | Auth |
| ------ | ----------- | ----------------- | ---- |
| POST   | `/register` | Registrar usuario | ❌   |
| POST   | `/login`    | Iniciar sesión    | ❌   |
| GET    | `/profile`  | Obtener perfil    | ✅   |
| POST   | `/verify`   | Verificar token   | ✅   |

### 👤 Usuarios (`/api/users`)

| Método | Endpoint | Descripción         | Auth |
| ------ | -------- | ------------------- | ---- |
| GET    | `/me`    | Información usuario | ✅   |

### 🎯 Metas (`/api/goals`)

| Método | Endpoint | Descripción     | Auth |
| ------ | -------- | --------------- | ---- |
| GET    | `/`      | Listar metas    | ✅   |
| POST   | `/`      | Crear meta      | ✅   |
| PUT    | `/:id`   | Actualizar meta | ✅   |
| DELETE | `/:id`   | Eliminar meta   | ✅   |

### 📖 Journal (`/api/journal`)

| Método | Endpoint | Descripción        | Auth |
| ------ | -------- | ------------------ | ---- |
| GET    | `/`      | Listar entradas    | ✅   |
| POST   | `/`      | Crear entrada      | ✅   |
| PUT    | `/:id`   | Actualizar entrada | ✅   |
| DELETE | `/:id`   | Eliminar entrada   | ✅   |

### 🤖 IA (`/api/ai`)

| Método | Endpoint   | Descripción      | Auth |
| ------ | ---------- | ---------------- | ---- |
| POST   | `/analyze` | Analizar entrada | ✅   |

## 🏗️ Estructura del Proyecto

```
src/
├── controllers/     # Lógica de negocio
├── middleware/      # Middleware personalizado
├── routes/         # Definición de rutas
├── services/       # Servicios (IA, email, etc.)
├── types/          # Tipos TypeScript
├── utils/          # Utilidades
└── index.ts        # Punto de entrada
```

## 🔧 Scripts Disponibles

```bash
npm run dev         # Desarrollo con hot reload
npm run build       # Compilar TypeScript
npm start           # Ejecutar en producción
npm run db:generate # Generar cliente Prisma
npm run db:migrate  # Ejecutar migraciones
npm run db:push     # Push schema a DB
npm run db:studio   # Abrir Prisma Studio
```

## 🔒 Seguridad

- ✅ Helmet para headers de seguridad
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Validación de inputs
- ✅ Hashing de contraseñas con bcrypt
- ✅ JWT para autenticación

## 📝 Modelo de Datos

```
User (Usuarios)
├── Goals (Metas)
├── JournalEntries (Entradas)
└── AIAnalyses (Análisis IA)
```

## 🧪 Testing

```bash
# Ejecutar tests (próximamente)
npm test
```

## 🚀 Despliegue

### Variables de Entorno en Producción

Asegúrate de configurar:

- `NODE_ENV=production`
- `JWT_SECRET` (clave fuerte)
- `DATABASE_URL` (PostgreSQL en producción)

### Plataformas Recomendadas

- **Railway** - Simple y con PostgreSQL incluido
- **Heroku** - Clásico, con addon de PostgreSQL
- **DigitalOcean App Platform** - Moderno y escalable
