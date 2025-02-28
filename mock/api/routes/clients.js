import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", async (req, res) => {
  try {
    const clients = JSON.parse(await readFile(path.join(__dirname, "../clients.json"), "utf-8"));
    res.json(clients);
  } catch {
    res.status(500).json({ error: "Error reading clients" });
  }
});

export default router;
