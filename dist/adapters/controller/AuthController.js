"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const LoginUseCase_1 = require("../../application/usecases/auth/LoginUseCase");
const UserImpl_1 = require("../repositories/UserImpl");
class AuthController {
    constructor() {
        this.login = async (req, res, next) => {
            try {
                const { email, password } = req.body;
                const result = await this.loginUseCase.execute(email, password);
                res.status(200).json({
                    success: true,
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        const userRepository = new UserImpl_1.UserImpl();
        this.loginUseCase = new LoginUseCase_1.LoginUseCase(userRepository);
    }
}
exports.AuthController = AuthController;
