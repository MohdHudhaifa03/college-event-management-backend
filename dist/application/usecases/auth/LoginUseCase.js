"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const error_1 = require("../../../shared/error");
// In a real app, use bcrypt to compare passwords and jsonwebtoken to sign tokens
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { config } from '../../../config';
class LoginUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new error_1.AppError('Invalid email or password', 401);
        }
        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = password === user.password; // Simplified for this example
        if (!isMatch) {
            throw new error_1.AppError('Invalid email or password', 401);
        }
        // const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '1d' });
        const token = 'mock-jwt-token-123'; // Simplified
        const { password: _, ...userWithoutPassword } = user;
        return {
            token,
            user: userWithoutPassword
        };
    }
}
exports.LoginUseCase = LoginUseCase;
