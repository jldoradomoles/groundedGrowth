"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = exports.sanitizeString = exports.isValidPassword = exports.isValidEmail = exports.verifyToken = exports.generateToken = exports.verifyPassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// --- PASSWORD UTILITIES --- //
const hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcryptjs_1.default.hash(password, saltRounds);
};
exports.hashPassword = hashPassword;
const verifyPassword = async (password, hashedPassword) => {
    return await bcryptjs_1.default.compare(password, hashedPassword);
};
exports.verifyPassword = verifyPassword;
// --- JWT UTILITIES --- //
const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    if (!secret) {
        throw new Error('JWT_SECRET no está configurado');
    }
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET no está configurado');
    }
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
// --- VALIDATION UTILITIES --- //
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const isValidPassword = (password) => {
    const errors = [];
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
exports.isValidPassword = isValidPassword;
// --- STRING UTILITIES --- //
const sanitizeString = (str) => {
    return str.trim().replace(/\s+/g, ' ');
};
exports.sanitizeString = sanitizeString;
const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
exports.generateId = generateId;
//# sourceMappingURL=auth.utils.js.map