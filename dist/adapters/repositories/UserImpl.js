"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserImpl = void 0;
const database_1 = require("../../infrastructure/database");
const User_1 = require("../models/User");
class UserImpl {
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(User_1.User);
    }
    async findById(id) {
        return this.repository.findOne({ where: { id } });
    }
    async findByEmail(email) {
        return this.repository.findOne({ where: { email } });
    }
    async save(user) {
        return this.repository.save(user);
    }
    async findAll() {
        return this.repository.find();
    }
}
exports.UserImpl = UserImpl;
