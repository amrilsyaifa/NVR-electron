"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(process.cwd(), "backend", "database.sqlite");
exports.db = new sqlite3_1.default.Database(dbPath, (err) => {
    if (err) {
        console.error("Failed to connect database", err);
    }
    else {
        console.log("SQLite database connected");
    }
});
