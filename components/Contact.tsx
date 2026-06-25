"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Select } from "@/components/ui/Select";
import { business, services } from "@/lib/content";

type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setErrorMsg(payload?.error ?? "");
        throw new Error("Request failed");
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section id="contact">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left: pitch + contact details */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
            Free Quote
          </span>
          <h2 className="font-display mt-3 text-4xl sm:text-5xl text-white">
            Request a free,
            <br />
            no-pressure quote.
          </h2>
          <p className="mt-6 max-w-md text-white/70 leading-relaxed">
            Tell us about your concrete and we&apos;ll get back to you fast with a clear quote.
            Serving {business.areaSummary}.
          </p>

          <dl className="mt-8 space-y-4 text-white/80">
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/50">Call</dt>
              <dd>
                <a href={business.phoneHref} className="text-lg font-semibold hover:text-brand">
                  {business.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/50">Email</dt>
              <dd>
                <a href={business.emailHref} className="hover:text-brand">
                  {business.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/50">Area</dt>
              <dd>
                {business.city}, {business.provinceAbbr} · {business.areaSummary}
              </dd>
            </div>
          </dl>
        </div>

        {/* Right: form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-line bg-surface p-6 sm:p-8"
        >
          <div className="grid gap-5">
            {/* Honeypot — hidden checkbox; real users can't see or tick it,
                bots auto-tick it and get dropped server-side. A text field was
                tried but browser autofill filled it, dropping real leads. */}
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />
            <Field label="Name" name="name" required />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Phone" name="phone" type="tel" required />
              <Field label="Email" name="email" type="email" required />
            </div>

            <Select
              label="Service"
              name="service"
              placeholder="Select a service…"
              options={[...services.map((s) => s.name), "Other / Not sure"]}
            />

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-white/80">
                Project details
              </span>
              <textarea
                name="message"
                rows={4}
                className="w-full rounded-lg border border-line bg-surface-2 px-4 py-3 text-white placeholder-white/30 focus:border-brand"
                placeholder="Driveway size, current condition, what you're after…"
              />
            </label>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="h-12 rounded-full bg-brand font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-brand-strong disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Get My Free Quote"}
            </button>

            <div aria-live="polite" role="status">
              {status === "success" && (
                <p className="text-sm text-green-400">
                  Thanks — we got your request and will be in touch shortly.
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-400">
                  {errorMsg ||
                    `Something went wrong. Please call ${business.phoneDisplay} instead.`}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </Section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-white/80">
        {label}
        {required && <span className="text-brand"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-lg border border-line bg-surface-2 px-4 py-3 text-white placeholder-white/30 focus:border-brand"
      />
    </label>
  );
}
