import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3001/api/goals';

  // --- OBTENER TODAS LAS METAS --- //
  getGoals(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Goal>> {
    return this.http.get<PaginatedResponse<Goal>>(`${this.apiUrl}?page=${page}&limit=${limit}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // --- CREAR META --- //
  createGoal(goalData: CreateGoalRequest): Observable<ApiResponse<Goal>> {
    return this.http.post<ApiResponse<Goal>>(this.apiUrl, goalData, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // --- OBTENER META POR ID --- //
  getGoalById(id: string): Observable<ApiResponse<Goal>> {
    return this.http.get<ApiResponse<Goal>>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // --- ACTUALIZAR META --- //
  updateGoal(id: string, goalData: UpdateGoalRequest): Observable<ApiResponse<Goal>> {
    return this.http.put<ApiResponse<Goal>>(`${this.apiUrl}/${id}`, goalData, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // --- ELIMINAR META --- //
  deleteGoal(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // --- ACTIVAR/DESACTIVAR META --- //
  toggleGoalStatus(id: string, isActive: boolean): Observable<ApiResponse<Goal>> {
    return this.updateGoal(id, { isActive });
  }
}
