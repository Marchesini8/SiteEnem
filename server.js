const { createServer } = require("http");
const next = require("next");
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = Number(process.env.PORT || 3000);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (error) {
      console.error("Erro ao processar requisicao:", error);
      res.statusCode = 500;
      res.end("Erro interno do servidor");
    }
  }).listen(port, hostname, () => {
    console.log(`Servidor rodando em http://${hostname}:${port}`);
  });
});
