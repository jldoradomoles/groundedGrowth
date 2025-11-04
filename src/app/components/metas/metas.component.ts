import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalService, Goal } from '../../services/goal.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-metas',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent],
  templateUrl: 'metas.component.html',
  styleUrls: ['./metas.component.scss'],
})
export class MetasComponent implements OnInit {
  private goalService = inject(GoalService);

  // Signals
  goals = signal<Goal[]>([]);
  newGoalText = '';
  isLoading = signal(false);
  errorMessage = signal('');
  showDeleteModal = signal(false);
  goalToDelete = signal<Goal | null>(null);

  ngOnInit(): void {
    this.loadGoals();
  }

  private loadGoals(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.goalService.getGoals().subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.goals.set(response.data);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Error al cargar las metas');
        console.error('Error loading goals:', error);
      },
    });
  }

  addGoal(): void {
    const title = this.newGoalText.trim();
    if (!title) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.goalService.createGoal({ title }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.goals.update((goals) => [response.data, ...goals]);
          this.newGoalText = '';
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Error al crear la meta');
        console.error('Error creating goal:', error);
      },
    });
  }

  toggleGoalStatus(goal: Goal): void {
    const newIsActive = !goal.isActive;

    this.goalService.updateGoal(goal.id, { isActive: newIsActive }).subscribe({
      next: (response) => {
        if (response.success) {
          this.goals.update((goals) => goals.map((g) => (g.id === goal.id ? response.data : g)));
        }
      },
      error: (error) => {
        this.errorMessage.set('Error al actualizar la meta');
        console.error('Error updating goal:', error);
      },
    });
  }

  openDeleteConfirmation(goal: Goal): void {
    this.goalToDelete.set(goal);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const goal = this.goalToDelete();
    if (!goal) return;

    this.goalService.deleteGoal(goal.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.goals.update((goals) => goals.filter((g) => g.id !== goal.id));
          this.showDeleteModal.set(false);
          this.goalToDelete.set(null);
        }
      },
      error: (error) => {
        this.errorMessage.set('Error al eliminar la meta');
        console.error('Error deleting goal:', error);
        this.showDeleteModal.set(false);
      },
    });
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.goalToDelete.set(null);
  }

  getDeleteMessage(): string {
    const goal = this.goalToDelete();
    if (!goal) return '';
    return `Esta acción no se puede deshacer. La meta "${goal.title}" será eliminada permanentemente.`;
  }

  // Utility methods
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES');
  }

  getStatusEmoji(isActive: boolean): string {
    return isActive ? '🎯' : '✅';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Activa' : 'Completada';
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'text-blue-600' : 'text-green-600';
  }
}
