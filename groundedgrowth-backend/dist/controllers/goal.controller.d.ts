import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getGoals: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createGoal: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getGoalById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateGoal: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteGoal: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=goal.controller.d.ts.map