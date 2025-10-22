import { Request } from 'express';

// --- USUARIO --- //
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  password: string;
}

// --- REQUESTS DE AUTH --- //
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// --- REQUEST EXTENDIDO CON USER --- //
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// --- JWT --- //
export interface JWTPayload {
  userId: string;
  email: string;
}

// --- METAS --- //
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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

// --- JOURNAL ENTRIES --- //
export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJournalEntryRequest {
  content: string;
}

export interface UpdateJournalEntryRequest {
  content: string;
}

// --- AI ANALYSIS --- //
export interface AIAnalysis {
  id: string;
  userId: string;
  journalEntryId: string;
  analysisContent: string;
  aiProvider: string;
  createdAt: Date;
}

export interface CreateAIAnalysisRequest {
  journalEntryId: string;
  goalIds?: string[]; // IDs de las metas relevantes
  aiProvider?: 'openai';
}

// --- RESPUESTAS API --- //
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// --- ERROR HANDLING --- //
export interface ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
}
