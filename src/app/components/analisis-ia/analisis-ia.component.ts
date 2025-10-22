import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AIService } from '../../services/ai-backend.service';
import { JournalService, JournalEntry, AIAnalysis } from '../../services/journal.service';

@Component({
  selector: 'app-analisis-ia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">🤖 Análisis de IA</h2>
        <p class="text-gray-600">
          Revisa los análisis generados por OpenAI para tus entradas del diario
        </p>
      </div>

      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-purple-50 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                🤖
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Total Análisis</h3>
              <p class="text-2xl font-bold text-purple-600">{{ totalAnalyses() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                📊
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Este Mes</h3>
              <p class="text-2xl font-bold text-blue-600">{{ thisMonthAnalyses() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                ⚡
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Proveedor</h3>
              <p class="text-2xl font-bold text-green-600">OpenAI</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros y Búsqueda -->
      <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="onSearchChange()"
              placeholder="Buscar en análisis..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div class="flex gap-2">
            <select
              [(ngModel)]="selectedDateFilter"
              (change)="onFilterChange()"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
            </select>
            <button
              (click)="refreshAnalyses()"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              [disabled]="isLoading()"
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
              } @else { 🔄 }
            </button>
          </div>
        </div>
      </div>

      <!-- Mensajes de Error/Info -->
      @if (errorMessage()) {
      <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700 text-sm">{{ errorMessage() }}</p>
      </div>
      }

      <!-- Lista de Análisis -->
      @if (isLoading() && filteredAnalyses().length === 0) {
      <div class="text-center py-12">
        <svg
          class="animate-spin h-8 w-8 text-purple-600 mx-auto mb-4"
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
        <p class="text-gray-600">Cargando análisis...</p>
      </div>
      } @else if (filteredAnalyses().length === 0) {
      <div class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">🤖</div>
        <h3 class="text-xl font-medium text-gray-600 mb-2">No hay análisis aún</h3>
        <p class="text-gray-500 mb-4">
          Los análisis aparecerán aquí cuando uses la función "Analizar con IA" en el diario
        </p>
        <button
          (click)="navigateToJournal()"
          class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          📝 Ir al Diario
        </button>
      </div>
      } @else {
      <div class="space-y-4">
        @for (analysis of filteredAnalyses(); track analysis.id) {
        <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
          <!-- Header del análisis -->
          <div class="bg-purple-50 px-6 py-4 border-b">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  🤖
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">
                    Análisis {{ formatDate(analysis.createdAt) }}
                  </h3>
                  <p class="text-sm text-gray-600">
                    Proveedor: {{ analysis.aiProvider }} •
                    {{ formatRelativeTime(analysis.createdAt) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  (click)="toggleAnalysisExpanded(analysis.id)"
                  class="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                >
                  {{ isAnalysisExpanded(analysis.id) ? '🔼 Contraer' : '🔽 Expandir' }}
                </button>
                <button
                  (click)="viewJournalEntry(analysis.journalEntryId)"
                  class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                >
                  📖 Ver Entrada
                </button>
              </div>
            </div>
          </div>

          <!-- Contenido del análisis -->
          <div class="px-6 py-4">
            @if (isAnalysisExpanded(analysis.id)) {
            <div
              class="prose max-w-none text-gray-700"
              [innerHTML]="sanitizeHtml(analysis.analysisContent)"
            ></div>
            } @else {
            <p
              class="text-gray-700"
              [innerHTML]="sanitizeHtml(truncateText(analysis.analysisContent, 200))"
            ></p>
            }
          </div>
        </div>
        }
      </div>

      <!-- Paginación -->
      @if (totalPages() > 1) {
      <div class="flex justify-center items-center gap-2 mt-6">
        <button
          (click)="previousPage()"
          [disabled]="currentPage() === 1 || isLoading()"
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          ← Anterior
        </button>

        <span class="px-4 py-2 text-sm text-gray-600">
          Página {{ currentPage() }} de {{ totalPages() }}
        </span>

        <button
          (click)="nextPage()"
          [disabled]="currentPage() === totalPages() || isLoading()"
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Siguiente →
        </button>
      </div>
      } }
    </div>
  `,
  styleUrl: './analisis-ia.component.scss',
})
export class AnalisisIaComponent implements OnInit {
  private aiService = inject(AIService);
  private journalService = inject(JournalService);
  private router = inject(Router);
  private domSanitizer = inject(DomSanitizer);

  // Signals
  analyses = signal<AIAnalysis[]>([]);
  filteredAnalyses = signal<AIAnalysis[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  // Filtros
  searchTerm = '';
  selectedDateFilter = 'all';

  // Paginación
  currentPage = signal(1);
  totalPages = signal(1);
  pageSize = 10;

  // Estados expandidos
  expandedAnalyses = new Set<string>();

  // Estadísticas
  totalAnalyses = signal(0);
  thisMonthAnalyses = signal(0);

  ngOnInit(): void {
    this.loadAnalyses();
  }

  private loadAnalyses(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.aiService.getUserAnalyses(this.currentPage(), this.pageSize).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        if (response.success) {
          this.analyses.set(response.data);
          this.applyFilters();
          this.updateStatistics();

          if (response.pagination) {
            this.totalPages.set(response.pagination.totalPages);
          }
        }
      },
      error: (error: any) => {
        this.isLoading.set(false);
        this.errorMessage.set('Error al cargar los análisis');
        console.error('Error loading analyses:', error);
      },
    });
  }

  private updateStatistics(): void {
    const total = this.analyses().length;
    this.totalAnalyses.set(total);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonth = this.analyses().filter((analysis) => {
      const analysisDate = new Date(analysis.createdAt);
      return analysisDate.getMonth() === currentMonth && analysisDate.getFullYear() === currentYear;
    }).length;

    this.thisMonthAnalyses.set(thisMonth);
  }

  refreshAnalyses(): void {
    this.currentPage.set(1);
    this.loadAnalyses();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.analyses()];

    // Filtro de búsqueda
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter((analysis) =>
        analysis.analysisContent.toLowerCase().includes(search)
      );
    }

    // Filtro de fecha
    if (this.selectedDateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter((analysis) => {
        const analysisDate = new Date(analysis.createdAt);

        switch (this.selectedDateFilter) {
          case 'today':
            return analysisDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return analysisDate >= weekAgo;
          case 'month':
            return (
              analysisDate.getMonth() === now.getMonth() &&
              analysisDate.getFullYear() === now.getFullYear()
            );
          default:
            return true;
        }
      });
    }

    this.filteredAnalyses.set(filtered);
  }

  toggleAnalysisExpanded(analysisId: string): void {
    if (this.expandedAnalyses.has(analysisId)) {
      this.expandedAnalyses.delete(analysisId);
    } else {
      this.expandedAnalyses.add(analysisId);
    }
  }

  isAnalysisExpanded(analysisId: string): boolean {
    return this.expandedAnalyses.has(analysisId);
  }

  viewJournalEntry(journalEntryId: string): void {
    // Aquí podrías navegar a la entrada específica del diario
    // Por ahora, solo navegar al diario
    this.navigateToJournal();
  }

  navigateToJournal(): void {
    this.router.navigate(['/dashboard/journal']);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadAnalyses();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadAnalyses();
    }
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

  formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `hace ${diffInMinutes} minutos`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `hace ${hours} horas`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `hace ${days} días`;
    }
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  sanitizeHtml(html: string): SafeHtml {
    // Convertir HTML básico a texto plano manteniendo formato
    let cleanText = html
      // Reemplazar etiquetas de párrafo y div con saltos de línea
      .replace(/<p[^>]*>/gi, '')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<div[^>]*>/gi, '')
      .replace(/<\/div>/gi, '\n')
      // Reemplazar etiquetas de encabezado
      .replace(/<h[1-6][^>]*>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      // Reemplazar listas
      .replace(/<ul[^>]*>/gi, '\n')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<\/li>/gi, '\n')
      // Reemplazar saltos de línea
      .replace(/<br[^>]*>/gi, '\n')
      // Reemplazar strong/bold
      .replace(/<strong[^>]*>/gi, '**')
      .replace(/<\/strong>/gi, '**')
      .replace(/<b[^>]*>/gi, '**')
      .replace(/<\/b>/gi, '**')
      // Eliminar cualquier otra etiqueta HTML
      .replace(/<[^>]*>/gi, '')
      // Limpiar espacios extra
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();

    return this.domSanitizer.bypassSecurityTrustHtml(cleanText.replace(/\n/g, '<br>'));
  }
}
