import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getProfile: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyTokenEndpoint: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map