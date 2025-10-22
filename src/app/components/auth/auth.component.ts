import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, LoginRequest, RegisterRequest } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-5"
    >
      <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">🌱 GroundedGrowth</h1>
          <p class="text-gray-600">Tu asistente de crecimiento personal</p>
        </div>

        <!-- Tabs -->
        <div class="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            (click)="isLogin.set(true)"
            class="flex-1 py-2 px-4 rounded-md transition-all duration-200"
            [class]="
              isLogin() ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            "
          >
            Iniciar Sesión
          </button>
          <button
            (click)="isLogin.set(false)"
            class="flex-1 py-2 px-4 rounded-md transition-all duration-200"
            [class]="
              !isLogin() ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            "
          >
            Registrarse
          </button>
        </div>

        <!-- Login Form -->
        @if (isLogin()) {
        <form (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                [(ngModel)]="loginData.email"
                name="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                [(ngModel)]="loginData.password"
                name="password"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              [disabled]="isLoading() || !loginForm.valid"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              @if (isLoading()) {
              <span class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Iniciando sesión...
              </span>
              } @else { Iniciar Sesión }
            </button>
          </div>
        </form>
        }

        <!-- Register Form -->
        @if (!isLogin()) {
        <form (ngSubmit)="onRegister()" #registerForm="ngForm">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                [(ngModel)]="registerData.name"
                name="name"
                required
                minlength="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu nombre completo"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                [(ngModel)]="registerData.email"
                name="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                [(ngModel)]="registerData.password"
                name="password"
                required
                minlength="6"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <p class="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
            </div>
            <button
              type="submit"
              [disabled]="isLoading() || !registerForm.valid"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              @if (isLoading()) {
              <span class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Registrando...
              </span>
              } @else { Registrarse }
            </button>
          </div>
        </form>
        }

        <!-- Error/Success Messages -->
        @if (errorMessage()) {
        <div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-700 text-sm">{{ errorMessage() }}</p>
        </div>
        } @if (successMessage()) {
        <div class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-green-700 text-sm">{{ successMessage() }}</p>
        </div>
        }

        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-xs text-gray-500">
            Al registrarte, comienzas tu viaje de crecimiento personal con IA
          </p>
        </div>
      </div>
    </div>
  `,
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals
  isLogin = signal(true);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  // Form data
  loginData: LoginRequest = {
    email: '',
    password: '',
  };

  registerData: RegisterRequest = {
    name: '',
    email: '',
    password: '',
  };

  onLogin(): void {
    if (this.isLoading()) return;

    this.clearMessages();
    this.isLoading.set(true);

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.successMessage.set('¡Bienvenido de vuelta! Redirigiendo...');
          // Redirigir después de un breve delay
          setTimeout(() => {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
            this.router.navigate([returnUrl]);
          }, 1000);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error en login:', error);
        this.errorMessage.set(
          error.error?.error ||
            error.error?.message ||
            'Error al iniciar sesión. Verifica tus credenciales.'
        );
      },
    });
  }

  onRegister(): void {
    if (this.isLoading()) return;

    this.clearMessages();
    this.isLoading.set(true);

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.successMessage.set('¡Cuenta creada exitosamente! Redirigiendo...');
          // Redirigir después de un breve delay
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error en registro:', error);
        this.errorMessage.set(
          error.error?.error ||
            error.error?.message ||
            'Error al crear la cuenta. Intenta de nuevo.'
        );
      },
    });
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }
}
