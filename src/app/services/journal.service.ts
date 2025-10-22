import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  aiAnalyses?: AIAnalysis[];
}

export interface AIAnalysis {
  id: string;
  userId: string;
  journalEntryId: string;
  analysisContent: string;
  aiProvider: string;
  createdAt: string;
}

export interface CreateJournalEntryRequest {
  content: string;
}

export interface UpdateJournalEntryRequest {
  content: string;
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
export class JournalService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/journal`;

  // --- OBTENER TODAS LAS ENTRADAS --- //
  getEntries(page: number = 1, limit: number = 10): Observable<PaginatedResponse<JournalEntry>> {
    return this.http.get<PaginatedResponse<JournalEntry>>(
      `${this.apiUrl}?page=${page}&limit=${limit}`,
      {
        headers: this.authService.getAuthHeaders(),
      }
    );
  }

  // --- CREAR ENTRADA --- //
  createEntry(entryData: CreateJournalEntryRequest): Observable<ApiResponse<JournalEntry>> {
    return this.http.post<ApiResponse<JournalEntry>>(this.apiUrl, entryData, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // --- OBTENER ENTRADA POR ID --- //
  getEntryById(id: string): Observable<ApiResponse<JournalEntry>> {
    return this.http.get<ApiResponse<JournalEntry>>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // --- ACTUALIZAR ENTRADA --- //
  updateEntry(
    id: string,
    entryData: UpdateJournalEntryRequest
  ): Observable<ApiResponse<JournalEntry>> {
    return this.http.put<ApiResponse<JournalEntry>>(`${this.apiUrl}/${id}`, entryData, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // --- ELIMINAR ENTRADA --- //
  deleteEntry(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }
}
