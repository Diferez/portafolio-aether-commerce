"use client";

import { Send } from "lucide-react";
import { useId, useState } from "react";
import type { FormEvent } from "react";
import type { ContactContent } from "@/types/content";
import type { Locale } from "@/i18n/config";

type ContactFormProps = {
  content: ContactContent;
  locale: Locale;
};

type FormState = "idle" | "sending" | "success" | "error";
type FieldErrors = Partial<Record<string, string>>;

export function ContactForm({ content, locale }: ContactFormProps) {
  const formId = useId();
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(formData: FormData) {
    const nextErrors: FieldErrors = {};
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const projectType = String(formData.get("projectType") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const consent = formData.get("consent") === "on";

    if (name.length < 2) nextErrors.name = content.validation.required;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = content.validation.email;
    }
    if (!projectType) nextErrors.projectType = content.validation.required;
    if (message.length < 20) nextErrors.message = content.validation.message;
    if (!consent) nextErrors.consent = content.validation.consent;

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const validationErrors = validate(formData);

    setErrors(validationErrors);
    setState("idle");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setState("sending");

    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, locale }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      event.currentTarget.reset();
      setState("success");
    } catch {
      setState("error");
    }
  }

  const statusMessage =
    state === "success" ? content.success : state === "error" ? content.error : "";

  return (
    <form className="contact-form" noValidate onSubmit={handleSubmit}>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>{content.fields.website}</label>
        <input
          id={`${formId}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Field
        id={`${formId}-name`}
        name="name"
        label={content.fields.name}
        placeholder={content.placeholders.name}
        error={errors.name}
        required
      />

      <Field
        id={`${formId}-company`}
        name="company"
        label={content.fields.company}
        placeholder={content.placeholders.company}
      />

      <Field
        id={`${formId}-email`}
        name="email"
        type="email"
        label={content.fields.email}
        placeholder={content.placeholders.email}
        error={errors.email}
        required
      />

      <label className="field">
        <span>{content.fields.projectType}</span>
        <select
          name="projectType"
          aria-invalid={Boolean(errors.projectType)}
          aria-describedby={errors.projectType ? `${formId}-project-error` : undefined}
          required
        >
          <option value=""></option>
          {content.projectTypes.map((projectType) => (
            <option key={projectType} value={projectType}>
              {projectType}
            </option>
          ))}
        </select>
        {errors.projectType ? (
          <span className="field-error" id={`${formId}-project-error`}>
            {errors.projectType}
          </span>
        ) : null}
      </label>

      <label className="field field-full">
        <span>{content.fields.message}</span>
        <textarea
          name="message"
          rows={6}
          placeholder={content.placeholders.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          required
        />
        {errors.message ? (
          <span className="field-error" id={`${formId}-message-error`}>
            {errors.message}
          </span>
        ) : null}
      </label>

      <label className="field">
        <span>{content.fields.preferredLanguage}</span>
        <select name="preferredLanguage" defaultValue={locale}>
          <option value="es">{content.languageOptions.es}</option>
          <option value="en">{content.languageOptions.en}</option>
        </select>
      </label>

      <label className="consent field-full">
        <input
          name="consent"
          type="checkbox"
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
        />
        <span>{content.fields.consent}</span>
      </label>

      {errors.consent ? (
        <span className="field-error field-full" id={`${formId}-consent-error`}>
          {errors.consent}
        </span>
      ) : null}

      <p className="privacy-note field-full" id="privacidad">
        {content.privacy}
      </p>

      <button className="primary-button field-full" type="submit" disabled={state === "sending"}>
        <Send aria-hidden="true" size={18} />
        {state === "sending" ? content.sending : content.submit}
      </button>

      <p className="form-status field-full" role="status" aria-live="polite">
        {statusMessage}
      </p>
    </form>
  );
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  error?: string;
  required?: boolean;
};

function Field({
  id,
  name,
  label,
  placeholder,
  type = "text",
  error,
  required,
}: FieldProps) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <span className="field-error" id={`${id}-error`}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
