import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header/Navigation -->
      <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-gray-800">
                🌱 <span class="text-blue-600">GroundedGrowth</span>
              </h1>
            </div>

            <!-- Navigation -->
            <nav class="hidden md:flex space-x-8">
              <button
                (click)="navigateTo('/dashboard/goals')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                [class.text-blue-600]="currentRoute().includes('goals')"
              >
                🎯 Metas
              </button>
              <button
                (click)="navigateTo('/dashboard/journal')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                [class.text-blue-600]="currentRoute().includes('journal')"
              >
                📔 Diario
              </button>
              <button
                (click)="navigateTo('/dashboard/analysis')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                [class.text-blue-600]="currentRoute().includes('analysis')"
              >
                🤖 Análisis IA
              </button>
            </nav>

            <!-- User Menu -->
            <div class="flex items-center space-x-4">
              @if (user()) {
              <span class="text-sm text-gray-600">
                Hola, <span class="font-medium">{{ user()!.name }}</span>
              </span>
              }
              <button
                (click)="logout()"
                class="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          <!-- Mobile Navigation -->
          <div class="md:hidden">
            <div class="flex space-x-1 pb-3">
              <button
                (click)="navigateTo('/dashboard/goals')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-xs font-medium transition-colors flex-1 text-center"
                [class.text-blue-600]="currentRoute().includes('goals')"
              >
                🎯 Metas
              </button>
              <button
                (click)="navigateTo('/dashboard/journal')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-xs font-medium transition-colors flex-1 text-center"
                [class.text-blue-600]="currentRoute().includes('journal')"
              >
                📔 Diario
              </button>
              <button
                (click)="navigateTo('/dashboard/analysis')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-xs font-medium transition-colors flex-1 text-center"
                [class.text-blue-600]="currentRoute().includes('analysis')"
              >
                🤖 IA
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Quick Stats -->
        @if (showStats()) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  🎯
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Metas Activas</h3>
                <p class="text-2xl font-bold text-blue-600">{{ stats().activeGoals }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  📔
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Entradas Diario</h3>
                <p class="text-2xl font-bold text-green-600">{{ stats().journalEntries }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  🤖
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Análisis IA</h3>
                <p class="text-2xl font-bold text-purple-600">{{ stats().aiAnalyses }}</p>
              </div>
            </div>
          </div>
        </div>
        }

        <!-- Content Area -->
        <div class="bg-white rounded-lg shadow min-h-96">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals
  user = signal(this.authService.currentUser);
  currentRoute = signal(this.router.url);
  showStats = signal(this.router.url === '/dashboard');
  stats = signal({
    activeGoals: 0,
    journalEntries: 0,
    aiAnalyses: 0,
  });

  constructor() {
    // Actualizar ruta actual cuando cambie
    this.router.events.subscribe(() => {
      this.currentRoute.set(this.router.url);
      this.showStats.set(this.router.url === '/dashboard');
    });

    // Cargar estadísticas si el usuario está autenticado
    if (this.user()) {
      this.loadStats();
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  private loadStats(): void {
    // TODO: Implementar carga de estadísticas desde los services
    // Por ahora, datos de ejemplo
    this.stats.set({
      activeGoals: 3,
      journalEntries: 12,
      aiAnalyses: 8,
    });
  }
}
