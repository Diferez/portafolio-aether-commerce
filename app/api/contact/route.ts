import { NextResponse, type NextRequest } from "next/server";
import { isValidEmail, sanitizeText } from "@/lib/sanitize";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

type ContactPayload = {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  projectType?: unknown;
  message?: unknown;
  preferredLanguage?: unknown;
  locale?: unknown;
  website?: unknown;
  consent?: unknown;
};

function clientKey(request: NextRequest) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "anonymous"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const bucket = requestBuckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    requestBuckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > MAX_REQUESTS;
}

export async function POST(request: NextRequest) {
  if (isRateLimited(clientKey(request))) {
    return NextResponse.json({ ok: false, code: "rate_limited" }, { status: 429 });
  }

  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, code: "invalid_json" }, { status: 400 });
  }

  if (sanitizeText(payload.website, 300)) {
    return NextResponse.json({ ok: true });
  }

  const name = sanitizeText(payload.name, 120);
  const company = sanitizeText(payload.company, 120);
  const email = sanitizeText(payload.email, 180).toLowerCase();
  const projectType = sanitizeText(payload.projectType, 120);
  const message = sanitizeText(payload.message, 2500);
  const preferredLanguage = sanitizeText(payload.preferredLanguage, 30);
  const locale = sanitizeText(payload.locale, 10);
  const consent = payload.consent === "on" || payload.consent === true;

  if (
    name.length < 2 ||
    !isValidEmail(email) ||
    !projectType ||
    message.length < 20 ||
    !consent
  ) {
    return NextResponse.json({ ok: false, code: "validation_error" }, { status: 422 });
  }

  const contactRequest = {
    name,
    company,
    email,
    projectType,
    message,
    preferredLanguage,
    locale,
    receivedAt: new Date().toISOString(),
  };

  try {
    await queueContactRequest(contactRequest);
  } catch {
    return NextResponse.json({ ok: false, code: "delivery_error" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

async function queueContactRequest(contactRequest: Record<string, string>) {
  const deliveryProvider = process.env.CONTACT_DELIVERY_PROVIDER?.trim();
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL?.trim();

  if (!deliveryProvider || !recipient) {
    throw new Error("Contact delivery is not configured.");
  }

  if (deliveryProvider === "formsubmit") {
    const response = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `Portfolio contact: ${contactRequest.projectType}`,
          _template: "table",
          _captcha: "false",
          Name: contactRequest.name,
          Company: contactRequest.company || "Not provided",
          Email: contactRequest.email,
          "Project type": contactRequest.projectType,
          Message: contactRequest.message,
          "Preferred language": contactRequest.preferredLanguage,
          Locale: contactRequest.locale,
          "Received at": contactRequest.receivedAt,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Contact delivery failed.");
    }

    return;
  }

  throw new Error("Unsupported contact delivery provider.");
}
