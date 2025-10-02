import { Injectable } from '@angular/core';
import OpenAI from 'openai';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenaiService {
  private openai?: OpenAI;

  constructor() {
    const apiKey = environment.openaiApiKey;

    console.log(
      '🔑 OpenAI API Key detectada:',
      apiKey ? `${apiKey.substring(0, 10)}...` : 'No configurada'
    );

    if (!apiKey || apiKey === 'TU_OPENAI_API_KEY_AQUI') {
      console.warn('⚠️ API Key de OpenAI no configurada. Usando modo simulación.');
      return;
    }

    console.log('✅ Inicializando OpenAI con API key real...');
    try {
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // Necesario para usar en el navegador
      });
      console.log('✅ OpenAI inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar OpenAI:', error);
    }
  }

  async analyzeJournalEntry(entry: string, goals: string[]): Promise<string> {
    // Si no hay API key configurada, usar simulación
    if (!this.openai) {
      console.log('🤖 Usando modo simulación OpenAI (no hay API key configurada)');
      return this.simulateAnalysis(entry, goals, 'No hay API key de OpenAI configurada');
    }

    console.log('🧠 Llamando a OpenAI GPT real...');

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
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Modelo más económico
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error('No se recibió respuesta de OpenAI');
      }

      console.log('✅ Respuesta recibida de OpenAI GPT');
      return response;
    } catch (error: any) {
      console.error('❌ Error detallado al llamar a la API de OpenAI:', error);
      console.error('❌ Error status:', error.status);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));

      // Manejo específico de diferentes tipos de errores
      if (error.status === 401) {
        console.error('❌ API Key de OpenAI inválida, usando simulación...');
        return this.simulateAnalysis(entry, goals, 'API Key de OpenAI inválida');
      } else if (error.status === 429) {
        console.error('❌ Límite de rate de OpenAI excedido, usando simulación...');
        return this.simulateAnalysis(entry, goals, 'Límite de uso de OpenAI excedido');
      } else if (error.status === 402) {
        console.error('❌ Créditos de OpenAI agotados, usando simulación...');
        return this.simulateAnalysis(entry, goals, 'Créditos de OpenAI agotados');
      } else if (error.status === 503) {
        console.error('❌ Servicio de OpenAI no disponible, usando simulación...');
        return this.simulateAnalysis(
          entry,
          goals,
          'Servicio de OpenAI temporalmente no disponible'
        );
      } else {
        console.error('❌ Error desconocido con OpenAI, usando simulación...');
        return this.simulateAnalysis(entry, goals, 'Error de conexión con OpenAI');
      }
    }
  }

  // Simulación como fallback cuando no hay API key o hay errores
  private async simulateAnalysis(entry: string, goals: string[], reason?: string): Promise<string> {
    const reasonText = reason || 'Configura tu API key de OpenAI para usar GPT real';
    console.log(`🤖 Usando simulación de OpenAI - ${reasonText}`);

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1500));

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
      <h4>Análisis Inteligente de tu Reflexión</h4>
      <p>Gracias por compartir tus pensamientos. He analizado tu entrada y encuentro conexiones interesantes con ${goalsList}.</p>
      
      <h4>Insights Identificados</h4>
      <p>Tu capacidad de introspección es notable. Los sentimientos y experiencias que compartes muestran un proceso de crecimiento personal auténtico. Es valioso que puedas expresar tus emociones de manera tan honesta.</p>
      
      <h4>Recomendación Específica</h4>
      <ul>
        <li>Te sugiero dedicar 10 minutos mañana por la mañana a escribir sobre cómo te gustaría aplicar lo que has reflexionado hoy en situaciones similares futuras.</li>
      </ul>
      
      <p><strong>Nota:</strong> Esta es una simulación de OpenAI GPT (${reasonText}). Para obtener análisis más personalizados y profundos, configura tu API key de OpenAI.</p>
    `;
  }
}
