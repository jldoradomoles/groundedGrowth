import { JWTPayload } from '../types';
export declare const hashPassword: (password: string) => Promise<string>;
export declare const verifyPassword: (password: string, hashedPassword: string) => Promise<boolean>;
export declare const generateToken: (payload: JWTPayload) => string;
export declare const verifyToken: (token: string) => JWTPayload;
export declare const isValidEmail: (email: string) => boolean;
export declare const isValidPassword: (password: string) => {
    isValid: boolean;
    errors: string[];
};
export declare const sanitizeString: (str: string) => string;
export declare const generateId: () => string;
//# sourceMappingURL=auth.utils.d.ts.map