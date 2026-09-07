"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterSignup() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Something went wrong");
      form.reset();
      setStatus("success");
      setMessage("You're on the list. We'll email you about news and events.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <section className="py-20 bg-momentum-orange text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <Mail className="mx-auto mb-4" size={36} />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Stay in the loop</h2>
          <p className="text-lg text-white/90 mb-8">
            Enter your email to receive information about our latest news and events.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              aria-label="Email address"
              className="flex-1 px-5 py-4 rounded-lg text-gray-900 outline-none focus:ring-4 focus:ring-white/40"
            />
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-momentum-dark text-white px-8 py-4 rounded-lg font-semibold hover:bg-black transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Signing up..." : "Sign up"}
            </button>
          </form>
          {status !== "idle" && status !== "loading" && (
            <p className={`mt-4 ${status === "success" ? "text-white" : "text-yellow-100"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
