import { Component, input } from '@angular/core';

@Component({
  selector: 'app-analisis-ia',
  standalone: true,
  templateUrl: './analisis-ia.component.html',
  styleUrl: './analisis-ia.component.scss',
})
export class AnalisisIaComponent {
  // Inputs
  isLoading = input.required<boolean>();
  error = input.required<string | null>();
  currentAnalysis = input.required<string | null>();
}
