import express from "express";
import {
  create,
  gets,
  getById,
  deleteID,
  update,
} from "../services/cctvService";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

//create a new CCTV
router.post("/cctv", authenticateJWT, async (req, res) => {
  try {
    const result = await create(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// get all CCTVs
router.get("/cctvs", async (req, res) => {
  try {
    const result = await gets();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// get CCTV by id
router.get("/cctv/:id", authenticateJWT, async (req, res) => {
  try {
    const cctvId = parseInt(req.params.id, 10);
    if (isNaN(cctvId)) {
      res.status(400).json({ error: "Invalid CCTV ID" });
      return;
    }

    const cctv = await getById(cctvId);
    if (!cctv) {
      res.status(404).json({ error: "CCTV not found" });
      return;
    }
    res.json(cctv);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the CCTV" });
  }
});

// update CCTV by id
router.put("/cctv/:id", authenticateJWT, async (req, res) => {
  try {
    const cctvId = parseInt(req.params.id, 10);
    if (isNaN(cctvId)) {
      res.status(400).json({ error: "Invalid CCTV ID" });
      return;
    }
    const updatedCctv = await update(cctvId, req.body);
    res.json(updatedCctv);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// delete CCTV by id
router.delete("/cctv/:id", authenticateJWT, async (req, res) => {
  try {
    const cctvId = parseInt(req.params.id, 10);
    if (isNaN(cctvId)) {
      res.status(400).json({ error: "Invalid CCTV ID" });
      return;
    }

    const result = await deleteID(cctvId);
    res.json({ message: "CCTV deleted successfully", result });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the CCTV" });
  }
});

export default router;
