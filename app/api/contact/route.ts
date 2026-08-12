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
  privacyVersion?: unknown;
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
  const privacyVersion = sanitizeText(payload.privacyVersion, 20);

  if (
    name.length < 2 ||
    !isValidEmail(email) ||
    !projectType ||
    message.length < 20 ||
    !consent ||
    privacyVersion !== "2026-08-12"
  ) {
    return NextResponse.json({ ok: false, code: "validation_error" }, { status: 422 });
  }

  const normalizedLocale: "es" | "en" = locale === "es" ? "es" : "en";

  const contactRequest = {
    name,
    company,
    email,
    subject: `Portfolio: ${projectType}`.slice(0, 160),
    message: [
      `Project type: ${projectType}`,
      company ? `Company: ${company}` : "Company: Not provided",
      `Preferred language: ${preferredLanguage || locale || "Not provided"}`,
      "",
      message,
    ].join("\n"),
    preferredLanguage,
    locale: normalizedLocale,
    receivedAt: new Date().toISOString(),
    consent,
    privacyVersion,
  };

  try {
    await saveContactRequest(contactRequest);
  } catch {
    return NextResponse.json({ ok: false, code: "delivery_error" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

async function saveContactRequest(contactRequest: {
  name: string;
  company: string;
  email: string;
  subject: string;
  message: string;
  preferredLanguage: string;
  locale: "en" | "es";
  receivedAt: string;
  consent: boolean;
  privacyVersion: string;
}) {
  const apiOrigin = (
    process.env.AETHER_API_ORIGIN ||
    process.env.NEXT_PUBLIC_AETHER_API_URL ||
    "http://localhost:8787"
  ).replace(/\/$/, "");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(`${apiOrigin}/api/v1/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        name: contactRequest.name,
        email: contactRequest.email,
        company: contactRequest.company || undefined,
        subject: contactRequest.subject,
        message: contactRequest.message,
        consent: contactRequest.consent,
        privacyVersion: contactRequest.privacyVersion,
        locale: contactRequest.locale,
        website: "",
      }),
    });

    if (!response.ok) {
      throw new Error("D1 contact storage failed.");
    }
  } finally {
    clearTimeout(timeout);
  }
}
