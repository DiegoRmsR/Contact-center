import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", async (req, res) => {
  try {
    const agents = JSON.parse(await readFile(path.join(__dirname, "../agents.json"), "utf-8"));
    res.json(agents);
  } catch {
    res.status(500).json({ error: "Error reading agents" });
  }
});

export default router;
