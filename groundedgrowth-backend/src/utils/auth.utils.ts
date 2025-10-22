import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

// --- PASSWORD UTILITIES --- //

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// --- JWT UTILITIES --- //

export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) {
    throw new Error('JWT_SECRET no está configurado');
  }

  return jwt.sign(payload, secret, { expiresIn } as any);
};

export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET no está configurado');
  }

  return jwt.verify(token, secret) as JWTPayload;
};

// --- VALIDATION UTILITIES --- //

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }

  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// --- STRING UTILITIES --- //

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
