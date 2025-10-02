import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-metas',
  standalone: true,
  templateUrl: './metas.component.html',
  styleUrl: './metas.component.scss',
})
export class MetasComponent {
  // Inputs
  goals = input.required<string[]>();
  newGoal = input.required<string>();

  // Outputs
  goalAdded = output<void>();
  goalRemoved = output<number>();
  newGoalChanged = output<string>();

  onNewGoalInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.newGoalChanged.emit(target.value);
  }

  addGoal(): void {
    this.goalAdded.emit();
  }

  removeGoal(index: number): void {
    this.goalRemoved.emit(index);
  }
}
