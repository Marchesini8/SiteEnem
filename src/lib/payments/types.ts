export type CheckoutCustomer = {
  name: string;
  email: string;
  document?: string;
  phone?: string;
};

export type CheckoutItem = {
  title: string;
  price: number;
  quantity: number;
};

export type CheckoutPayload = {
  items: CheckoutItem[];
  customer: CheckoutCustomer;
  delivery?: Record<string, string>;
};

export type CheckoutResult = {
  transaction_hash?: string | null;
  status?: string;
  pix_code?: string | null;
  pix_base64?: string | null;
  checkout_url?: string | null;
  charged_total?: number;
};

export type PaymentStatus = {
  transactionHash: string;
  status: string;
  amount?: number;
  paymentMethod?: string | null;
  paidAt?: string | null;
  isPaid: boolean;
  updatedAt?: string;
};
