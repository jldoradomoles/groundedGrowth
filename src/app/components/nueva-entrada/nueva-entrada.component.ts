import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-nueva-entrada',
  standalone: true,
  templateUrl: './nueva-entrada.component.html',
  styleUrl: './nueva-entrada.component.scss',
})
export class NuevaEntradaComponent {
  // Inputs
  journalEntry = input.required<string>();
  isLoading = input.required<boolean>();
  isAnalyzeButtonDisabled = input.required<boolean>();

  // Outputs
  journalEntryChanged = output<string>();
  analyzeEntry = output<void>();

  onJournalInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.journalEntryChanged.emit(target.value);
  }

  onAnalyzeEntry(): void {
    this.analyzeEntry.emit();
  }
}
