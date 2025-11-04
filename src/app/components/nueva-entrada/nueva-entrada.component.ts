import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { JournalService, JournalEntry } from '../../services/journal.service';
import { AIService } from '../../services/ai-backend.service';
import { GoalService, Goal } from '../../services/goal.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-nueva-entrada',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">📔 Nuevo Diario</h2>
        <p class="text-gray-600">Escribe tus pensamientos y reflexiones diarias</p>
      </div>

      <!-- Entrada de Texto -->
      <div class="mb-6">
        <div class="relative">
          <textarea
            [(ngModel)]="journalText"
            placeholder="¿Cómo te sientes hoy? Comparte tus pensamientos, experiencias y reflexiones..."
            class="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            [disabled]="isLoading()"
          ></textarea>
          <div class="absolute bottom-3 right-3 text-sm text-gray-400">
            {{ journalText.length }}/1000
          </div>
        </div>
      </div>

      <!-- Botones de Acción -->
      <div class="flex gap-3 mb-6">
        <button
          (click)="saveEntry()"
          [disabled]="!journalText.trim() || isLoading()"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          @if (isLoading()) {
          <svg
            class="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Guardando... } @else { 💾 Guardar Entrada }
        </button>

        <button
          (click)="analyzeWithAI()"
          [disabled]="!journalText.trim() || isLoading()"
          class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          @if (isAnalyzing()) {
          <svg
            class="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Analizando... } @else { 🤖 Analizar con IA }
        </button>

        <button
          (click)="clearEntry()"
          [disabled]="isLoading()"
          class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          🗑️ Limpiar
        </button>
      </div>

      <!-- Análisis de IA -->
      @if (currentAnalysis()) {
      <div class="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 class="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
          🤖 Análisis de IA
        </h3>
        <div
          class="text-purple-700 whitespace-pre-wrap"
          [innerHTML]="sanitizeHtml(currentAnalysis() || '')"
        ></div>
      </div>
      }

      <!-- Mensajes de Error/Éxito -->
      @if (errorMessage()) {
      <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700 text-sm">{{ errorMessage() }}</p>
      </div>
      } @if (successMessage()) {
      <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-green-700 text-sm">{{ successMessage() }}</p>
      </div>
      }

      <!-- Historial de Entradas -->
      @if (recentEntries().length > 0) {
      <div class="border-t pt-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">📚 Historial de Entradas</h3>
        <div class="max-h-96 overflow-y-auto space-y-4">
          @for (entry of recentEntries(); track entry.id) {
          <div
            class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500">
                  {{ formatDate(entry.createdAt) }}
                </span>

                <!-- Estado del análisis -->
                @if (hasAnalysis(entry)) {
                <span
                  class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
                >
                  🤖 Analizada
                </span>
                } @else {
                <span
                  class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800"
                >
                  ⏳ Sin analizar
                </span>
                }
              </div>

              <button
                (click)="deleteEntry(entry.id)"
                class="text-red-400 hover:text-red-600 text-sm transition-colors"
                title="Eliminar entrada"
              >
                🗑️
              </button>
            </div>

            <p class="text-gray-700 text-sm mb-3 line-clamp-3">{{ entry.content }}</p>

            <!-- Mostrar análisis si existe -->
            @if (hasAnalysis(entry) && entry.aiAnalyses && entry.aiAnalyses[0]) {
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
              <h4 class="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-1">
                🤖 Análisis de IA
              </h4>
              <div
                class="text-xs text-purple-700"
                [innerHTML]="sanitizeHtml(entry.aiAnalyses[0].analysisContent)"
              ></div>
            </div>
            }

            <!-- Botón para analizar si no tiene análisis -->
            @if (!hasAnalysis(entry) && entry.id) {
            <div class="flex justify-end mt-3">
              <button
                (click)="analyzeHistoryEntry(entry)"
                [disabled]="isAnalyzingEntry(entry.id)"
                class="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                @if (isAnalyzingEntry(entry.id)) {
                <svg
                  class="animate-spin h-3 w-3 mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analizando... } @else { 🤖 Analizar con IA }
              </button>
            </div>
            }
          </div>
          }
        </div>
      </div>
      }
    </div>

    <!-- Modal de confirmación de eliminación -->
    <app-confirmation-modal
      [isOpen]="showDeleteModal()"
      [title]="deleteModalTitle()"
      [message]="deleteModalMessage()"
      [confirmText]="'Eliminar'"
      [cancelText]="'Cancelar'"
      [type]="'danger'"
      (confirm)="onConfirmDelete()"
      (cancel)="onCancelDelete()"
    ></app-confirmation-modal>
  `,
  styleUrl: './nueva-entrada.component.scss',
})
export class NuevaEntradaComponent implements OnInit {
  private journalService = inject(JournalService);
  private aiService = inject(AIService);
  private goalService = inject(GoalService);
  private sanitizer = inject(DomSanitizer);

  // Signals
  journalText = '';
  isLoading = signal(false);
  isAnalyzing = signal(false);
  currentAnalysis = signal<string | null>(null);
  errorMessage = signal('');
  successMessage = signal('');
  recentEntries = signal<JournalEntry[]>([]);
  goals = signal<Goal[]>([]);
  analyzingEntryId = signal<string | null>(null);

  // Modal de confirmación para eliminar entradas
  showDeleteModal = signal(false);
  deleteModalTitle = signal('');
  deleteModalMessage = signal('');
  deletingEntryId = signal<string | null>(null);

  // Method to sanitize HTML content by converting tags to formatted text
  sanitizeHtml(html: string): SafeHtml {
    if (!html) return '';

    // Convert HTML tags to formatted text while preserving structure
    let text = html
      // Convert paragraphs to line breaks
      .replace(/<p[^>]*>/gi, '')
      .replace(/<\/p>/gi, '\n\n')
      // Convert divs to line breaks
      .replace(/<div[^>]*>/gi, '')
      .replace(/<\/div>/gi, '\n')
      // Convert headers to bold text with line breaks
      .replace(/<h[1-6][^>]*>/gi, '**')
      .replace(/<\/h[1-6]>/gi, '**\n\n')
      // Convert unordered lists
      .replace(/<ul[^>]*>/gi, '\n')
      .replace(/<\/ul>/gi, '\n')
      // Convert list items to bullet points
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<\/li>/gi, '\n')
      // Convert line breaks
      .replace(/<br[^>]*>/gi, '\n')
      // Convert strong/bold text
      .replace(/<(strong|b)[^>]*>/gi, '**')
      .replace(/<\/(strong|b)>/gi, '**')
      // Remove any remaining HTML tags
      .replace(/<[^>]*>/g, '')
      // Clean up multiple line breaks
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return this.sanitizer.sanitize(1, text) || '';
  }

  ngOnInit(): void {
    this.loadRecentEntries();
    this.loadGoals();
  }

  private loadRecentEntries(): void {
    this.journalService.getEntries(1, 10).subscribe({
      // Cargamos más entradas para el historial completo
      next: (response) => {
        if (response.success) {
          this.recentEntries.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading recent entries:', error);
      },
    });
  }

  private loadGoals(): void {
    this.goalService.getGoals().subscribe({
      next: (response) => {
        if (response.success) {
          this.goals.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading goals:', error);
      },
    });
  }

  // Método para analizar una entrada específica del historial
  async analyzeHistoryEntry(entry: JournalEntry): Promise<void> {
    if (!entry.id || this.analyzingEntryId()) return;

    this.analyzingEntryId.set(entry.id);

    try {
      const analysisResponse = await this.aiService
        .analyzeJournalEntry({
          journalEntryId: entry.id,
          aiProvider: 'openai',
        })
        .toPromise();

      if (analysisResponse?.success && analysisResponse.data) {
        // Actualizar la entrada en la lista con el nuevo análisis
        this.recentEntries.update((entries) =>
          entries.map((e) =>
            e.id === entry.id ? { ...e, aiAnalyses: [analysisResponse.data] } : e
          )
        );
        this.successMessage.set('¡Análisis completado exitosamente!');

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage.set('');
        }, 3000);
      }
    } catch (error) {
      this.errorMessage.set('Error al analizar la entrada');
      console.error('Error analyzing entry:', error);

      // Limpiar mensaje de error después de 5 segundos
      setTimeout(() => {
        this.errorMessage.set('');
      }, 5000);
    } finally {
      this.analyzingEntryId.set(null);
    }
  }

  // Verificar si una entrada está siendo analizada
  isAnalyzingEntry(entryId: string): boolean {
    return this.analyzingEntryId() === entryId;
  }

  // Verificar si una entrada ya tiene análisis
  hasAnalysis(entry: JournalEntry): boolean {
    return !!(entry.aiAnalyses && entry.aiAnalyses.length > 0);
  }

  saveEntry(): void {
    if (!this.journalText.trim()) return;

    this.clearMessages();
    this.isLoading.set(true);

    const entryData = {
      content: this.journalText.trim(),
    };

    this.journalService.createEntry(entryData).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.successMessage.set('¡Entrada guardada exitosamente!');
          this.loadRecentEntries(); // Recargar entradas recientes

          // Si hay análisis, guardarlo también
          if (this.currentAnalysis()) {
            this.saveAnalysis(response.data.id);
          }

          // Limpiar después de un tiempo
          setTimeout(() => {
            this.clearEntry();
            this.successMessage.set('');
          }, 2000);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Error al guardar la entrada');
        console.error('Error saving entry:', error);
      },
    });
  }

  analyzeWithAI(): void {
    if (!this.journalText.trim()) return;

    this.clearMessages();
    this.isAnalyzing.set(true);
    this.currentAnalysis.set(null);

    // Primero necesitamos guardar la entrada para obtener un ID
    const entryData = {
      content: this.journalText.trim(),
    };

    this.journalService.createEntry(entryData).subscribe({
      next: (entryResponse: any) => {
        if (entryResponse.success) {
          // Ahora crear el análisis con el ID de la entrada
          this.aiService
            .analyzeJournalEntry({
              journalEntryId: entryResponse.data.id,
              aiProvider: 'openai',
            })
            .subscribe({
              next: (analysisResponse: any) => {
                this.isAnalyzing.set(false);
                if (analysisResponse.success) {
                  this.currentAnalysis.set(analysisResponse.data.analysisContent);
                  this.loadRecentEntries(); // Recargar entradas
                }
              },
              error: (error: any) => {
                this.isAnalyzing.set(false);
                this.errorMessage.set('Error al analizar con IA');
                console.error('Error analyzing with AI:', error);
              },
            });
        }
      },
      error: (error: any) => {
        this.isAnalyzing.set(false);
        this.errorMessage.set('Error al guardar entrada para análisis');
        console.error('Error saving entry for analysis:', error);
      },
    });
  }

  private saveAnalysis(entryId: string): void {
    if (!this.currentAnalysis()) return;

    // Aquí podrías implementar guardar el análisis asociado a la entrada
    // Por ahora solo lo mostramos
  }

  clearEntry(): void {
    this.journalText = '';
    this.currentAnalysis.set(null);
    this.clearMessages();
  }

  // Método para confirmar la eliminación de una entrada
  confirmDeleteEntry(entryId: string, entryDate: string): void {
    this.deletingEntryId.set(entryId);

    const formattedDate = new Date(entryDate).toLocaleDateString('es-ES', {
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
  }

  // Método llamado cuando se confirma la eliminación
  onConfirmDelete(): void {
    const entryId = this.deletingEntryId();
    if (entryId) {
      this.executeDelete(entryId);
      this.showDeleteModal.set(false);
      this.deletingEntryId.set(null);
    }
  }

  // Método llamado cuando se cancela la eliminación
  onCancelDelete(): void {
    this.showDeleteModal.set(false);
    this.deletingEntryId.set(null);
  }

  // Método que ejecuta la eliminación real
  private executeDelete(entryId: string): void {
    this.journalService.deleteEntry(entryId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadRecentEntries();
          this.successMessage.set('Entrada eliminada');
          setTimeout(() => this.successMessage.set(''), 2000);
        }
      },
      error: (error) => {
        this.errorMessage.set('Error al eliminar la entrada');
        console.error('Error deleting entry:', error);
      },
    });
  }

  // Método obsoleto - mantener por compatibilidad pero redirigir al modal
  deleteEntry(entryId: string): void {
    // Buscar la entrada para obtener su fecha
    const entry = this.recentEntries().find((e) => e.id === entryId);
    if (entry) {
      this.confirmDeleteEntry(entryId, entry.createdAt);
    }
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  // Utility methods
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}
