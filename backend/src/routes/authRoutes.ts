import express from "express";
import { login, update } from "../services/authService";
import { authenticateJWT, AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await login(username, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// update password and username
// makesure user is logged in
router.post(
  "/update",
  authenticateJWT,
  async (req: AuthRequest, res: Response) => {
    const { username, password } = req.body;
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const result = await update(username, password, user.id);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
);

export default router;
