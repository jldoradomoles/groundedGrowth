import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';
export declare const errorHandler: (error: ApiError | Error, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const createError: (message: string, statusCode?: number) => ApiError;
//# sourceMappingURL=error.middleware.d.ts.map