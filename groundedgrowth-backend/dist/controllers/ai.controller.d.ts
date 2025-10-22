import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const analyzeJournalEntry: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAnalysesForEntry: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAnalysisById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserAnalyses: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const setAIProvider: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=ai.controller.d.ts.map