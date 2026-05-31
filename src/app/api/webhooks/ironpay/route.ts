import { NextResponse } from "next/server";
import { processPaymentWebhook, validateWebhookSecret } from "@/lib/payments/webhook";

export async function POST(request: Request) {
  try {
    const receivedKey =
      request.headers.get("x-webhook-secret") ||
      request.headers.get("x-api-key") ||
      request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
      null;

    validateWebhookSecret(receivedKey);

    const payload = (await request.json()) as Record<string, unknown>;
    const data = processPaymentWebhook(payload);

    return NextResponse.json({
      received: true,
      message: "Webhook processado com sucesso.",
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao processar webhook.";
    const status = error instanceof Error && error.name === "UnauthorizedWebhook" ? 401 : 400;

    return NextResponse.json({ error: message }, { status });
  }
}
