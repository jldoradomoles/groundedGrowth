import { Component, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIService } from '../../services/ai-backend.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

export interface JournalEntry {
  id?: string; // ID del backend (opcional para compatibilidad con entradas locales)
  text: string;
  date: Date;
  analysis: string | null;
}

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss',
})
export class HistorialComponent {
  // Servicios
  private aiService = inject(AIService);

  // Inputs
  pastEntries = input.required<JournalEntry[]>();
  goals = input<string[]>([]);

  // Outputs
  entryAnalyzed = output<{ index: number; analysis: string }>();
  entryDeleted = output<number>();

  // Estado local
  analyzingIndex = signal<number | null>(null);

  // Estado del modal
  showDeleteModal = signal<boolean>(false);
  deleteModalTitle = signal<string>('');
  deleteModalMessage = signal<string>('');
  deletingIndex = signal<number | null>(null);

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

  // Método para confirmar eliminación de una entrada
  confirmDeleteEntry(index: number, entryDate: Date): void {
    console.log('🗑️ confirmDeleteEntry called:', { index, entryDate });
    this.deletingIndex.set(index);

    const formattedDate = entryDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    this.deleteModalTitle.set('¿Eliminar entrada del diario?');
    this.deleteModalMessage.set(
      `¿Estás seguro de que deseas eliminar la entrada del ${formattedDate}? Esta acción no se puede deshacer.`
    );
    this.showDeleteModal.set(true);
    console.log('✅ Modal state updated:', {
      showDeleteModal: this.showDeleteModal(),
      title: this.deleteModalTitle(),
      message: this.deleteModalMessage(),
    });
  }

  // Método llamado cuando se confirma la eliminación
  onConfirmDelete(): void {
    const index = this.deletingIndex();
    if (index !== null) {
      this.entryDeleted.emit(index);
      this.showDeleteModal.set(false);
      this.deletingIndex.set(null);
    }
  }

  // Método llamado cuando se cancela la eliminación
  onCancelDelete(): void {
    this.showDeleteModal.set(false);
    this.deletingIndex.set(null);
  }
}
