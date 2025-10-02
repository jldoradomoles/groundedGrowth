import { Component, input } from '@angular/core';

export interface JournalEntry {
  text: string;
  date: Date;
  analysis: string | null;
}

@Component({
  selector: 'app-historial',
  standalone: true,
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss',
})
export class HistorialComponent {
  // Inputs
  pastEntries = input.required<JournalEntry[]>();
}
