"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_onvif_1 = __importDefault(require("node-onvif"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
async function discoverCameras(timeout = 5000) {
    return new Promise((resolve) => {
        const devices = [];
        node_onvif_1.default.startProbe()
            .then((deviceList) => {
            deviceList.forEach((device) => {
                // Ambil IP address dan port dari xaddrs
                const addressMatch = device.xaddrs[0].match(/http:\/\/([\d.]+):/)?.[1];
                const portMatch = parseInt(device.xaddrs[0].match(/:(\d+)\//)?.[1] || "80", 10);
                if (addressMatch &&
                    device.name &&
                    !devices.some((d) => d.address === addressMatch && d.port === portMatch)) {
                    devices.push({
                        address: addressMatch,
                        port: portMatch,
                        name: device.name,
                    });
                }
            });
            console.log("Discovered ONVIF devices:", devices);
            resolve(devices);
        })
            .catch((err) => {
            console.error("Error discovering ONVIF devices:", err);
            resolve(devices);
        });
        // Timeout fallback supaya resolve pasti selesai
        setTimeout(() => {
            resolve(devices);
        }, timeout);
    });
}
// get cctv by onvif
router.get("/discover/cctv", authMiddleware_1.authenticateJWT, async (req, res) => {
    try {
        const devices = await discoverCameras();
        res.json({ devices });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error during discovery" });
    }
});
exports.default = router;
