import { NextResponse } from "next/server";
import { createCheckoutWithRealProvider } from "@/lib/payments/adapter";
import type { CheckoutPayload } from "@/lib/payments/types";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CheckoutPayload;
    const customer = payload.customer;

    if (!customer?.name || !customer?.email || !isValidEmail(customer.email)) {
      return NextResponse.json(
        { error: "Informe nome e e-mail validos para continuar." },
        { status: 400 },
      );
    }

    if (!Array.isArray(payload.items) || !payload.items.length) {
      return NextResponse.json(
        { error: "Nenhum item enviado para o checkout." },
        { status: 400 },
      );
    }

    const checkout = await createCheckoutWithRealProvider(payload);
    return NextResponse.json(checkout);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar checkout.";
    const isNotConnected = message.includes("ainda nao conectada");

    return NextResponse.json(
      { error: message },
      { status: isNotConnected ? 501 : 500 },
    );
  }
}
