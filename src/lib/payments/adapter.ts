import { product } from "@/lib/guide-data";
import type { CheckoutPayload, CheckoutResult } from "./types";

export function buildGuideCheckoutPayload(customer: CheckoutPayload["customer"]): CheckoutPayload {
  return {
    items: [
      {
        title: product.name,
        price: product.price,
        quantity: 1,
      },
    ],
    customer,
    delivery: {},
  };
}

export async function createCheckoutWithRealProvider(
  payload: CheckoutPayload,
): Promise<CheckoutResult> {
  /*
   * COLE SUA INTEGRACAO REAL AQUI.
   *
   * Este e o ponto equivalente ao antigo services/paymentService.js.
   * Você pode migrar a função createPixPayment do projeto anterior para cá,
   * trocar axios por fetch ou instalar axios novamente, e retornar um objeto:
   *
   * {
   *   transaction_hash: "...",
   *   status: "pending",
   *   pix_code: "...",
   *   pix_base64: "...",
   *   charged_total: 29.9
   * }
   *
   * As variáveis esperadas já estão documentadas no .env.example.
   */
  void payload;

  throw new Error(
    "Integracao de pagamento ainda nao conectada. Cole sua implementacao real em src/lib/payments/adapter.ts.",
  );
}
