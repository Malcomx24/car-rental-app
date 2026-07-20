import Stripe from "stripe";
import { config } from "@/config";

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: "2025-08-27.basil",
  typescript: true,
});

export function formatAmountForDisplay(amount: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatAmountFromStripe(amount: number): number {
  return Math.round(amount);
}
