type Env = {
  AETHER_API_BASE_URL: string;
  AI_ASSISTANT_ENABLED?: string;
  AI_CORS_ALLOWED_ORIGINS?: string;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  GEMINI_TEMPERATURE?: string;
  GEMINI_MAX_OUTPUT_TOKENS?: string;
  AI_MUTATIONS_ENABLED?: string;
};

type AssistantProduct = {
  product_id: string;
  variant_id: string | null;
  name: string;
  description: string | null;
  price: string;
  currency: "USD";
  image_url: string | null;
  product_url: string;
  available: boolean;
  color?: string | null;
  size?: string | null;
  rating: number | null;
};

type AssistantResponse = {
  request_id: string;
  thread_id: string;
  message: string;
  intent: string;
  products: AssistantProduct[];
  cart: Record<string, unknown> | null;
  action: { type: string; status: string; entity_id: string | null; message: string | null };
  suggested_replies: string[];
};

type AssistantRequest = {
  thread_id?: string | null;
  message?: string;
  locale?: string;
  currency?: "USD";
  client_context?: {
    current_product_id?: string | null;
    current_product_slug?: string | null;
    current_category?: string | null;
    current_path?: string | null;
  };
};

const encoder = new TextEncoder();

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }

    const url = new URL(request.url);
    if (url.pathname === "/healthz") {
      return json(request, env, { status: "ok", service: "aether-ai", runtime: "cloudflare-worker", time: new Date().toISOString() });
    }
    if (url.pathname === "/readyz") {
      return json(request, env, {
        status: env.AI_ASSISTANT_ENABLED === "false" ? "disabled" : "ready",
        checks: {
          aetherApi: Boolean(env.AETHER_API_BASE_URL),
          gemini: Boolean(env.GEMINI_API_KEY),
        },
      });
    }
    if (url.pathname === "/metrics") {
      return new Response("aether_ai_worker_ready 1\n", {
        headers: { ...corsHeaders(request, env), "content-type": "text/plain; charset=utf-8" },
      });
    }
    if (request.method === "POST" && url.pathname === "/v1/assistant/messages") {
      return json(request, env, await handleAssistant(request, env));
    }
    if (request.method === "POST" && url.pathname === "/v1/assistant/messages/stream") {
      return streamAssistant(request, env);
    }

    return json(request, env, { error: "not_found" }, 404);
  },
};

