import type { Cart } from "@aether/schemas";
import type { Env } from "../types";

export async function createCheckoutSession(env: Env, cart: Cart) {
  const origin = env.APP_ORIGIN_STORE ?? "http://localhost:3000";
  const simulatedCheckout = {
    checkoutUrl: `${origin}/checkout/success?checkout=simulated&cart=${encodeURIComponent(cart.id)}`
  };

  if (!env.STRIPE_SECRET_KEY) {
    return simulatedCheckout;
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${origin}/account?checkout=success&cart=${encodeURIComponent(cart.id)}`);
  params.set("cancel_url", `${origin}/cart?checkout=cancelled`);
  params.set("metadata[cartId]", cart.id);

  cart.items.forEach((item, index) => {
    params.set(`line_items[${index}][quantity]`, String(item.quantity));
    params.set(`line_items[${index}][price_data][currency]`, "usd");
    params.set(`line_items[${index}][price_data][unit_amount]`, String(item.finalUnitPrice));
    params.set(`line_items[${index}][price_data][product_data][name]`, item.name);
  });

  let response: Response;
  try {
    response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        "content-type": "application/x-www-form-urlencoded"
      },
      body: params
    });
  } catch (error) {
    if (env.AETHER_ENV !== "production") {
      console.info("Stripe checkout unavailable in development. Using simulated checkout.", {
        error: error instanceof Error ? error.name : "unknown"
      });
      return simulatedCheckout;
    }
    console.error("Stripe checkout request failed", {
      error: error instanceof Error ? error.name : "unknown"
    });
    throw new Error("Stripe session could not be created");
  }

  if (!response.ok) {
    if (env.AETHER_ENV !== "production") {
      console.info("Stripe checkout unavailable in development. Using simulated checkout.", {
        status: response.status,
        statusText: response.statusText
      });
      return simulatedCheckout;
    }
    console.error("Stripe checkout failed", {
      status: response.status,
      statusText: response.statusText
    });
    throw new Error("Stripe session could not be created");
  }

  const payload: unknown = await response.json();
  const checkoutUrl =
    payload && typeof payload === "object" && "url" in payload && typeof payload.url === "string"
      ? payload.url
      : `${origin}/cart?checkout=missing-url`;
  return { checkoutUrl };
}

export async function verifyStripeSignature(secret: string, body: string, signatureHeader: string) {
  const timestamp = signatureHeader
    .split(",")
    .find((part) => part.startsWith("t="))
    ?.slice(2);
  const expected = signatureHeader
    .split(",")
    .find((part) => part.startsWith("v1="))
    ?.slice(3);

  if (!timestamp || !expected) {
    return false;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signedPayload = `${timestamp}.${body}`;
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  const actual = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return actual === expected;
}
