const { createServer } = require("http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "127.0.0.1";
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
