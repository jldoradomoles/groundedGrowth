import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiAnalysisService, AIProvider } from '../../services/ai-analysis.service';

@Component({
  selector: 'app-ai-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-800">⚙️ Configuración de IA</h3>

      <div class="flex flex-col space-y-3">
        <label class="text-sm font-medium text-gray-700">Proveedor de IA:</label>

        <div class="flex flex-wrap gap-3">
          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              name="aiProvider"
              value="auto"
              [checked]="currentProvider === 'auto'"
              (change)="onProviderChange('auto')"
              class="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">🤖 Automático (Recomendado)</span>
          </label>

          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              name="aiProvider"
              value="openai"
              [checked]="currentProvider === 'openai'"
              (change)="onProviderChange('openai')"
              class="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">🧠 OpenAI (GPT)</span>
          </label>

          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              name="aiProvider"
              value="gemini"
              [checked]="currentProvider === 'gemini'"
              (change)="onProviderChange('gemini')"
              class="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">✨ Gemini</span>
          </label>
        </div>

        <div class="mt-3 p-3 bg-blue-50 rounded-md">
          <p class="text-xs text-blue-700">
            @if (currentProvider === 'auto') {
            <strong>Modo Automático:</strong> Intenta OpenAI primero, luego Gemini como respaldo. }
            @else if (currentProvider === 'openai') { <strong>OpenAI:</strong> Usa exclusivamente
            GPT para análisis más detallados. } @else { <strong>Gemini:</strong> Usa exclusivamente
            el modelo de Google. }
          </p>
        </div>
      </div>
    </div>
  `,
})
export class AiSettingsComponent {
  private aiAnalysisService = inject(AiAnalysisService);

  currentProvider: AIProvider = 'auto';

  constructor() {
    this.currentProvider = this.aiAnalysisService.getPreferredProvider();
  }

  onProviderChange(provider: AIProvider): void {
    this.currentProvider = provider;
    this.aiAnalysisService.setPreferredProvider(provider);
    console.log(`🔧 Proveedor de IA cambiado a: ${provider}`);
  }
}
