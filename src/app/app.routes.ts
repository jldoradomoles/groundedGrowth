import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Rutas públicas
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [guestGuard],
  },

  // Rutas protegidas
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'goals',
        loadComponent: () =>
          import('./components/metas/metas.component').then((m) => m.MetasComponent),
      },
      {
        path: 'journal',
        loadComponent: () =>
          import('./components/nueva-entrada/nueva-entrada.component').then(
            (m) => m.NuevaEntradaComponent
          ),
      },
      {
        path: 'analysis',
        loadComponent: () =>
          import('./components/analisis-ia/analisis-ia.component').then(
            (m) => m.AnalisisIaComponent
          ),
      },
      {
        path: '',
        redirectTo: 'goals',
        pathMatch: 'full',
      },
    ],
  },

  // Redirecciones
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
