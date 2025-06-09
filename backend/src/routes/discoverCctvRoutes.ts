import express from "express";
import Onvif from "node-onvif";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

async function discoverCameras(
  timeout = 5000
): Promise<{ address: string; port: number; name: string }[]> {
  return new Promise((resolve) => {
    const devices: { address: string; port: number; name: string }[] = [];

    Onvif.startProbe()
      .then((deviceList: any) => {
        deviceList.forEach((device: any) => {
          // Ambil IP address dan port dari xaddrs
          const addressMatch =
            device.xaddrs[0].match(/http:\/\/([\d.]+):/)?.[1];
          const portMatch = parseInt(
            device.xaddrs[0].match(/:(\d+)\//)?.[1] || "80",
            10
          );

          if (
            addressMatch &&
            device.name &&
            !devices.some(
              (d) => d.address === addressMatch && d.port === portMatch
            )
          ) {
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
router.get("/discover/cctv", authenticateJWT, async (req, res) => {
  try {
    const devices = await discoverCameras();
    res.json({ devices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during discovery" });
  }
});

export default router;
