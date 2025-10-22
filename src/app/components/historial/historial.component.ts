import { Component, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIService } from '../../services/ai-backend.service';

export interface JournalEntry {
  id?: string; // ID del backend (opcional para compatibilidad con entradas locales)
  text: string;
  date: Date;
  analysis: string | null;
}

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss',
})
export class HistorialComponent {
  // Servicios
  private aiService = inject(AIService);

  // Inputs
  pastEntries = input.required<JournalEntry[]>();
  goals = input.required<string[]>();

  // Outputs
  entryAnalyzed = output<{ index: number; analysis: string }>();

  // Estado local
  analyzingIndex = signal<number | null>(null);

  // Método para analizar una entrada específica
  async analyzeEntry(index: number, entryId: string): Promise<void> {
    if (this.analyzingIndex() !== null) return; // Prevenir múltiples análisis simultáneos

    this.analyzingIndex.set(index);

    try {
      const analysisResponse = await this.aiService
        .analyzeJournalEntry({
          journalEntryId: entryId,
          aiProvider: 'openai',
        })
        .toPromise();

      if (analysisResponse?.success && analysisResponse.data) {
        // Emitir el evento con el análisis para que el componente padre actualice la entrada
        this.entryAnalyzed.emit({
          index,
          analysis: analysisResponse.data.analysisContent,
        });
      }
    } catch (error) {
      console.error('Error al analizar la entrada:', error);
    } finally {
      this.analyzingIndex.set(null);
    }
  }

  // Método para verificar si una entrada está siendo analizada
  isAnalyzing(index: number): boolean {
    return this.analyzingIndex() === index;
  }
}
