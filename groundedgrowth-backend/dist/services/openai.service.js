"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIService = void 0;
const openai_1 = __importDefault(require("openai"));
class OpenAIService {
    constructor() {
        this.openai = null;
        const apiKey = process.env.OPENAI_API_KEY;
        if (apiKey) {
            this.openai = new openai_1.default({
                apiKey: apiKey
            });
            console.log('✅ Servicio OpenAI inicializado');
        }
        else {
            console.log('⚠️ OPENAI_API_KEY no configurada - usando simulación');
        }
    }
    async analyzeJournalEntry(entry, goals) {
        if (!this.openai) {
            return this.getSimulatedAnalysis(entry, goals);
        }
        try {
            console.log('🤖 Enviando solicitud a OpenAI...');
            const systemPrompt = this.buildSystemPrompt();
            const userPrompt = this.buildUserPrompt(entry, goals);
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 800,
                temperature: 0.7
            });
            const response = completion.choices[0]?.message?.content;
            if (!response) {
                throw new Error('No se recibió respuesta de OpenAI');
            }
            console.log('✅ Análisis de OpenAI completado');
            return this.formatResponse(response);
        }
        catch (error) {
            console.error('❌ Error en OpenAI:', error);
            if (error.status === 401) {
                console.error('❌ API Key de OpenAI inválida');
            }
            else if (error.status === 429) {
                console.error('❌ Límite de rate de OpenAI excedido');
            }
            else if (error.status === 402) {
                console.error('❌ Cuota de OpenAI excedida');
            }
            return this.getSimulatedAnalysis(entry, goals);
        }
    }
    buildSystemPrompt() {
        return `
Eres un coach de crecimiento personal experto y empático. Tu tarea es analizar entradas de diario personal y proporcionar insights útiles, constructivos y motivadores.

Directrices:
- Sé empático y comprensivo
- Identifica patrones emocionales y de comportamiento
- Destaca fortalezas y logros
- Sugiere áreas de mejora de manera constructiva
- Proporciona recomendaciones específicas y accionables
- Conecta los insights con las metas del usuario cuando sea relevante
- Usa un tono profesional pero cálido
- Responde en formato HTML bien estructurado
    `;
    }
    buildUserPrompt(entry, goals) {
        const goalsText = goals.length > 0
            ? `\n\nMetas del usuario:\n${goals.map(g => `- ${g}`).join('\n')}`
            : '';
        return `
Analiza la siguiente entrada de diario:

"${entry}"${goalsText}

Por favor, proporciona un análisis que incluya:
1. Patrones emocionales identificados
2. Fortalezas y aspectos positivos observados
3. Áreas de oportunidad para el crecimiento
4. Recomendaciones específicas y accionables
5. Conexión con las metas del usuario (si aplicable)

Estructura tu respuesta en HTML con encabezados claros y formato profesional.
    `;
    }
    formatResponse(text) {
        let formatted = text.trim();
        // Si ya tiene HTML, devolverlo tal como está
        if (formatted.includes('<')) {
            return formatted;
        }
        // Si no tiene HTML, agregarlo básico
        return `<div class="ai-analysis">${formatted.replace(/\n/g, '<br>')}</div>`;
    }
    getSimulatedAnalysis(entry, goals) {
        const goalsList = goals.length > 0
            ? goals.map(g => `<strong>${g}</strong>`).join(', ')
            : 'tus objetivos personales';
        return `
      <h4>Análisis Inteligente de tu Reflexión</h4>
      <p>He procesado tu entrada del diario utilizando técnicas avanzadas de análisis. Aunque no puedo acceder a OpenAI GPT en este momento, puedo ofrecerte insights basados en ${goalsList}.</p>
      
      <h4>Fortalezas Identificadas</h4>
      <p>Tu dedicación a la reflexión personal muestra un compromiso genuino con tu desarrollo. Esta práctica consistente es una base sólida para el crecimiento continuo.</p>
      
      <h4>Recomendaciones Personalizadas</h4>
      <ul>
        <li>Mantén esta rutina de escritura reflexiva - es una herramienta poderosa</li>
        <li>Considera establecer momentos específicos del día para estas reflexiones</li>
        <li>Revisa periódicamente tus entradas anteriores para identificar patrones de progreso</li>
      </ul>
      
      <p><strong>Nota:</strong> Este es un análisis de respaldo utilizando simulación de OpenAI. Para obtener insights más profundos y personalizados, configura tu API key de OpenAI.</p>
    `;
    }
}
exports.OpenAIService = OpenAIService;
//# sourceMappingURL=openai.service.js.map