async function handleAssistant(request: Request, env: Env): Promise<AssistantResponse> {
  const body = (await request.json().catch(() => ({}))) as AssistantRequest;
  const requestId = crypto.randomUUID();
  const threadId = body.thread_id || crypto.randomUUID();
  const locale = body.locale || "es-CO";
  const spanish = locale.toLowerCase().startsWith("es");
  const message = String(body.message || "").slice(0, 4000);
  const cartId = request.headers.get("x-aether-cart-id") || "";
  const cartToken = request.headers.get("x-aether-cart-token") || "";
  const intent = await classifyIntent(message, env);

  if (env.AI_ASSISTANT_ENABLED === "false") {
    return responsePayload(requestId, threadId, spanish ? "El asistente esta desactivado temporalmente." : "The assistant is temporarily disabled.", "UNSUPPORTED");
  }

  if (intent === "GET_CART" || intent === "CHECKOUT_REQUEST") {
    const cart = cartId && cartToken ? await fetchCart(env, cartId, cartToken) : null;
    if (!cart) {
      return responsePayload(
        requestId,
        threadId,
        spanish ? "Necesito validar tu carrito antes de consultarlo. Vuelve a abrir la tienda e intenta de nuevo." : "I need to validate your cart before reading it. Reopen the store and try again.",
        intent,
        [],
        null,
        "ASK_CLARIFICATION",
        "PENDING"
      );
    }
    const reply =
      intent === "CHECKOUT_REQUEST"
        ? spanish
          ? "Puedo preparar tu carrito, pero el pago se completa en el checkout seguro de Aether."
          : "I can prepare your cart, but payment must be completed through Aether secure checkout."
        : spanish
          ? `Tu carrito tiene ${Number(cart.item_count || 0)} producto(s).`
          : `Your cart has ${Number(cart.item_count || 0)} item(s).`;
    return responsePayload(requestId, threadId, reply, intent, [], cart, intent === "CHECKOUT_REQUEST" ? "OPEN_CHECKOUT" : "OPEN_CART", "SUCCEEDED");
  }

  if (intent === "REMOVE_FROM_CART" || intent === "UPDATE_CART_ITEM" || intent === "CLEAR_CART") {
    if (env.AI_MUTATIONS_ENABLED === "false") {
      return responsePayload(requestId, threadId, spanish ? "Los cambios del carrito estan desactivados temporalmente." : "Cart changes are temporarily disabled.", intent, [], null, "ASK_CLARIFICATION", "PENDING");
    }
    if (!cartId || !cartToken) {
      return responsePayload(requestId, threadId, spanish ? "Necesito validar tu carrito antes de actualizarlo." : "I need to validate your cart before updating it.", intent, [], null, "ASK_CLARIFICATION", "PENDING");
    }
    const cart = await fetchCart(env, cartId, cartToken);
    if (!cart) {
      return responsePayload(requestId, threadId, spanish ? "No pude consultar tu carrito. No realice ningun cambio." : "I could not read your cart. No changes were made.", intent, [], null, "ASK_CLARIFICATION", "FAILED");
    }
    if (intent === "CLEAR_CART") {
      if (!hasClearCartConfirmation(message)) {
        return responsePayload(requestId, threadId, spanish ? "Para vaciar todo el carrito necesito una confirmacion explicita." : "To clear the entire cart I need explicit confirmation.", intent, [], cart, "ASK_CLARIFICATION", "PENDING");
      }
      const updated = await clearCart(env, cartId, cartToken, cart);
      return responsePayload(requestId, threadId, spanish ? "Listo. Vacie el carrito." : "Done. I cleared the cart.", intent, [], updated || cart, updated ? "CART_CLEARED" : "ASK_CLARIFICATION", updated ? "SUCCEEDED" : "FAILED");
    }
    const item = resolveCartItem(cart, message);
    if (!item) {
      return responsePayload(requestId, threadId, spanish ? "Necesito saber exactamente que producto del carrito quieres cambiar." : "I need to know exactly which cart item you want to change.", intent, [], cart, "ASK_CLARIFICATION", "PENDING");
    }
    const itemId = String(item.slug || item.variantId || item.productId || "");
    if (intent === "REMOVE_FROM_CART") {
      const updated = await removeCartItem(env, cartId, cartToken, itemId);
      return responsePayload(requestId, threadId, spanish ? "Listo. Quite el producto del carrito." : "Done. I removed the item from your cart.", intent, [], updated || cart, updated ? "CART_ITEM_REMOVED" : "ASK_CLARIFICATION", updated ? "SUCCEEDED" : "FAILED");
    }
    const quantity = extractQuantity(message);
    if (!quantity) {
      return responsePayload(requestId, threadId, spanish ? "Indica una cantidad entre 1 y 25 para actualizar el carrito." : "Tell me a quantity from 1 to 25 to update the cart.", intent, [], cart, "ASK_CLARIFICATION", "PENDING");
    }
    const updated = await updateCartItem(env, cartId, cartToken, itemId, quantity);
    return responsePayload(requestId, threadId, spanish ? `Listo. Actualice la cantidad a ${quantity}.` : `Done. I updated the quantity to ${quantity}.`, intent, [], updated || cart, updated ? "CART_ITEM_UPDATED" : "ASK_CLARIFICATION", updated ? "SUCCEEDED" : "FAILED");
  }

  const contextProduct = await currentContextProduct(env, body);
  const products = contextProduct ? [contextProduct] : await searchProducts(env, message);
  if (intent === "ADD_TO_CART") {
    if (env.AI_MUTATIONS_ENABLED === "false") {
      return responsePayload(requestId, threadId, spanish ? "Los cambios del carrito estan desactivados temporalmente." : "Cart changes are temporarily disabled.", intent, products, null, "ASK_CLARIFICATION", "PENDING");
    }
    if (!cartId || !cartToken) {
      return responsePayload(requestId, threadId, spanish ? "Necesito validar tu carrito antes de actualizarlo." : "I need to validate your cart before updating it.", intent, products, null, "ASK_CLARIFICATION", "PENDING");
    }
    if (products.length !== 1) {
      return responsePayload(requestId, threadId, spanish ? "Encontre varias opciones. Dime cual quieres agregar antes de modificar el carrito." : "I found multiple options. Tell me which one to add before I change the cart.", intent, products, null, "ASK_CLARIFICATION", "PENDING");
    }
    const product = products[0];
    if (product) {
      const cart = await addToCart(env, cartId, cartToken, product, extractQuantity(message) || 1);
      if (cart) {
        return responsePayload(requestId, threadId, spanish ? "Listo. Agregue el producto al carrito." : "Done. I added the product to your cart.", intent, [product], cart, "CART_ITEM_ADDED", "SUCCEEDED");
      }
    }
  }

  if (products.length > 0) {
    return responsePayload(requestId, threadId, spanish ? "Encontre estas opciones reales en Aether." : "I found these real options in Aether.", intent, products);
  }
  return responsePayload(requestId, threadId, spanish ? "Puedo ayudarte a buscar productos reales y revisar tu carrito." : "I can help you search real products and review your cart.", intent);
}

