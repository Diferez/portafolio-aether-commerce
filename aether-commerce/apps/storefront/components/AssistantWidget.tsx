"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Loader2, RotateCcw, Send, ShoppingBag, X } from "lucide-react";
import { formatUsd } from "@aether/core";
import { addProductReferenceToCart, getCartId, getCartToken } from "./cart-client";
import { aiAssistantUrl, storefrontPath } from "./config";
import { useLanguage } from "./LanguageProvider";

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
  cart?: {
    item_count: number;
    subtotal: string;
    currency: "USD";
    items: Array<Record<string, unknown>>;
  } | null;
  action?: {
    type: string;
    status: string;
    entity_id: string | null;
    message: string | null;
  };
  suggested_replies: string[];
};

type AssistantCartSummary = NonNullable<AssistantResponse["cart"]>;
type AssistantStreamData = AssistantResponse | AssistantProduct[] | AssistantCartSummary | { message?: string; text?: string };

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  products?: AssistantProduct[];
  cart?: AssistantResponse["cart"];
  action?: AssistantResponse["action"];
  suggestedReplies?: string[];
  streaming?: boolean;
};

export function AssistantWidget() {
  const { locale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const enabled = Boolean(aiAssistantUrl);

  const copy = useMemo(
    () =>
      locale === "es"
        ? {
            title: "Asistente Aether",
            intro: "Preguntame por productos reales o pide ayuda con tu carrito.",
            placeholder: "Buscar tenis, regalos, ofertas...",
            send: "Enviar",
            reset: "Reiniciar",
            view: "Ver",
            add: "Agregar",
            adding: "Agregando...",
            added: "Agregado al carrito.",
            addError: "No fue posible agregarlo. Intentalo de nuevo.",
            inStock: "Disponible",
            outOfStock: "Agotado",
            variant: "Variante",
            cart: "Carrito",
            items: "productos",
            openCart: "Abrir carrito",
            busy: "Buscando...",
            error: "No pude conectar con el asistente. La tienda sigue funcionando normalmente."
          }
        : {
            title: "Aether Assistant",
            intro: "Ask me for real products or cart help.",
            placeholder: "Search sneakers, gifts, deals...",
            send: "Send",
            reset: "Reset",
            view: "View",
            add: "Add",
            adding: "Adding...",
            added: "Added to cart.",
            addError: "Could not add it. Try again.",
            inStock: "In stock",
            outOfStock: "Out of stock",
            variant: "Variant",
            cart: "Cart",
            items: "items",
            openCart: "Open cart",
            busy: "Searching...",
            error: "I could not reach the assistant. The store still works normally."
          },
    [locale]
  );

  useEffect(() => {
    if (isOpen) {
      panelRef.current?.querySelector("input")?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }, [isOpen, messages, statusMessage]);

  if (!enabled) {
    return null;
  }

  function assistantRequestBody(message: string) {
    const context = assistantClientContext();
    return JSON.stringify({
      thread_id: threadId,
      message,
      locale: locale === "es" ? "es-CO" : "en-US",
      currency: "USD",
      client_context: context
    });
  }

  function assistantClientContext() {
    const path = `${window.location.pathname}${window.location.search}`;
    const categoryMatch = window.location.pathname.match(/\/(?:store\/)?categories\/([^/?#]+)/);
    const params = new URLSearchParams(window.location.search);
    const categorySlug = categoryMatch?.[1] ? decodeURIComponent(categoryMatch[1]) : null;
    return {
      current_path: path,
      current_category: categorySlug,
      current_product_slug: params.get("slug")
    };
  }

  async function assistantRequestHeaders() {
    const cartToken = await getCartToken();
    return {
      "content-type": "application/json",
      "x-aether-cart-id": getCartId(),
      "x-aether-session-id": getCartId(),
      "x-aether-cart-token": cartToken
    };
  }

  async function sendMessage(message = input.trim()) {
    if (!message || isSending) return;
    setInput("");
    setIsSending(true);
    setStatusMessage(null);
    setMessages((current) => [...current, { role: "user", content: message }]);

    try {
      await sendMessageStream(message);
    } catch {
      try {
        await sendMessageFallback(message);
      } catch {
        setMessages((current) => [...current, { role: "assistant", content: copy.error }]);
      }
    } finally {
      setIsSending(false);
      setStatusMessage(null);
    }
  }

  async function sendMessageFallback(message: string) {
    const response = await fetch(`${aiAssistantUrl.replace(/\/$/, "")}/v1/assistant/messages`, {
      method: "POST",
      headers: await assistantRequestHeaders(),
      body: assistantRequestBody(message)
    });
    const payload = (await response.json()) as AssistantResponse;
    if (!response.ok) throw new Error("Assistant request failed");
    appendAssistantResponse(payload);
  }

  async function sendMessageStream(message: string) {
    const response = await fetch(`${aiAssistantUrl.replace(/\/$/, "")}/v1/assistant/messages/stream`, {
      method: "POST",
      headers: await assistantRequestHeaders(),
      body: assistantRequestBody(message)
    });
    if (!response.ok || !response.body) throw new Error("Assistant stream unavailable");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let completed = false;

    while (!completed) {
      const { value, done } = await reader.read();
      completed = done;
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() || "";
      for (const chunk of chunks) {
        handleAssistantEvent(chunk);
      }
    }

    if (buffer.trim()) {
      handleAssistantEvent(buffer);
    }
  }

  function handleAssistantEvent(rawEvent: string) {
    const eventName = rawEvent
      .split("\n")
      .find((line) => line.startsWith("event:"))
      ?.replace("event:", "")
      .trim();
    const dataLine = rawEvent
      .split("\n")
      .find((line) => line.startsWith("data:"))
      ?.replace("data:", "")
      .trim();
    if (!eventName || !dataLine) return;
    let data: AssistantStreamData;
    try {
      data = JSON.parse(dataLine) as AssistantStreamData;
    } catch {
      setStatusMessage(null);
      setMessages((current) => [...current, { role: "assistant", content: copy.error }]);
      return;
    }

    if (eventName === "assistant.status" && "message" in data && data.message) {
      setStatusMessage(data.message || copy.busy);
    }
    if (eventName === "assistant.token" && !Array.isArray(data) && "text" in data && data.text) {
      setStatusMessage(null);
      upsertAssistantDraft({ content: data.text });
    }
    if (eventName === "assistant.products" && Array.isArray(data)) {
      setStatusMessage(copy.busy);
      upsertAssistantDraft({ products: data });
    }
    if (eventName === "assistant.cart_updated" && isAssistantCartSummary(data)) {
      setStatusMessage(locale === "es" ? "Carrito actualizado" : "Cart updated");
      upsertAssistantDraft({
        cart: data,
        action: {
          type: "OPEN_CART",
          status: "SUCCEEDED",
          entity_id: null,
          message: null
        }
      });
    }
    if (eventName === "assistant.clarification" && "message" in data && data.message) {
      setStatusMessage(null);
      upsertAssistantDraft({
        content: data.message,
        action: {
          type: "ASK_CLARIFICATION",
          status: "PENDING",
          entity_id: null,
          message: data.message
        }
      });
    }
    if (eventName === "assistant.completed" && !Array.isArray(data) && "thread_id" in data) {
      appendAssistantResponse(data);
    }
    if (eventName === "assistant.error") {
      setMessages((current) => [...current, { role: "assistant", content: "message" in data && data.message ? data.message : copy.error }]);
    }
  }

  function isAssistantCartSummary(data: AssistantStreamData): data is AssistantCartSummary {
    return (
      !Array.isArray(data) &&
      typeof data === "object" &&
      data !== null &&
      "item_count" in data &&
      typeof data.item_count === "number" &&
      "subtotal" in data &&
      typeof data.subtotal === "string" &&
      "currency" in data &&
      data.currency === "USD" &&
      "items" in data &&
      Array.isArray(data.items)
    );
  }

  function appendAssistantResponse(payload: AssistantResponse) {
    setThreadId(payload.thread_id);
    setMessages((current) => {
      const nextMessage: ChatMessage = {
        role: "assistant",
        content: payload.message,
        products: payload.products,
        cart: payload.cart,
        action: payload.action,
        suggestedReplies: payload.suggested_replies
      };
      if (current[current.length - 1]?.role === "assistant" && current[current.length - 1]?.streaming) {
        return [...current.slice(0, -1), nextMessage];
      }
      return [...current, nextMessage];
    });
  }

  function upsertAssistantDraft(partial: Partial<ChatMessage>) {
    setMessages((current) => {
      const existing =
        current[current.length - 1]?.role === "assistant" && current[current.length - 1]?.streaming
          ? current[current.length - 1]
          : undefined;
      const draft: ChatMessage = {
        role: "assistant",
        content: partial.content ?? existing?.content ?? statusMessage ?? copy.busy,
        streaming: true
      };
      const nextProducts = partial.products ?? existing?.products;
      const nextCart = partial.cart ?? existing?.cart;
      const nextAction = partial.action ?? existing?.action;
      const nextSuggestedReplies = partial.suggestedReplies ?? existing?.suggestedReplies;

      if (nextProducts) draft.products = nextProducts;
      if (nextCart) draft.cart = nextCart;
      if (nextAction) draft.action = nextAction;
      if (nextSuggestedReplies) draft.suggestedReplies = nextSuggestedReplies;

      if (current[current.length - 1]?.role === "assistant" && current[current.length - 1]?.streaming) {
        return [...current.slice(0, -1), draft];
      }
      return [...current, draft];
    });
  }

  function reset() {
    setThreadId(null);
    setMessages([]);
    setInput("");
    setCartFeedback(null);
  }

  function slugFromAssistantProduct(product: AssistantProduct) {
    try {
      const parsed = new URL(product.product_url, window.location.origin);
      const querySlug = parsed.searchParams.get("slug");
      if (querySlug) return querySlug;
      const segments = parsed.pathname.split("/").filter(Boolean);
      return segments[segments.length - 1] || product.product_id;
    } catch {
      return product.product_id;
    }
  }

  async function addAssistantProduct(product: AssistantProduct) {
    if (addingProductId) return;
    setAddingProductId(product.product_id);
    setCartFeedback(null);
    const slug = slugFromAssistantProduct(product);
    try {
      await addProductReferenceToCart({ slug, variantId: product.variant_id });
      setCartFeedback(copy.added);
    } catch {
      setCartFeedback(copy.addError);
    } finally {
      setAddingProductId(null);
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-0 sm:inset-auto sm:bottom-5 sm:left-5">
      {isOpen ? (
        <div
          ref={panelRef}
          className="flex h-[100dvh] w-full flex-col overflow-hidden border border-zinc-200 bg-white shadow-2xl sm:mb-3 sm:h-[min(640px,calc(100vh-6rem))] sm:w-[calc(100vw-2rem)] sm:max-w-md sm:rounded-lg"
          role="dialog"
          aria-label={copy.title}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsOpen(false);
            }
          }}
        >
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-950 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">{copy.title}</p>
              <p className="text-xs text-zinc-300">{copy.intro}</p>
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={reset} className="focus-ring grid h-9 w-9 place-items-center rounded-md hover:bg-white/10" aria-label={copy.reset}>
                <RotateCcw size={16} aria-hidden />
              </button>
              <button type="button" onClick={() => setIsOpen(false)} className="focus-ring grid h-9 w-9 place-items-center rounded-md hover:bg-white/10" aria-label="Close">
                <X size={18} aria-hidden />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-zinc-50 p-3">
            {cartFeedback ? (
              <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800" role="status" aria-live="polite">
                {cartFeedback}
              </div>
            ) : null}
            {messages.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-600">{copy.intro}</div>
            ) : null}
            {messages.map((message, index) => (
              <div key={index} className={message.role === "user" ? "ml-8 text-right" : "mr-8"}>
                <div className={`inline-block rounded-lg px-3 py-2 text-sm leading-6 ${message.role === "user" ? "bg-zinc-950 text-white" : "bg-white text-zinc-800 shadow-sm"}`}>
                  {message.content}
                </div>
                {message.products?.length ? (
                  <div className="mt-2 grid gap-2">
                    {message.products.map((product) => (
                      <div key={product.product_id} className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-2 text-left shadow-sm">
                        {product.image_url ? <img src={product.image_url} alt={product.name} className="h-16 w-16 rounded-md object-cover" /> : null}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-zinc-950">{product.name}</p>
                          <p className="text-sm font-semibold text-teal-700">{formatUsd(Math.round(Number(product.price) * 100), locale === "es" ? "es-CO" : "en-US")}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${product.available ? "bg-teal-50 text-teal-700" : "bg-rose-50 text-rose-700"}`}>
                              {product.available ? copy.inStock : copy.outOfStock}
                            </span>
                            {product.color || product.size ? (
                              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                                {copy.variant}: {[product.color, product.size].filter(Boolean).join(" / ")}
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-2 flex gap-2">
                            <a href={storefrontPath(product.product_url.replace(/^\/store/, ""))} className="focus-ring rounded-md border border-zinc-300 px-2 py-1 text-xs font-semibold text-zinc-700">
                              {copy.view}
                            </a>
                            <button
                              type="button"
                              onClick={() => void addAssistantProduct(product)}
                              disabled={!product.available || addingProductId === product.product_id}
                              className="focus-ring rounded-md bg-zinc-950 px-2 py-1 text-xs font-semibold text-white disabled:cursor-wait disabled:bg-zinc-400"
                            >
                              {addingProductId === product.product_id ? copy.adding : copy.add}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
                {message.cart ? (
                  <div className="mt-2 rounded-lg border border-teal-200 bg-white p-3 text-left shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{copy.cart}</p>
                        <p className="text-sm font-semibold text-zinc-950">
                          {message.cart.item_count} {copy.items}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-zinc-950">
                        {formatUsd(Math.round(Number(message.cart.subtotal) * 100), locale === "es" ? "es-CO" : "en-US")}
                      </p>
                    </div>
                    {message.action?.type === "OPEN_CART" || message.action?.type?.startsWith("CART_") ? (
                      <a href={storefrontPath("/cart")} className="focus-ring mt-3 inline-flex rounded-md bg-teal-700 px-3 py-2 text-xs font-semibold text-white">
                        {copy.openCart}
                      </a>
                    ) : null}
                  </div>
                ) : null}
                {message.suggestedReplies?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.suggestedReplies.slice(0, 3).map((reply) => (
                      <button
                        key={reply}
                        type="button"
                        onClick={() => void sendMessage(reply)}
                        className="focus-ring rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 hover:border-teal-400 hover:text-teal-700"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {isSending ? (
              <div className="mr-8 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-zinc-600 shadow-sm">
                <Loader2 size={15} className="animate-spin" aria-hidden />
                {statusMessage || copy.busy}
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <form
            className="flex gap-2 border-t border-zinc-200 bg-white p-3"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="focus-ring min-h-11 min-w-0 flex-1 rounded-md border border-zinc-300 px-3 text-sm text-zinc-950"
              placeholder={copy.placeholder}
            />
            <button type="submit" disabled={isSending || !input.trim()} className="focus-ring grid h-11 w-11 place-items-center rounded-md bg-zinc-950 text-white disabled:bg-zinc-400" aria-label={copy.send}>
              <Send size={17} aria-hidden />
            </button>
          </form>
        </div>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="focus-ring mb-5 ml-5 flex min-h-14 items-center gap-3 rounded-full bg-teal-700 px-4 text-white shadow-2xl transition hover:-translate-y-0.5 hover:bg-teal-800 sm:mb-0 sm:ml-0"
        aria-expanded={isOpen}
        aria-label={copy.title}
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-teal-800">
          <Bot size={19} aria-hidden />
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-xs text-teal-100">Aether</span>
          <span className="block text-sm font-semibold">{copy.title}</span>
        </span>
        <ShoppingBag size={17} aria-hidden className="sm:hidden" />
      </button>
    </div>
  );
}
