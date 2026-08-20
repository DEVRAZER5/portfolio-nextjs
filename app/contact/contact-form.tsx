"use client";

import { useState } from "react";

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate() {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Please enter your name.";
    if (!email.trim()) {
      errors.email = "Please enter your email.";
    } else if (!EMAIL_RE.test(email.trim())) {
      errors.email = "That doesn't look like a valid email.";
    }
    if (!message.trim()) errors.message = "Please write a short message.";
    else if (message.trim().length < 10) {
      errors.message = "A little more detail helps, at least 10 characters.";
    }
    return errors;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setFieldErrors({});
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center"
      >
        <p className="font-medium text-green-800 mb-1">Message sent!</p>
        <p className="text-sm text-green-700 mb-4">
          Thanks for reaching out, I'll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-sm text-green-700 underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
        />
        {fieldErrors.name && (
          <p id="name-error" className="mt-1 text-xs text-red-600">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
          Email
        </label>
        <input
          id="email"
          type="text"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
        />
        {fieldErrors.email && (
          <p id="email-error" className="mt-1 text-xs text-red-600">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink mb-1">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
        />
        {fieldErrors.message && (
          <p id="message-error" className="mt-1 text-xs text-red-600">
            {fieldErrors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          Something went wrong sending that. Please try again, or email me
          directly below.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
