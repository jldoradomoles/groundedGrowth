import { Injectable, inject } from '@angular/core';
import { GeminiService } from './gemini.service';
import { OpenaiService } from './openai.service';

export type AIProvider = 'gemini' | 'openai' | 'auto';

@Injectable({
  providedIn: 'root',
})
export class AiAnalysisService {
  private geminiService = inject(GeminiService);
  private openaiService = inject(OpenaiService);

  // Configuración del proveedor preferido
  private preferredProvider: AIProvider = 'auto'; // Cambiar a 'gemini' u 'openai' para forzar uno específico

  constructor() {
    console.log('🤖 Servicio de Análisis IA inicializado');
    console.log(`📋 Proveedor configurado: ${this.preferredProvider}`);
  }

  async analyzeJournalEntry(entry: string, goals: string[]): Promise<string> {
    console.log(`🔄 Iniciando análisis con proveedor: ${this.preferredProvider}`);

    if (this.preferredProvider === 'gemini') {
      return this.geminiService.analyzeJournalEntry(entry, goals);
    } else if (this.preferredProvider === 'openai') {
      return this.openaiService.analyzeJournalEntry(entry, goals);
    } else {
      // Modo 'auto': Intentar OpenAI primero, luego Gemini
      return this.tryWithFallback(entry, goals);
    }
  }

  private async tryWithFallback(entry: string, goals: string[]): Promise<string> {
    console.log('🔄 Modo automático: Intentando OpenAI primero...');

    try {
      // Intentar con OpenAI primero (generalmente más confiable)
      const result = await this.openaiService.analyzeJournalEntry(entry, goals);

      // Si la respuesta contiene "simulación", significa que OpenAI no está disponible
      if (result.includes('simulación de OpenAI')) {
        console.log('🔄 OpenAI no disponible, intentando con Gemini...');
        return await this.geminiService.analyzeJournalEntry(entry, goals);
      }

      console.log('✅ Análisis completado con OpenAI');
      return result;
    } catch (error) {
      console.log('🔄 Error con OpenAI, intentando con Gemini...', error);

      try {
        const result = await this.geminiService.analyzeJournalEntry(entry, goals);
        console.log('✅ Análisis completado con Gemini como fallback');
        return result;
      } catch (geminiError) {
        console.error('❌ Ambos servicios fallaron:', geminiError);

        // Última opción: simulación local
        return this.localFallbackAnalysis(entry, goals);
      }
    }
  }

  private async localFallbackAnalysis(entry: string, goals: string[]): Promise<string> {
    console.log('🔄 Usando análisis local como último recurso...');

    // Simular delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
      </ul>
      
      <p><strong>Nota:</strong> Este es un análisis básico local. Para obtener insights más profundos y personalizados, configura una API key de OpenAI o Gemini.</p>
    `;
  }

  // Método para cambiar el proveedor preferido dinámicamente
  setPreferredProvider(provider: AIProvider): void {
    this.preferredProvider = provider;
    console.log(`📋 Proveedor cambiado a: ${provider}`);
  }

  // Método para obtener el proveedor actual
  getPreferredProvider(): AIProvider {
    return this.preferredProvider;
  }
}
