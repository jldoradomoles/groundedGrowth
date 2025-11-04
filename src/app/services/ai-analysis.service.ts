import { Injectable, inject } from '@angular/core';
import { OpenaiService } from './openai.service';

@Injectable({
  providedIn: 'root',
})
export class AiAnalysisService {
  private openaiService = inject(OpenaiService);

  constructor() {
    console.log('🤖 Servicio de Análisis IA inicializado');
    console.log('📋 Usando OpenAI como proveedor único');
  }

  async analyzeJournalEntry(entry: string, goals: string[]): Promise<string> {
    console.log('🔄 Iniciando análisis con OpenAI');

    try {
      const result = await this.openaiService.analyzeJournalEntry(entry, goals);
      console.log('✅ Análisis completado con OpenAI');
      return result;
    } catch (error) {
      console.error('❌ Error con OpenAI:', error);
      // Fallback a análisis local
      return this.localFallbackAnalysis(entry, goals);
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
      
      <p><strong>Nota:</strong> Este es un análisis básico local. Para obtener insights más profundos y personalizados, configura una API key de OpenAI.</p>
    `;
  }
}
