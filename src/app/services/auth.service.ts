import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'groundedgrowth_token';

  constructor() {
    // Verificar si hay un token guardado al inicializar
    this.checkStoredToken();
  }

  // --- REGISTRO --- //
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap((response) => {
        if (response.success) {
          this.setAuth(response.data.user, response.data.token);
        }
      })
    );
  }

  // --- LOGIN --- //
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.success) {
          this.setAuth(response.data.user, response.data.token);
        }
      })
    );
  }

  // --- LOGOUT --- //
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    console.log('🔓 Usuario deslogueado');
  }

  // --- VERIFICAR TOKEN --- //
  verifyToken(): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/verify`,
        {},
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(
        tap((response: any) => {
          if (response.success) {
            this.currentUserSubject.next(response.data.user);
          } else {
            this.logout();
          }
        })
      );
  }

  // --- OBTENER PERFIL --- //
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, {
      headers: this.getAuthHeaders(),
    });
  }

  // --- HELPERS --- //
  private setAuth(user: User, token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.currentUserSubject.next(user);
    console.log('✅ Usuario autenticado:', user.name);
  }

  private checkStoredToken(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      // Verificar que el token siga siendo válido
      this.verifyToken().subscribe({
        next: () => console.log('✅ Token válido restaurado'),
        error: () => {
          console.log('❌ Token expirado, eliminando...');
          this.logout();
        },
      });
    }
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // --- GETTERS --- //
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser && !!localStorage.getItem(this.tokenKey);
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
