# GroundedGrowth - Configuración de la API de Gemini

## 🚀 Cómo configurar la integración con Gemini AI

### Paso 1: Obtener tu API Key

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Create API Key"**
4. Copia la API key generada

### Paso 2: Configurar la aplicación

1. Ve a la carpeta `src/app/config/`
2. Copia el archivo `environment.example.ts` y renómbralo a `environment.ts`
3. Abre `environment.ts` y reemplaza `'TU_API_KEY_AQUI'` con tu API key real

```typescript
export const environment = {
  production: false,
  geminiApiKey: 'tu-api-key-real-aqui',
};
```

### Paso 3: ¡Listo para usar!

- Si **tienes** API key configurada: La app usará Gemini AI real para análisis personalizados
- Si **no tienes** API key: La app funcionará en modo simulación con respuestas de ejemplo

## 🔒 Seguridad

- ❌ **NUNCA** subas tu API key a git
- ✅ El archivo `environment.ts` está en `.gitignore`
- ✅ En producción, usa variables de entorno del servidor

## 🧠 Funcionalidades de IA

Con la API configurada, GroundedGrowth puede:

- Analizar tus entradas de diario
- Conectar tus reflexiones con tus metas personales
- Ofrecer insights y patrones personalizados
- Sugerir acciones concretas para tu crecimiento
- Mantener un tono empático y de apoyo

## 💡 Modo Simulación

Si no configuras la API key, verás:

- Respuestas de ejemplo que demuestran la funcionalidad
- Mensaje indicando que es simulación
- Todos los componentes funcionando normalmente
