import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalService, Goal } from '../../services/goal.service';

@Component({
  selector: 'app-metas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">🎯 Mis Metas</h2>
        <p class="text-gray-600">Define y gestiona tus objetivos de crecimiento personal</p>
      </div>

      <!-- Nueva Meta Form -->
      <div class="bg-blue-50 rounded-lg p-4 mb-6">
        <div class="flex gap-3">
          <input
            type="text"
            [(ngModel)]="newGoalText"
            (keyup.enter)="addGoal()"
            placeholder="Escribe tu nueva meta..."
            class="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            (click)="addGoal()"
            [disabled]="!newGoalText.trim() || isLoading()"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            } @else { Agregar }
          </button>
        </div>
      </div>

      <!-- Error Message -->
      @if (errorMessage()) {
      <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700 text-sm">{{ errorMessage() }}</p>
      </div>
      }

      <!-- Goals List -->
      @if (goals().length === 0 && !isLoading()) {
      <div class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">🎯</div>
        <h3 class="text-xl font-medium text-gray-600 mb-2">Aún no tienes metas</h3>
        <p class="text-gray-500">Agrega tu primera meta para comenzar tu viaje de crecimiento</p>
      </div>
      } @else {
      <div class="grid gap-4">
        @for (goal of goals(); track goal.id) {
        <div
          class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="font-medium text-gray-800 mb-1">{{ goal.title }}</h3>
              @if (goal.description) {
              <p class="text-sm text-gray-600 mb-2">{{ goal.description }}</p>
              }
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <span class="flex items-center gap-1"> 📅 {{ formatDate(goal.createdAt) }} </span>
                <span class="flex items-center gap-1" [class]="getStatusClass(goal.isActive)">
                  {{ getStatusEmoji(goal.isActive) }} {{ getStatusText(goal.isActive) }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2 ml-4">
              <!-- Toggle Status Button -->
              <button
                (click)="toggleGoalStatus(goal)"
                class="px-3 py-1 text-xs rounded-full transition-colors"
                [class]="
                  goal.isActive
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                "
              >
                {{ goal.isActive ? 'Completar' : 'Reactivar' }}
              </button>

              <!-- Delete Button -->
              <button
                (click)="deleteGoal(goal.id)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar meta"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
        }
      </div>
      }

      <!-- Loading State -->
      @if (isLoading() && goals().length === 0) {
      <div class="text-center py-12">
        <svg
          class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4"
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
        <p class="text-gray-600">Cargando metas...</p>
      </div>
      }
    </div>
  `,
  styleUrl: './metas.component.scss',
})
export class MetasComponent implements OnInit {
  private goalService = inject(GoalService);

  // Signals
  goals = signal<Goal[]>([]);
  newGoalText = '';
  isLoading = signal(false);
  errorMessage = signal('');

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

  deleteGoal(goalId: string): void {
    if (!confirm('¿Estás seguro de que quieres eliminar esta meta?')) return;

    this.goalService.deleteGoal(goalId).subscribe({
      next: (response) => {
        if (response.success) {
          this.goals.update((goals) => goals.filter((g) => g.id !== goalId));
        }
      },
      error: (error) => {
        this.errorMessage.set('Error al eliminar la meta');
        console.error('Error deleting goal:', error);
      },
    });
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
