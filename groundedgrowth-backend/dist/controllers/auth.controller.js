"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenEndpoint = exports.getProfile = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const auth_utils_1 = require("../utils/auth.utils");
const error_middleware_1 = require("../middleware/error.middleware");
const prisma = new client_1.PrismaClient();
// --- REGISTRO --- //
const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        // Validaciones
        if (!email || !password || !name) {
            return next((0, error_middleware_1.createError)('Email, contraseña y nombre son requeridos', 400));
        }
        if (!(0, auth_utils_1.isValidEmail)(email)) {
            return next((0, error_middleware_1.createError)('Email inválido', 400));
        }
        const passwordValidation = (0, auth_utils_1.isValidPassword)(password);
        if (!passwordValidation.isValid) {
            return next((0, error_middleware_1.createError)(passwordValidation.errors.join(', '), 400));
        }
        const sanitizedName = (0, auth_utils_1.sanitizeString)(name);
        if (sanitizedName.length < 2) {
            return next((0, error_middleware_1.createError)('El nombre debe tener al menos 2 caracteres', 400));
        }
        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (existingUser) {
            return next((0, error_middleware_1.createError)('El email ya está registrado', 409));
        }
        // Crear usuario
        const hashedPassword = await (0, auth_utils_1.hashPassword)(password);
        const newUser = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                name: sanitizedName,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        // Generar token
        const token = (0, auth_utils_1.generateToken)({
            userId: newUser.id,
            email: newUser.email,
        });
        console.log(`✅ Usuario registrado: ${newUser.email}`);
        const response = {
            success: true,
            data: {
                user: newUser,
                token,
            },
            message: 'Usuario registrado exitosamente',
        };
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
// --- LOGIN --- //
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Validaciones
        if (!email || !password) {
            return next((0, error_middleware_1.createError)('Email y contraseña son requeridos', 400));
        }
        if (!(0, auth_utils_1.isValidEmail)(email)) {
            return next((0, error_middleware_1.createError)('Email inválido', 400));
        }
        // Buscar usuario
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!user) {
            return next((0, error_middleware_1.createError)('Credenciales inválidas', 401));
        }
        // Verificar contraseña
        const isPasswordValid = await (0, auth_utils_1.verifyPassword)(password, user.password);
        if (!isPasswordValid) {
            return next((0, error_middleware_1.createError)('Credenciales inválidas', 401));
        }
        // Generar token
        const token = (0, auth_utils_1.generateToken)({
            userId: user.id,
            email: user.email,
        });
        console.log(`✅ Usuario logueado: ${user.email}`);
        const userWithoutPassword = {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        const response = {
            success: true,
            data: {
                user: userWithoutPassword,
                token,
            },
            message: 'Login exitoso',
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
// --- OBTENER PERFIL --- //
const getProfile = async (req, res, next) => {
    try {
        if (!req.user) {
            return next((0, error_middleware_1.createError)('Usuario no autenticado', 401));
        }
        const response = {
            success: true,
            data: req.user,
            message: 'Perfil obtenido exitosamente',
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
// --- VERIFICAR TOKEN --- //
const verifyTokenEndpoint = async (req, res, next) => {
    try {
        if (!req.user) {
            return next((0, error_middleware_1.createError)('Token inválido', 401));
        }
        const response = {
            success: true,
            data: {
                valid: true,
                user: req.user,
            },
            message: 'Token válido',
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.verifyTokenEndpoint = verifyTokenEndpoint;
//# sourceMappingURL=auth.controller.js.map