# Componente de Modal de Confirmación

## 📋 Descripción

`ConfirmationModalComponent` es un componente reutilizable para mostrar modales de confirmación en la aplicación. Es perfecto para situaciones donde necesitas que el usuario confirme una acción importante como eliminar datos, cancelar cambios, etc.

## ✨ Características

- **Reutilizable**: Puede ser usado en cualquier componente
- **Personalizable**: Diferentes tipos (danger, warning, success, info)
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Accesible**: Incluye overlay para cerrar haciendo clic fuera del modal
- **Animado**: Transiciones suaves al abrir/cerrar

## 🚀 Uso Básico

### 1. Importar el componente

```typescript
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-tu-componente',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent],
  // ...
})
```

### 2. Agregar al template

```html
<app-confirmation-modal
  [isOpen]="showModal()"
  [title]="'¿Estás seguro?'"
  [message]="'Esta acción no se puede deshacer.'"
  [confirmText]="'Sí, continuar'"
  [cancelText]="'Cancelar'"
  [type]="'danger'"
  (confirm)="onConfirm()"
  (cancel)="onCancel()"
/>
```

### 3. Configurar en el componente TypeScript

```typescript
export class TuComponente {
  showModal = signal(false);

  openModal(): void {
    this.showModal.set(true);
  }

  onConfirm(): void {
    // Realizar la acción confirmada
    console.log('Usuario confirmó la acción');
    this.showModal.set(false);
  }

  onCancel(): void {
    // Cerrar el modal sin hacer nada
    this.showModal.set(false);
  }
}
```

## 🎨 Propiedades de Entrada

| Propiedad     | Tipo                                           | Default                               | Descripción                       |
| ------------- | ---------------------------------------------- | ------------------------------------- | --------------------------------- |
| `isOpen`      | `boolean`                                      | `false`                               | Controla si el modal está visible |
| `title`       | `string`                                       | `'¿Estás seguro?'`                    | Título del modal                  |
| `message`     | `string`                                       | `'Esta acción no se puede deshacer.'` | Mensaje descriptivo               |
| `confirmText` | `string`                                       | `'Confirmar'`                         | Texto del botón de confirmación   |
| `cancelText`  | `string`                                       | `'Cancelar'`                          | Texto del botón de cancelar       |
| `type`        | `'danger' \| 'warning' \| 'success' \| 'info'` | `'warning'`                           | Tipo visual del modal             |

## 📤 Eventos de Salida

| Evento    | Tipo   | Descripción                                                       |
| --------- | ------ | ----------------------------------------------------------------- |
| `confirm` | `void` | Se emite cuando el usuario hace clic en el botón de confirmación  |
| `cancel`  | `void` | Se emite cuando el usuario cancela (botón o clic fuera del modal) |

## 🎨 Tipos de Modal

### Danger (Peligro)

Usa colores rojos para acciones destructivas como eliminar datos.

```html
<app-confirmation-modal
  [type]="'danger'"
  [title]="'¿Eliminar esta meta?'"
  [message]="'La meta será eliminada permanentemente.'"
/>
```

### Warning (Advertencia)

Usa colores amarillos para advertencias.

```html
<app-confirmation-modal
  [type]="'warning'"
  [title]="'¿Descartar cambios?'"
  [message]="'Los cambios no guardados se perderán.'"
/>
```

### Success (Éxito)

Usa colores verdes para confirmaciones positivas.

```html
<app-confirmation-modal
  [type]="'success'"
  [title]="'¿Publicar artículo?'"
  [message]="'El artículo estará visible para todos.'"
/>
```

### Info (Información)

Usa colores azules para información general.

```html
<app-confirmation-modal
  [type]="'info'"
  [title]="'¿Continuar?'"
  [message]="'Se te redirigirá a otra página.'"
/>
```

## 💡 Ejemplo Completo: Eliminar Meta

```typescript
import { Component, signal } from '@angular/core';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-metas',
  standalone: true,
  imports: [ConfirmationModalComponent],
  template: `
    <button (click)="openDeleteConfirmation(meta)">Eliminar Meta</button>

    <app-confirmation-modal
      [isOpen]="showDeleteModal()"
      [title]="'¿Eliminar esta meta?'"
      [message]="getDeleteMessage()"
      [confirmText]="'Sí, eliminar'"
      [cancelText]="'Cancelar'"
      [type]="'danger'"
      (confirm)="confirmDelete()"
      (cancel)="cancelDelete()"
    />
  `,
})
export class MetasComponent {
  showDeleteModal = signal(false);
  metaToDelete = signal<Meta | null>(null);

  openDeleteConfirmation(meta: Meta): void {
    this.metaToDelete.set(meta);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const meta = this.metaToDelete();
    if (!meta) return;

    // Llamar al servicio para eliminar
    this.goalService.deleteGoal(meta.id).subscribe({
      next: () => {
        console.log('Meta eliminada');
        this.showDeleteModal.set(false);
        this.metaToDelete.set(null);
      },
      error: (error) => {
        console.error('Error:', error);
        this.showDeleteModal.set(false);
      },
    });
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.metaToDelete.set(null);
  }

  getDeleteMessage(): string {
    const meta = this.metaToDelete();
    return meta ? `La meta "${meta.title}" será eliminada permanentemente.` : '';
  }
}
```

## 🔒 Características de Accesibilidad

- El overlay oscuro se puede hacer clic para cerrar el modal
- Los botones tienen estados hover y focus claros
- El modal se centra en la pantalla
- Transiciones suaves para mejor UX

## 🎯 Casos de Uso Recomendados

✅ **Usar el modal para:**

- Eliminar datos
- Descartar cambios no guardados
- Confirmar acciones irreversibles
- Salir de procesos importantes
- Publicar/despublicar contenido

❌ **NO usar el modal para:**

- Formularios complejos
- Mensajes informativos simples
- Notificaciones de éxito/error (usar toast/snackbar)
- Diálogos con múltiples opciones (más de 2 botones)

## 📝 Notas

- El componente usa Angular Signals para reactividad
- Es standalone, no requiere NgModule
- Usa Tailwind CSS para estilos
- El overlay previene interacciones con el contenido de fondo
