import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import http from "http";
import agentsRouter from "./routes/agents.js";
import clientsRouter from "./routes/clients.js";
import { setupWebSocket } from "./websocket/server.js";

const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use("/api/agents", agentsRouter);
app.use("/api/clients", clientsRouter);

app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
