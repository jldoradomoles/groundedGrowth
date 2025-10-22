import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getJournalEntries: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createJournalEntry: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getJournalEntryById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateJournalEntry: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteJournalEntry: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=journal.controller.d.ts.map