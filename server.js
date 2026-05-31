require("dotenv").config();

const express = require("express");
const cors = require("cors");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || process.env.HOSTNAME || "0.0.0.0";

const nextApp = next({ dev, hostname: host, port });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (_req, res) => {
    res.json({
      ok: true,
      service: "guia-definitivo-enem-2026",
      uptime: Math.round(process.uptime()),
    });
  });

  app.use((req, res) => handle(req, res));

  app.listen(port, host, () => {
    console.log(`Servidor rodando em http://${host}:${port}`);
  });
});
