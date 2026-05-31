import type { Metadata } from "next";
import { CheckoutPageForm } from "@/components/checkout/CheckoutPageForm";

export const metadata: Metadata = {
  title: "Checkout Seguro",
  description: "Checkout seguro para garantir o Guia Definitivo ENEM 2026.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return <CheckoutPageForm />;
}
