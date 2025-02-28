import { WebSocketServer } from "ws";

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected to WebSocket");

    ws.on("message", (message) => {
    //   console.log(`Message received: ${message}`);

      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          console.log("acaaa");
          console.log(JSON.stringify(...JSON.parse(message)));
          client.send(JSON.stringify(...JSON.parse(message)));
        }
      });
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  console.log("WebSocket server ready");
}
