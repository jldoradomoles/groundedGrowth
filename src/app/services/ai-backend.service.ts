import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AIAnalysis } from './journal.service';
import { environment } from '../../environments/environment';

export interface CreateAIAnalysisRequest {
  journalEntryId: string;
  goalIds?: string[];
  aiProvider?: 'openai';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface SetProviderRequest {
  provider: 'openai';
}

@Injectable({
  providedIn: 'root',
})
export class AIService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/ai`;

  // --- ANALIZAR ENTRADA DEL DIARIO --- //
  analyzeJournalEntry(request: CreateAIAnalysisRequest): Observable<ApiResponse<AIAnalysis>> {
    return this.http.post<ApiResponse<AIAnalysis>>(`${this.apiUrl}/analyze`, request, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // --- OBTENER TODOS LOS ANÁLISIS DEL USUARIO --- //
  getUserAnalyses(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/analyses?page=${page}&limit=${limit}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // --- OBTENER ANÁLISIS POR ID --- //
  getAnalysisById(id: string): Observable<ApiResponse<AIAnalysis>> {
    return this.http.get<ApiResponse<AIAnalysis>>(`${this.apiUrl}/analyses/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // --- OBTENER ANÁLISIS DE UNA ENTRADA ESPECÍFICA --- //
  getAnalysesForEntry(journalEntryId: string): Observable<ApiResponse<AIAnalysis[]>> {
    return this.http.get<ApiResponse<AIAnalysis[]>>(`${this.apiUrl}/entry/${journalEntryId}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // --- CONFIGURAR PROVEEDOR DE IA --- //
  setAIProvider(provider: 'openai'): Observable<ApiResponse<{ provider: string }>> {
    return this.http.post<ApiResponse<{ provider: string }>>(
      `${this.apiUrl}/provider`,
      { provider },
      {
        headers: this.authService.getAuthHeaders(),
      }
    );
  }
}
