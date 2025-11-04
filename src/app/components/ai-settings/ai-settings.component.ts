import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-800">⚙️ Configuración de IA</h3>

      <div class="flex flex-col space-y-3">
        <div class="flex items-center space-x-2">
          <span class="text-2xl">�</span>
          <div>
            <p class="text-sm font-medium text-gray-700">Proveedor de IA: OpenAI (GPT)</p>
            <p class="text-xs text-gray-500">Análisis avanzado con GPT-4</p>
          </div>
        </div>

        <div class="mt-3 p-3 bg-blue-50 rounded-md">
          <p class="text-xs text-blue-700">
            <strong>OpenAI GPT:</strong> Usa el modelo GPT-4 para análisis detallados y
            personalizados de tus reflexiones.
          </p>
          <p class="text-xs text-blue-600 mt-2">
            💡 Configura tu API key de OpenAI en el archivo
            <code class="bg-blue-100 px-1 rounded">environment.ts</code>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class AiSettingsComponent {
  constructor() {
    console.log('🔧 Configuración de IA: OpenAI como proveedor único');
  }
}
