"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const GetAllUsersUseCase_1 = require("../../application/usecases/users/GetAllUsersUseCase");
const UserImpl_1 = require("../repositories/UserImpl");
class UserController {
    constructor() {
        this.getAllUsers = async (req, res, next) => {
            try {
                const users = await this.getAllUsersUseCase.execute();
                // Remove passwords before sending response
                const sanitizedUsers = users.map(user => {
                    const { password, ...userWithoutPassword } = user;
                    return userWithoutPassword;
                });
                res.status(200).json({
                    success: true,
                    data: sanitizedUsers
                });
            }
            catch (error) {
                next(error);
            }
        };
        const userRepository = new UserImpl_1.UserImpl();
        this.getAllUsersUseCase = new GetAllUsersUseCase_1.GetAllUsersUseCase(userRepository);
    }
}
exports.UserController = UserController;
