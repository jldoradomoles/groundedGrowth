"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAnalysisService = void 0;
const gemini_service_1 = require("./gemini.service");
const openai_service_1 = require("./openai.service");
class AIAnalysisService {
    constructor(preferredProvider = 'auto') {
        this.geminiService = new gemini_service_1.GeminiService();
        this.openaiService = new openai_service_1.OpenAIService();
        this.preferredProvider = preferredProvider;
        console.log(`🤖 Servicio de Análisis IA inicializado con proveedor: ${preferredProvider}`);
    }
    async analyzeJournalEntry(entry, goals, provider) {
        const selectedProvider = provider || this.preferredProvider;
        console.log(`🔄 Iniciando análisis con proveedor: ${selectedProvider}`);
        if (selectedProvider === 'gemini') {
            const analysis = await this.geminiService.analyzeJournalEntry(entry, goals);
            return {
                analysis,
                aiProvider: 'gemini'
            };
        }
        else if (selectedProvider === 'openai') {
            const analysis = await this.openaiService.analyzeJournalEntry(entry, goals);
            return {
                analysis,
                aiProvider: 'openai'
            };
        }
        else {
            // Modo 'auto': Intentar OpenAI primero, luego Gemini
            return this.tryWithFallback(entry, goals);
        }
    }
    async tryWithFallback(entry, goals) {
        console.log('🔄 Modo automático: Intentando OpenAI primero...');
        try {
            // Intentar con OpenAI primero
            const openaiAnalysis = await this.openaiService.analyzeJournalEntry(entry, goals);
            // Si la respuesta contiene "simulación", significa que OpenAI no está disponible
            if (openaiAnalysis.includes('simulación de OpenAI') || openaiAnalysis.includes('análisis de respaldo')) {
                console.log('🔄 OpenAI no disponible, intentando con Gemini...');
                const geminiAnalysis = await this.geminiService.analyzeJournalEntry(entry, goals);
                return {
                    analysis: geminiAnalysis,
                    aiProvider: geminiAnalysis.includes('análisis de respaldo') ? 'local' : 'gemini'
                };
            }
            console.log('✅ Análisis completado con OpenAI');
            return {
                analysis: openaiAnalysis,
                aiProvider: 'openai'
            };
        }
        catch (error) {
            console.log('🔄 Error con OpenAI, intentando con Gemini...', error);
            try {
                const geminiAnalysis = await this.geminiService.analyzeJournalEntry(entry, goals);
                console.log('✅ Análisis completado con Gemini como fallback');
                return {
                    analysis: geminiAnalysis,
                    aiProvider: geminiAnalysis.includes('análisis de respaldo') ? 'local' : 'gemini'
                };
            }
            catch (geminiError) {
                console.error('❌ Ambos servicios fallaron:', geminiError);
                // Última opción: análisis local
                return {
                    analysis: this.getLocalFallbackAnalysis(entry, goals),
                    aiProvider: 'local'
                };
            }
        }
    }
    getLocalFallbackAnalysis(entry, goals) {
        console.log('🔄 Usando análisis local como último recurso...');
        const goalsList = goals.length > 0
            ? goals.map(g => `<strong>${g}</strong>`).join(', ')
            : 'tus objetivos personales';
        return `
      <h4>Análisis Básico de tu Reflexión</h4>
      <p>He procesado tu entrada de manera local. Aunque no puedo acceder a servicios de IA avanzados en este momento, puedo ofrecerte algunas reflexiones basadas en ${goalsList}.</p>
      
      <h4>Observaciones Generales</h4>
      <p>Tu capacidad de reflexionar por escrito es un excelente hábito para el crecimiento personal. El simple acto de poner tus pensamientos en palabras ya es un paso valioso hacia una mayor autoconciencia.</p>
      
      <h4>Sugerencia Práctica</h4>
      <ul>
        <li>Continúa escribiendo regularmente. La consistencia en la reflexión personal es más valiosa que la perfección de cada entrada individual.</li>
        <li>Considera revisar tus entradas anteriores semanalmente para identificar patrones y progreso.</li>
      </ul>
      
      <p><strong>Nota:</strong> Este es un análisis básico local. Para obtener insights más profundos y personalizados, configura una API key de OpenAI o Gemini en las variables de entorno del servidor.</p>
    `;
    }
    // Método para cambiar el proveedor preferido
    setPreferredProvider(provider) {
        this.preferredProvider = provider;
        console.log(`📋 Proveedor cambiado a: ${provider}`);
    }
    // Método para obtener el proveedor actual
    getPreferredProvider() {
        return this.preferredProvider;
    }
}
exports.AIAnalysisService = AIAnalysisService;
//# sourceMappingURL=ai-analysis.service.js.map