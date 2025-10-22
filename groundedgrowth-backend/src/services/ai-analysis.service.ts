import { OpenAIService } from './openai.service';

export type AIProvider = 'openai';

export class AIAnalysisService {
  private openaiService: OpenAIService;
  private preferredProvider: AIProvider;

  constructor(preferredProvider: AIProvider = 'openai') {
    this.openaiService = new OpenAIService();
    this.preferredProvider = preferredProvider;

    console.log(`🤖 Servicio de Análisis IA inicializado con OpenAI`);
  }

  async analyzeJournalEntry(
    entry: string,
    goals: string[],
    provider?: AIProvider
  ): Promise<{
    analysis: string;
    aiProvider: string;
  }> {
    console.log(`🔄 Iniciando análisis con OpenAI`);

    try {
      const analysis = await this.openaiService.analyzeJournalEntry(entry, goals);

      console.log('✅ Análisis completado con OpenAI');
      return {
        analysis,
        aiProvider: 'openai',
      };
    } catch (error) {
      console.error('❌ Error con OpenAI:', error);

      // Fallback a análisis local si OpenAI falla
      return {
        analysis: this.getLocalFallbackAnalysis(entry, goals),
        aiProvider: 'local',
      };
    }
  }

  private getLocalFallbackAnalysis(entry: string, goals: string[]): string {
    console.log('🔄 Usando análisis local como último recurso...');

    const goalsList =
      goals.length > 0
        ? goals.map((g) => `<strong>${g}</strong>`).join(', ')
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
  setPreferredProvider(provider: AIProvider): void {
    this.preferredProvider = provider;
    console.log(`📋 Proveedor cambiado a: ${provider}`);
  }

  // Método para obtener el proveedor actual
  getPreferredProvider(): AIProvider {
    return this.preferredProvider;
  }
}
