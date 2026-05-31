require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const paymentRoutes = require("./routes/payments");
const webhookRoutes = require("./routes/webhooks");

const app = express();
const port = process.env.PORT || 3000;
const host = "0.0.0.0";

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public"), { index: false }));

app.get("/styles.css", (_req, res) => {
  res.sendFile(path.join(__dirname, "styles.css"));
});

app.get("/script.js", (_req, res) => {
  res.sendFile(path.join(__dirname, "script.js"));
});

app.get("/checkout.css", (_req, res) => {
  res.sendFile(path.join(__dirname, "checkout.css"));
});

app.get("/checkout.js", (_req, res) => {
  res.sendFile(path.join(__dirname, "checkout.js"));
});

app.use("/api/payments", paymentRoutes);
app.use("/api/webhooks", webhookRoutes);

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "guia-definitivo-enem-2026",
    uptime: Math.round(process.uptime()),
  });
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/checkout", (_req, res) => {
  res.sendFile(path.join(__dirname, "checkout.html"));
});

app.get("/checkout.html", (_req, res) => {
  res.sendFile(path.join(__dirname, "checkout.html"));
});

app.listen(port, host, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
