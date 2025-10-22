"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
class GeminiService {
    constructor() {
        this.genAI = null;
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
            console.log('✅ Servicio Gemini inicializado');
        }
        else {
            console.log('⚠️ GEMINI_API_KEY no configurada - usando simulación');
        }
    }
    async analyzeJournalEntry(entry, goals) {
        if (!this.genAI) {
            return this.getSimulatedAnalysis(entry, goals);
        }
        try {
            const model = this.genAI.getGenerativeModel({
                model: 'models/gemini-1.5-flash'
            });
            const prompt = this.buildPrompt(entry, goals);
            console.log('🤖 Enviando solicitud a Gemini...');
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log('✅ Análisis de Gemini completado');
            return this.formatResponse(text);
        }
        catch (error) {
            console.error('❌ Error en Gemini:', error);
            // Intentar con modelo alternativo
            if (error.status === 404) {
                return this.tryAlternativeModel(entry, goals);
            }
            return this.getSimulatedAnalysis(entry, goals);
        }
    }
    async tryAlternativeModel(entry, goals) {
        if (!this.genAI) {
            return this.getSimulatedAnalysis(entry, goals);
        }
        try {
            console.log('🔄 Intentando con modelo alternativo...');
            const model = this.genAI.getGenerativeModel({
                model: 'gemini-1.5-flash-latest'
            });
            const prompt = this.buildPrompt(entry, goals);
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log('✅ Análisis completado con modelo alternativo');
            return this.formatResponse(text);
        }
        catch (error) {
            console.error('❌ Error con modelo alternativo:', error);
            return this.getSimulatedAnalysis(entry, goals);
        }
    }
    buildPrompt(entry, goals) {
        const goalsText = goals.length > 0
            ? `Metas del usuario:\n${goals.map(g => `- ${g}`).join('\n')}\n\n`
            : '';
        return `
Eres un coach de crecimiento personal experto. Analiza la siguiente entrada de diario y proporciona insights útiles.

${goalsText}Entrada del diario:
"${entry}"

Por favor, proporciona un análisis que incluya:
1. Patrones emocionales identificados
2. Fortalezas observadas
3. Áreas de oportunidad
4. Recomendaciones específicas
5. Conexión con las metas (si aplica)

Responde en formato HTML con estructura clara y profesional.
`;
    }
    formatResponse(text) {
        // Limpiar y formatear la respuesta
        let formatted = text.trim();
        // Si no tiene HTML, agregarlo
        if (!formatted.includes('<')) {
            formatted = `<div class="ai-analysis">${formatted.replace(/\n/g, '<br>')}</div>`;
        }
        return formatted;
    }
    getSimulatedAnalysis(entry, goals) {
        const goalsList = goals.length > 0
            ? goals.map(g => `<strong>${g}</strong>`).join(', ')
            : 'tus objetivos personales';
        return `
      <h4>Análisis de tu Reflexión Personal</h4>
      <p>He analizado tu entrada utilizando técnicas de procesamiento de lenguaje natural. Aunque no puedo acceder a Gemini en este momento, puedo ofrecerte algunas observaciones basadas en ${goalsList}.</p>
      
      <h4>Observaciones Generales</h4>
      <p>Tu capacidad de reflexionar por escrito demuestra un compromiso genuino con tu crecimiento personal. Esta práctica constante es fundamental para desarrollar mayor autoconciencia.</p>
      
      <h4>Recomendaciones</h4>
      <ul>
        <li>Continúa escribiendo con regularidad para mantener el hábito de reflexión</li>
        <li>Considera revisar entradas anteriores para identificar patrones de crecimiento</li>
      </ul>
      
      <p><strong>Nota:</strong> Este es un análisis de respaldo. Para obtener insights más profundos, configura tu API key de Gemini.</p>
    `;
    }
}
exports.GeminiService = GeminiService;
//# sourceMappingURL=gemini.service.js.map