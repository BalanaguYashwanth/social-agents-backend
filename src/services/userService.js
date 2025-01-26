"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const db_1 = require("../config/db");
const user_1 = require("../models/user");
class UserService {
    constructor() {
        this.userRepository = db_1.AppDataSource.getRepository(user_1.User);
    }
    async createUser(userData) {
        const user = this.userRepository.create(userData);
        return await this.userRepository.save(user);
    }
    async getUserByFid(fid) {
        return await this.userRepository.findOne({ where: { fid } });
    }
    async getAllUsers() {
        return await this.userRepository.find();
    }
}
exports.UserService = UserService;
