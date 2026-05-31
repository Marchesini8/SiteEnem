const express = require("express");
const metaConversionsService = require("../services/metaConversionsService");

const router = express.Router();

const ALLOWED_EVENTS = new Set(["PageView", "ViewContent", "AddToCart", "InitiateCheckout"]);

router.post("/meta", async (req, res) => {
  try {
    const { event_name, event_id, fbp, fbc, custom_data } = req.body || {};

    if (!ALLOWED_EVENTS.has(event_name)) {
      return res.status(400).json({ error: "Evento invalido." });
    }

    const result = await metaConversionsService.sendEvent({
      eventName: event_name,
      eventId: event_id,
      req,
      fbp,
      fbc,
      customData: custom_data,
    });

    return res.json({ ok: true, result });
  } catch (error) {
    console.error("Erro ao enviar evento Meta:", error.response?.data || error.message);
    return res.status(502).json({ error: "Erro ao enviar evento Meta." });
  }
});

module.exports = router;
