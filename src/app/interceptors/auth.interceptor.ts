import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Agregar token de autorización si está disponible
  const token = authService.token;
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      // Si el token expiró o es inválido
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/auth']);
      }

      return throwError(() => error);
    })
  );
};
