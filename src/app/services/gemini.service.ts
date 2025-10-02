import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private genAI?: GoogleGenerativeAI;
  private model?: any;

  constructor() {
    const apiKey = environment.geminiApiKey;

    console.log(
      '🔑 API Key detectada:',
      apiKey ? `${apiKey.substring(0, 10)}...` : 'No configurada'
    );

    if (!apiKey || apiKey === 'TU_API_KEY_AQUI') {
      console.warn('⚠️ API Key de Gemini no configurada. Usando modo simulación.');
      return;
    }

    console.log('✅ Inicializando Gemini AI con API key gratuita...');
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      // Usar modelo gratuito específico
      this.model = this.genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
      console.log(
        '✅ Gemini AI inicializado correctamente con modelo gratuito models/gemini-1.5-flash'
      );

      // Debug: Listar modelos disponibles (opcional)
      this.listAvailableModels();
    } catch (error) {
      console.error('❌ Error al inicializar Gemini AI:', error);
      // Si falla la inicialización, no asignamos el modelo para usar simulación
    }
  }

  // Método para debug: listar modelos disponibles
  private async listAvailableModels(): Promise<void> {
    if (!this.genAI) return;

    try {
      console.log('🔍 Verificando modelos disponibles para API key gratuita...');
      // Intentar obtener información de modelos disponibles
      // Nota: Esto es para debug y puede no funcionar en todas las configuraciones
    } catch (error) {
      console.log('ℹ️ No se pudieron listar los modelos disponibles:', error);
    }
  }

  async analyzeJournalEntry(entry: string, goals: string[]): Promise<string> {
    // Si no hay API key configurada, usar simulación
    if (!this.model) {
      console.log('🤖 Usando modo simulación (no hay modelo inicializado)');
      return this.simulateAnalysis(entry, goals, 'No hay API key configurada');
    }

    console.log('🧠 Llamando a Gemini AI real...');

    const systemPrompt = `
        Eres "Grounded Growth", un asistente de IA empático y constructivo especializado en crecimiento personal. 
        Tu objetivo es ayudar al usuario a reflexionar sobre sus entradas de diario en relación con sus metas personales.

        Instrucciones:
        - Analiza la entrada de diario proporcionada con empatía y sin juzgar
        - Conecta los sentimientos y eventos de la entrada con las metas del usuario
        - Ofrece 1-2 insights o patrones específicos que observes
        - Sugiere 1 acción pequeña, concreta y realizable que el usuario podría tomar
        - Usa un tono de apoyo, cálido y alentador
        - Tu respuesta debe ser en español
        - Formatea tu respuesta usando HTML simple: <h4> para títulos, <p> para párrafos, <ul> y <li> para listas, <strong> para énfasis
        - Mantén la respuesta entre 200-400 palabras
      `;

    const userPrompt = `
        **Metas del Usuario:**
        ${goals.map((g) => `- ${g}`).join('\n')}

        **Entrada de Diario:**
        "${entry}"

        Por favor, analiza esta entrada considerando las metas del usuario y proporciona insights constructivos.
      `;

    try {
      const result = await this.model.generateContent(systemPrompt + '\n\n' + userPrompt);
      const response = await result.response;
      const text = response.text();
      console.log('✅ Respuesta recibida de Gemini AI');
      return text;
    } catch (error: any) {
      console.error('❌ Error detallado al llamar a la API de Gemini:', error);
      console.error('❌ Error status:', error.status);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));

      // Manejo específico de diferentes tipos de errores
      if (error.status === 404 || error.message?.includes('404')) {
        console.error(
          '❌ Error 404: Modelo no encontrado. Intentando con modelo alternativo gratuito...'
        );
        // Intentar con modelo alternativo gratuito
        try {
          this.model = this.genAI!.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
          const result = await this.model.generateContent(systemPrompt + '\n\n' + userPrompt);
          const response = await result.response;
          return response.text();
        } catch (fallbackError: any) {
          console.error('❌ Error con modelo alternativo:', fallbackError);
          console.error('❌ Fallback error status:', fallbackError.status);
          console.error('❌ Fallback error message:', fallbackError.message);
          console.warn('🔄 Ambos modelos fallaron, usando simulación como alternativa...');
          return this.simulateAnalysis(
            entry,
            goals,
            'Ambos modelos de Gemini no están disponibles'
          );
        }
      } else if (error.message?.includes('API_KEY') || error.status === 401) {
        console.error('❌ API Key inválida, usando simulación como alternativa...');
        return this.simulateAnalysis(entry, goals, 'API Key inválida o no configurada');
      } else if (error.message?.includes('quota') || error.status === 429) {
        console.error('❌ Cuota excedida, usando simulación como alternativa...');
        return this.simulateAnalysis(entry, goals, 'Cuota de API gratuita excedida');
      } else if (error.status === 403 || error.message?.includes('permission')) {
        console.error(
          '❌ Acceso denegado (posible limitación de plan gratuito), usando simulación...'
        );
        return this.simulateAnalysis(entry, goals, 'Plan gratuito - modelo no disponible');
      } else if (error.message?.includes('model') && error.message?.includes('not found')) {
        console.error('❌ Modelo no disponible para plan gratuito, usando simulación...');
        return this.simulateAnalysis(entry, goals, 'Modelo no disponible en plan gratuito');
      } else {
        console.error('❌ Error desconocido, usando simulación como alternativa...');
        return this.simulateAnalysis(entry, goals, 'Error de conexión con Gemini');
      }
    }
  }

  // Simulación como fallback cuando no hay API key
  private async simulateAnalysis(entry: string, goals: string[], reason?: string): Promise<string> {
    const reasonText = reason || 'Configura tu API key para usar la AI real';
    console.log(`🤖 Usando simulación de Gemini - ${reasonText}`);

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simular posible error
    if (entry.toLowerCase().includes('error')) {
      throw new Error(
        'No se pudo conectar con el servidor de análisis. Inténtalo de nuevo más tarde.'
      );
    }

    // Respuesta simulada más dinámica basada en las metas
    const goalsList =
      goals.length > 0
        ? goals.map((g) => `<strong>${g}</strong>`).join(', ')
        : 'tus objetivos personales';

    return `
      <h4>Reflexiones sobre tu día</h4>
      <p>Gracias por compartir tu reflexión. He notado varios elementos interesantes en tu entrada que se relacionan con ${goalsList}.</p>
      
      <h4>Patrones Observados</h4>
      <p>Veo que tu entrada refleja un proceso de auto-reflexión muy valioso. Los sentimientos que describes son completamente normales y muestran tu capacidad de ser honesto contigo mismo, lo cual es fundamental para el crecimiento personal.</p>
      
      <h4>Sugerencia Práctica</h4>
      <ul>
        <li>Para los próximos días, considera dedicar 5 minutos cada mañana a visualizar cómo quieres abordar las situaciones que puedan surgir, especialmente aquellas relacionadas con tus metas.</li>
      </ul>
      
      <p><strong>Nota:</strong> Esta es una simulación (${reasonText}). Para obtener análisis personalizados reales con IA, verifica tu configuración de Gemini.</p>
    `;
  }
}
