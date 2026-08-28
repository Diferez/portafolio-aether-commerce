"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Locale } from "@/i18n/config";
import { legalHref, legalUi } from "@/content/legal-content";

const STORAGE_KEY = "portfolio_cookie_notice_v1";
const NOTICE_EVENT = "portfolio-cookie-notice-change";
let dismissedInMemory = false;

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(NOTICE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(NOTICE_EVENT, callback);
  };
}

function getDismissedSnapshot() {
  if (dismissedInMemory) return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "dismissed";
  } catch {
    return false;
  }
}

function getServerSnapshot() {
  return true;
}

export function CookieNotice({ locale }: { locale: Locale }) {
  const dismissed = useSyncExternalStore(subscribe, getDismissedSnapshot, getServerSnapshot);
  const ui = legalUi[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function dismiss() {
    dismissedInMemory = true;
    try {
      window.localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch {
      // The notice can still be dismissed for the current page.
    }
    window.dispatchEvent(new Event(NOTICE_EVENT));
  }

  if (dismissed) return null;

  return (
    <aside className="cookie-notice" aria-labelledby="cookie-notice-title">
      <div>
        <strong id="cookie-notice-title">{ui.noticeTitle}</strong>
        <p>{ui.noticeBody}</p>
        <a href={legalHref(locale, "cookies")}>{ui.noticeLink}</a>
      </div>
      <button type="button" onClick={dismiss}>
        {ui.noticeAction}
      </button>
    </aside>
  );
}
