import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
    <!-- Overlay oscuro -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity"
      (click)="onCancel()"
    ></div>

    <!-- Modal -->
    <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all"
        (click)="$event.stopPropagation()"
      >
        <!-- Icono -->
        <div
          class="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full"
          [ngClass]="getIconClasses()"
        >
          <svg
            class="w-6 h-6"
            [ngClass]="getIconColorClasses()"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            @if (type === 'danger') {
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
            } @else if (type === 'warning') {
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
            } @else if (type === 'success') {
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
            } @else {
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            }
          </svg>
        </div>

        <!-- Título -->
        <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">
          {{ title }}
        </h3>

        <!-- Mensaje -->
        <p class="text-sm text-gray-600 text-center mb-6">
          {{ message }}
        </p>

        <!-- Botones -->
        <div class="flex gap-3">
          <button
            type="button"
            (click)="onCancel()"
            class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            (click)="onConfirm()"
            class="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
            [ngClass]="getConfirmButtonClasses()"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class ConfirmationModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() title = '¿Estás seguro?';
  @Input() message = 'Esta acción no se puede deshacer.';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() type: 'danger' | 'warning' | 'success' | 'info' = 'warning';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  ngOnChanges() {
    console.log('🔔 Modal isOpen changed:', this.isOpen);
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getIconClasses(): string {
    const classes: Record<typeof this.type, string> = {
      danger: 'bg-red-100',
      warning: 'bg-yellow-100',
      success: 'bg-green-100',
      info: 'bg-blue-100',
    };
    return classes[this.type];
  }

  getIconColorClasses(): string {
    const classes: Record<typeof this.type, string> = {
      danger: 'text-red-600',
      warning: 'text-yellow-600',
      success: 'text-green-600',
      info: 'text-blue-600',
    };
    return classes[this.type];
  }

  getConfirmButtonClasses(): string {
    const classes: Record<typeof this.type, string> = {
      danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
      success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    };
    return classes[this.type];
  }
}
