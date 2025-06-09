"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authService_1 = require("../services/authService");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await (0, authService_1.login)(username, password);
        res.json(result);
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
});
// update password and username
// makesure user is logged in
router.post("/update", authMiddleware_1.authenticateJWT, async (req, res) => {
    const { username, password } = req.body;
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const result = await (0, authService_1.update)(username, password, user.id);
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
});
exports.default = router;
