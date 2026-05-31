# Guia Definitivo ENEM 2026

Landing page de vendas criada com Next.js 15, TypeScript e Tailwind CSS.

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Build

```bash
npm run lint
npm run build
```

## Integracao de pagamento

A arquitetura esta preparada, mas sem integracao ficticia.

Pontos principais:

- `src/app/api/checkout/route.ts`: endpoint principal de checkout.
- `src/lib/payments/adapter.ts`: cole aqui a funcao real que cria o pagamento.
- `src/app/api/payments/status/[transactionHash]/route.ts`: consulta de status.
- `src/app/api/webhooks/ironpay/route.ts`: webhook preparado para a estrutura antiga.
- `.env.example`: variaveis equivalentes ao projeto anterior.

Depois de migrar sua integracao real, o componente `CheckoutModal` ja espera `checkout_url` ou dados Pix (`pix_code`, `pix_base64`, `transaction_hash`).
