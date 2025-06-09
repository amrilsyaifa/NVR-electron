"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = require("../repositories/userRepository");
const jwt_1 = require("../constant/jwt");
const login = async (username, password) => {
    const user = await (0, userRepository_1.getUserByUsername)(username);
    if (!user) {
        throw new Error("User not found");
    }
    const validPassword = await bcrypt_1.default.compare(password, user.password);
    if (!validPassword) {
        throw new Error("Invalid password");
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, jwt_1.SECRET_KEY, {
        expiresIn: "1h",
    });
    return { token };
};
exports.login = login;
const update = async (username, password, userId) => {
    // Here you would typically update the user in the database.
    // For simplicity, let's assume we have a function updateUser that does this.
    const updatedUser = await (0, userRepository_1.updateUser)(userId, { username, password });
    if (!updatedUser) {
        throw new Error("Failed to update user");
    }
    return { message: "Updated successfully" };
};
exports.update = update;
