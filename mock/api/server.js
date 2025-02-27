import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";

const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/api/agents", async (req, res) => {
  const agents = JSON.parse(await readFile(path.join(__dirname, "agents.json"), "utf-8"));
  res.json(agents);
});

app.get("/api/clients", async (req, res) => {
  const clients = JSON.parse(await readFile(path.join(__dirname, "clients.json"), "utf-8"));
  res.json(clients);
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
});
