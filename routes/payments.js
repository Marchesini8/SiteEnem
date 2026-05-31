const express = require("express");
const paymentService = require("../services/paymentService");

const router = express.Router();

function sanitizeTracking(value = {}) {
  return {
    src: value.src || "",
    utm_source: value.utm_source || "",
    utm_medium: value.utm_medium || "",
    utm_campaign: value.utm_campaign || "",
    utm_term: value.utm_term || "",
    utm_content: value.utm_content || "",
  };
}

router.post("/checkout", async (req, res) => {
  try {
    const { items, customer, delivery } = req.body;
    const tracking = sanitizeTracking(req.body.tracking);

    if (!Array.isArray(items) || !items.length || !customer) {
      return res.status(400).json({ error: "Dados inválidos para gerar pagamento." });
    }

    const payment = await paymentService.createPixPayment({
      items,
      customer,
      delivery: delivery || {},
      tracking,
    });

    return res.json(payment);
  } catch (error) {
    console.error("Erro ao criar pagamento:", error.message);
    return res.status(error.statusCode || 500).json({
      error: error.providerMessage || error.message || "Erro ao criar pagamento.",
    });
  }
});

router.get("/status/:transactionHash", (req, res) => {
  try {
    const payment = paymentService.getPaymentStatus(req.params.transactionHash);

    if (!payment) {
      return res.json({
        transactionHash: req.params.transactionHash,
        status: "pending",
        isPaid: false,
      });
    }

    return res.json(payment);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao consultar pagamento.",
    });
  }
});

module.exports = router;