async function streamAssistant(request: Request, env: Env): Promise<Response> {
  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(sse("assistant.status", { message: "Buscando..." }));
        const payload = await handleAssistant(request, env);
        if (payload.products.length) controller.enqueue(sse("assistant.products", payload.products));
        if (payload.cart) controller.enqueue(sse("assistant.cart_updated", payload.cart));
        controller.enqueue(sse("assistant.completed", payload));
      } catch {
        controller.enqueue(sse("assistant.error", { message: "El asistente esta temporalmente ocupado." }));
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      ...corsHeaders(request, env),
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache",
    },
  });
}

async function classifyIntent(message: string, env: Env): Promise<string> {
  const fallback = heuristicIntent(message);
  if (!env.GEMINI_API_KEY) return fallback;
  try {
    const model = env.GEMINI_MODEL || "gemini-3.5-flash";
    const response = await fetchWithTimeout(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "Classify an Aether store assistant message. Return JSON only with intent. Allowed intents: SEARCH_PRODUCTS, RECOMMEND_PRODUCTS, GET_PRODUCT_DETAILS, COMPARE_PRODUCTS, CHECK_VARIANT_AVAILABILITY, GET_CART, ADD_TO_CART, UPDATE_CART_ITEM, REMOVE_FROM_CART, CLEAR_CART, CHECKOUT_REQUEST, GENERAL_STORE_QUESTION, UNSUPPORTED.",
            },
          ],
        },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: {
          temperature: Number(env.GEMINI_TEMPERATURE || 0.1),
          maxOutputTokens: Number(env.GEMINI_MAX_OUTPUT_TOKENS || 600),
          responseMimeType: "application/json",
        },
      }),
    }, 2500);
    if (!response.ok) return fallback;
    const data = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
    const parsed = text ? (JSON.parse(text) as { intent?: string }) : {};
    return parsed.intent || fallback;
  } catch {
    return fallback;
  }
}

function heuristicIntent(message: string): string {
  const value = message.toLowerCase();
  if (/(vacia|vaciar|limpia|clear|empty).*(carrito|cart)|elimina todo|quita todo/.test(value)) return "CLEAR_CART";
  if (/(quita|elimina|remueve|remove|delete).*(carrito|cart|producto|item|audifono|zapato|tenis|mouse|shirt|shoe)/.test(value)) return "REMOVE_FROM_CART";
  if (/(cambia|actualiza|update).*(cantidad|quantity)|cantidad.*\d+/.test(value)) return "UPDATE_CART_ITEM";
  if (/(pagar|checkout|payment|pay|comprar ahora)/.test(value)) return "CHECKOUT_REQUEST";
  if (/(carrito|cart)/.test(value)) return "GET_CART";
  if (/(agrega|anade|añade|add|pon|mete)/.test(value)) return "ADD_TO_CART";
  if (/(busca|buscar|show|find|recomienda|recommend|producto|product|oferta|deal|zapato|shoe|tenis|ropa|shirt)/.test(value)) return "SEARCH_PRODUCTS";
  return "GENERAL_STORE_QUESTION";
}

async function currentContextProduct(env: Env, body: AssistantRequest): Promise<AssistantProduct | null> {
  const slug = body.client_context?.current_product_slug;
  if (!slug) return null;
  const response = await fetchWithTimeout(new URL(`/api/v1/catalog/products/${encodeURIComponent(slug)}`, env.AETHER_API_BASE_URL), undefined, 5000);
  if (!response.ok) return null;
  const payload = (await response.json()) as { data?: unknown };
  return toAssistantProduct(payload.data);
}

