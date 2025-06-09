"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cctvService_1 = require("../services/cctvService");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
//create a new CCTV
router.post("/cctv", authMiddleware_1.authenticateJWT, async (req, res) => {
    try {
        const result = await (0, cctvService_1.create)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
});
// get all CCTVs
router.get("/cctvs", async (req, res) => {
    try {
        const result = await (0, cctvService_1.gets)();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// get CCTV by id
router.get("/cctv/:id", authMiddleware_1.authenticateJWT, async (req, res) => {
    try {
        const cctvId = parseInt(req.params.id, 10);
        if (isNaN(cctvId)) {
            res.status(400).json({ error: "Invalid CCTV ID" });
            return;
        }
        const cctv = await (0, cctvService_1.getById)(cctvId);
        if (!cctv) {
            res.status(404).json({ error: "CCTV not found" });
            return;
        }
        res.json(cctv);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while fetching the CCTV" });
    }
});
// update CCTV by id
router.put("/cctv/:id", authMiddleware_1.authenticateJWT, async (req, res) => {
    try {
        const cctvId = parseInt(req.params.id, 10);
        if (isNaN(cctvId)) {
            res.status(400).json({ error: "Invalid CCTV ID" });
            return;
        }
        const updatedCctv = await (0, cctvService_1.update)(cctvId, req.body);
        res.json(updatedCctv);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// delete CCTV by id
router.delete("/cctv/:id", authMiddleware_1.authenticateJWT, async (req, res) => {
    try {
        const cctvId = parseInt(req.params.id, 10);
        if (isNaN(cctvId)) {
            res.status(400).json({ error: "Invalid CCTV ID" });
            return;
        }
        const result = await (0, cctvService_1.deleteID)(cctvId);
        res.json({ message: "CCTV deleted successfully", result });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while deleting the CCTV" });
    }
});
exports.default = router;
