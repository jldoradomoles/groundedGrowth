// Configuración de ejemplo - COPIA este archivo como environment.ts
export const environment = {
  production: false,
  geminiApiKey: 'TU_API_KEY_AQUI', // Reemplazar con tu API key real de Google AI Studio
  openaiApiKey: 'TU_OPENAI_API_KEY_AQUI', // Reemplazar con tu API key real de OpenAI
};

// INSTRUCCIONES PARA CONFIGURAR LA API KEY:
//
// 1. Ve a https://makersuite.google.com/app/apikey (Google AI Studio)
// 2. Inicia sesión con tu cuenta de Google
// 3. Crea una nueva API key haciendo clic en "Create API Key"
// 4. Copia la API key generada
// 5. Copia este archivo como 'environment.ts' en la misma carpeta
// 6. Reemplaza 'TU_API_KEY_AQUI' con tu API key real
//
// IMPORTANTE:
// - La API key es personal y no debe ser compartida
// - No subas el archivo environment.ts a git (está en .gitignore)
// - En producción, usa variables de entorno del servidor
//
// NOTA: Si no configuras la API key, la app funcionará en modo simulación