async function searchProducts(env: Env, message: string): Promise<AssistantProduct[]> {
  const query = extractQuery(message);
  const apiUrl = new URL("/api/v1/catalog/products", env.AETHER_API_BASE_URL);
  apiUrl.searchParams.set("page", "1");
  apiUrl.searchParams.set("pageSize", "5");
  apiUrl.searchParams.set("inStock", "true");
  if (query) apiUrl.searchParams.set("q", query);
  const response = await fetchWithTimeout(apiUrl, undefined, 5000);
  if (!response.ok) return [];
  const payload = (await response.json()) as { data?: unknown[] };
  return (payload.data || []).map(toAssistantProduct).filter(Boolean).slice(0, 5) as AssistantProduct[];
}

async function fetchCart(env: Env, cartId: string, cartToken: string): Promise<Record<string, unknown> | null> {
  const response = await fetchWithTimeout(new URL(`/api/v1/cart/${encodeURIComponent(cartId)}`, env.AETHER_API_BASE_URL), {
    headers: { "x-aether-cart-token": cartToken },
  }, 5000);
  if (!response.ok) return null;
  const payload = (await response.json()) as { data?: { items?: unknown[]; totals?: { subtotal?: number; currency?: string } } };
  const cart = payload.data;
  if (!cart) return null;
  return {
    item_count: Array.isArray(cart.items) ? cart.items.reduce((count, item) => count + Number((item as { quantity?: number }).quantity || 0), 0) : 0,
    subtotal: String(Number(cart.totals?.subtotal || 0) / 100),
    currency: "USD",
    items: cart.items || [],
  };
}

async function addToCart(env: Env, cartId: string, cartToken: string, product: AssistantProduct, quantity: number): Promise<Record<string, unknown> | null> {
  const slug = product.product_url.split("slug=")[1]?.split("&")[0] || product.product_id;
  const response = await fetchWithTimeout(new URL(`/api/v1/cart/${encodeURIComponent(cartId)}/items`, env.AETHER_API_BASE_URL), {
    method: "POST",
    headers: { "content-type": "application/json", "x-aether-cart-token": cartToken },
    body: JSON.stringify({ productId: decodeURIComponent(slug), variantId: product.variant_id || undefined, quantity }),
  }, 5000);
  if (!response.ok) return null;
  return fetchCart(env, cartId, cartToken);
}

async function removeCartItem(env: Env, cartId: string, cartToken: string, itemId: string): Promise<Record<string, unknown> | null> {
  const response = await fetchWithTimeout(new URL(`/api/v1/cart/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}`, env.AETHER_API_BASE_URL), {
    method: "DELETE",
    headers: { "x-aether-cart-token": cartToken },
  }, 5000);
  if (!response.ok) return null;
  return toCartSummary(await response.json());
}

async function updateCartItem(env: Env, cartId: string, cartToken: string, itemId: string, quantity: number): Promise<Record<string, unknown> | null> {
  const response = await fetchWithTimeout(new URL(`/api/v1/cart/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}`, env.AETHER_API_BASE_URL), {
    method: "PATCH",
    headers: { "content-type": "application/json", "x-aether-cart-token": cartToken },
    body: JSON.stringify({ quantity }),
  }, 5000);
  if (!response.ok) return null;
  return toCartSummary(await response.json());
}

async function clearCart(env: Env, cartId: string, cartToken: string, cart: Record<string, unknown>): Promise<Record<string, unknown> | null> {
  const items = Array.isArray(cart.items) ? cart.items : [];
  let latest: Record<string, unknown> | null = cart;
  for (const entry of items) {
    const item = entry as Record<string, unknown>;
    const itemId = String(item.slug || item.variantId || item.productId || "");
    if (itemId) latest = await removeCartItem(env, cartId, cartToken, itemId);
  }
  return latest;
}

function toCartSummary(payload: unknown): Record<string, unknown> | null {
  const data = (payload as { data?: { items?: unknown[]; totals?: { subtotal?: number; currency?: string } } }).data;
  if (!data) return null;
  return {
    item_count: Array.isArray(data.items) ? data.items.reduce((count, item) => count + Number((item as { quantity?: number }).quantity || 0), 0) : 0,
    subtotal: String(Number(data.totals?.subtotal || 0) / 100),
    currency: "USD",
    items: data.items || [],
  };
}

