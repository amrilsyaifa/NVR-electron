"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUserByUsername = void 0;
const database_1 = require("../config/database");
const getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        database_1.db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
};
exports.getUserByUsername = getUserByUsername;
const updateUser = (userId, updates) => {
    return new Promise((resolve, reject) => {
        const { username, password } = updates;
        const sql = `UPDATE users SET ${username ? "username = ?" : ""} ${password ? ", password = ?" : ""} WHERE id = ?`;
        const params = [];
        if (username)
            params.push(username);
        if (password)
            params.push(password);
        params.push(userId);
        database_1.db.run(sql, params, function (err) {
            if (err)
                reject(err);
            else
                resolve({
                    message: "User updated successfully",
                    changes: this.changes,
                });
        });
    });
};
exports.updateUser = updateUser;
