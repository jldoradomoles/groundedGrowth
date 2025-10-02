import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { MetasComponent } from './components/metas/metas.component';
import { NuevaEntradaComponent } from './components/nueva-entrada/nueva-entrada.component';
import { AnalisisIaComponent } from './components/analisis-ia/analisis-ia.component';
import { HistorialComponent } from './components/historial/historial.component';
import { AiSettingsComponent } from './components/ai-settings/ai-settings.component';
import { AiAnalysisService } from './services/ai-analysis.service';

// --- COMPONENTE PRINCIPAL DE LA APLICACIÓN --- //
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MetasComponent,
    NuevaEntradaComponent,
    AnalisisIaComponent,
    HistorialComponent,
    AiSettingsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // --- STATE MANAGEMENT CON SIGNALS --- //

  // Señales para la UI de Metas
  goals = signal<string[]>(['Ser más paciente', 'Reducir la ansiedad social']);
  newGoal = signal<string>('');

  // Señales para la UI de Entradas de Diario
  journalEntry = signal<string>('');
  pastEntries = signal<{ text: string; date: Date; analysis: string | null }[]>([]);

  // Señales para el estado de la API
  currentAnalysis = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Señal computada para deshabilitar el botón de análisis
  isAnalyzeButtonDisabled = computed(() => {
    const length = this.journalEntry().trim().length;
    const disabled = length < 20;
    return disabled;
  });

  // Inyección del servicio de análisis IA
  private aiAnalysisService = inject(AiAnalysisService);

  constructor() {}

  // --- MÉTODOS DE LA CLASE --- //

  // --- MÉTODOS PARA EL COMPONENTE METAS --- //
  onNewGoalChanged(newValue: string): void {
    this.newGoal.set(newValue);
  }

  onGoalAdded(): void {
    const goal = this.newGoal().trim();
    if (goal) {
      this.goals.update((currentGoals) => [...currentGoals, goal]);
      this.newGoal.set('');
    }
  }

  onGoalRemoved(index: number): void {
    this.goals.update((currentGoals) => currentGoals.filter((_, i) => i !== index));
  }

  // --- MÉTODOS PARA EL DIARIO --- //
  onJournalEntryChanged(newValue: string): void {
    this.journalEntry.set(newValue);
  }

  onAnalyzeEntryRequested(): void {
    this.analyzeEntry();
  }

  async analyzeEntry(): Promise<void> {
    const entryText = this.journalEntry().trim();
    if (!entryText) return;

    this.isLoading.set(true);
    this.error.set(null);
    this.currentAnalysis.set(null);

    try {
      const analysisResult = await this.callGeminiApi(entryText, this.goals());

      // Simular un retardo para mostrar el spinner
      await new Promise((resolve) => setTimeout(resolve, 1500));

      this.currentAnalysis.set(analysisResult);
      this.pastEntries.update((entries) => [
        { text: entryText, date: new Date(), analysis: analysisResult },
        ...entries,
      ]);
      this.journalEntry.set('');
    } catch (e: any) {
      this.error.set(e.message);
    } finally {
      this.isLoading.set(false);
    }
  }

  // --- LLAMADA AL SERVICIO DE ANÁLISIS IA --- //

  private async callGeminiApi(entry: string, goals: string[]): Promise<string> {
    console.log('--- Llamando al servicio de análisis IA ---');
    return await this.aiAnalysisService.analyzeJournalEntry(entry, goals);
  }
}