function resolveCartItem(cart: Record<string, unknown>, message: string): Record<string, unknown> | null {
  const items = Array.isArray(cart.items) ? (cart.items as Record<string, unknown>[]) : [];
  if (items.length === 0) return null;
  const value = message.toLowerCase();
  const named = items.filter((item) => {
    const haystack = `${String(item.name || "")} ${String(item.slug || "")}`.toLowerCase();
    return haystack.split(/[-\s]+/).some((part) => part.length > 2 && value.includes(part));
  });
  if (named.length === 1) return named[0];
  if (named.length > 1) return null;
  return items.length === 1 ? items[0] : null;
}

function extractQuantity(message: string): number | null {
  const numeric = message.match(/\b([1-9]|1\d|2[0-5])\b/);
  if (numeric) return Number(numeric[1]);
  const value = message.toLowerCase();
  const words: Record<string, number> = { uno: 1, una: 1, dos: 2, tres: 3, four: 4, cuatro: 4, five: 5, cinco: 5 };
  for (const [word, quantity] of Object.entries(words)) {
    if (value.includes(word)) return quantity;
  }
  return null;
}

function hasClearCartConfirmation(message: string): boolean {
  return /(confirmo|si,? vacia|si vaciar|yes,? clear|confirm clear|vacia todo)/i.test(message);
}

function toAssistantProduct(input: unknown): AssistantProduct | null {
  const product = input as Record<string, any>;
  if (!product || !product.slug || !product.name) return null;
  return {
    product_id: String(product.id || product.slug),
    variant_id: product.variants?.[0]?.id ? String(product.variants[0].id) : null,
    name: String(product.name),
    description: String(product.shortDescription || product.description || ""),
    price: String(Number(product.finalPrice || product.price || 0) / 100),
    currency: "USD",
    image_url: product.images?.[0]?.url || product.thumbnail || null,
    product_url: `/store/products/detail?slug=${encodeURIComponent(String(product.slug))}`,
    available: Number(product.availableStock || 0) > 0,
    color: product.variants?.[0]?.attributes?.color || null,
    size: product.variants?.[0]?.attributes?.size || null,
    rating: typeof product.rating?.average === "number" ? product.rating.average : null,
  };
}

function extractQuery(message: string): string {
  return message
    .replace(/agrega|anade|añade|add|busca|buscar|show|find|recomienda|recommend|producto|product|oferta|deal/gi, "")
    .trim()
    .slice(0, 80);
}

function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit, timeoutMs = 5000): Promise<Response> {
  return fetch(input, { ...init, signal: AbortSignal.timeout(timeoutMs) });
}

function responsePayload(
  requestId: string,
  threadId: string,
  message: string,
  intent: string,
  products: AssistantProduct[] = [],
  cart: Record<string, unknown> | null = null,
  actionType = products.length ? "PRODUCTS_LISTED" : "NONE",
  actionStatus = products.length ? "SUCCEEDED" : "NOT_REQUESTED"
): AssistantResponse {
  const spanish = /[áéíóúñ]|carrito|producto|encontre|listo/i.test(message);
  return {
    request_id: requestId,
    thread_id: threadId,
    message,
    intent,
    products,
    cart,
    action: { type: actionType, status: actionStatus, entity_id: null, message: null },
    suggested_replies: spanish ? ["Ver carrito", "Buscar ofertas"] : ["View cart", "Search deals"],
  };
}

function sse(event: string, data: unknown): Uint8Array {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function json(request: Request, env: Env, payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders(request, env), "content-type": "application/json; charset=utf-8" },
  });
}

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get("origin") || "";
  const allowed = (env.AI_CORS_ALLOWED_ORIGINS || "*").split(",").map((item) => item.trim());
  const allowOrigin = allowed.includes("*") || allowed.includes(origin) ? origin || "*" : allowed[0] || "*";
  return {
    "access-control-allow-origin": allowOrigin,
    "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "access-control-allow-headers": "content-type,x-aether-cart-id,x-aether-session-id,x-aether-cart-token",
    "vary": "Origin",
  };
}
