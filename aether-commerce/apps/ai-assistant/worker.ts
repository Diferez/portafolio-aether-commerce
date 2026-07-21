type Env = {
  AETHER_API_BASE_URL: string;
  AI_ASSISTANT_ENABLED?: string;
  AI_CORS_ALLOWED_ORIGINS?: string;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  GEMINI_TEMPERATURE?: string;
  GEMINI_MAX_OUTPUT_TOKENS?: string;
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
  client_context?: Record<string, unknown>;
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
    return responsePayload(
      requestId,
      threadId,
      spanish ? `Tu carrito tiene ${Number(cart.item_count || 0)} producto(s).` : `Your cart has ${Number(cart.item_count || 0)} item(s).`,
      intent,
      [],
      cart,
      "OPEN_CART",
      "SUCCEEDED"
    );
  }

  const products = await searchProducts(env, message);
  if (intent === "ADD_TO_CART") {
    if (!cartId || !cartToken) {
      return responsePayload(requestId, threadId, spanish ? "Necesito validar tu carrito antes de actualizarlo." : "I need to validate your cart before updating it.", intent, products, null, "ASK_CLARIFICATION", "PENDING");
    }
    const product = products[0];
    if (product) {
      const cart = await addToCart(env, cartId, cartToken, product);
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
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "Classify an Aether store assistant message. Return JSON only with intent. Allowed intents: SEARCH_PRODUCTS, RECOMMEND_PRODUCTS, GET_CART, ADD_TO_CART, CHECKOUT_REQUEST, GENERAL_STORE_QUESTION, UNSUPPORTED.",
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
    });
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
  if (/(pagar|checkout|payment|pay|comprar ahora)/.test(value)) return "CHECKOUT_REQUEST";
  if (/(carrito|cart)/.test(value)) return "GET_CART";
  if (/(agrega|anade|añade|add|pon|mete)/.test(value)) return "ADD_TO_CART";
  if (/(busca|buscar|show|find|recomienda|recommend|producto|product|oferta|deal|zapato|shoe|tenis|ropa|shirt)/.test(value)) return "SEARCH_PRODUCTS";
  return "GENERAL_STORE_QUESTION";
}

async function searchProducts(env: Env, message: string): Promise<AssistantProduct[]> {
  const query = extractQuery(message);
  const apiUrl = new URL("/api/v1/catalog/products", env.AETHER_API_BASE_URL);
  apiUrl.searchParams.set("page", "1");
  apiUrl.searchParams.set("pageSize", "5");
  apiUrl.searchParams.set("inStock", "true");
  if (query) apiUrl.searchParams.set("q", query);
  const response = await fetch(apiUrl);
  if (!response.ok) return [];
  const payload = (await response.json()) as { data?: unknown[] };
  return (payload.data || []).map(toAssistantProduct).filter(Boolean).slice(0, 5) as AssistantProduct[];
}

async function fetchCart(env: Env, cartId: string, cartToken: string): Promise<Record<string, unknown> | null> {
  const response = await fetch(new URL(`/api/v1/cart/${encodeURIComponent(cartId)}`, env.AETHER_API_BASE_URL), {
    headers: { "x-aether-cart-token": cartToken },
  });
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

async function addToCart(env: Env, cartId: string, cartToken: string, product: AssistantProduct): Promise<Record<string, unknown> | null> {
  const slug = product.product_url.split("slug=")[1]?.split("&")[0] || product.product_id;
  const response = await fetch(new URL(`/api/v1/cart/${encodeURIComponent(cartId)}/items`, env.AETHER_API_BASE_URL), {
    method: "POST",
    headers: { "content-type": "application/json", "x-aether-cart-token": cartToken },
    body: JSON.stringify({ productId: decodeURIComponent(slug), variantId: product.variant_id || undefined, quantity: 1 }),
  });
  if (!response.ok) return null;
  return fetchCart(env, cartId, cartToken);
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
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,x-aether-cart-id,x-aether-session-id,x-aether-cart-token",
    "vary": "Origin",
  };
}
