"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

interface ContactFormProps {
  interests: string[];
  email: string;
}

type Status = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-momentum-orange focus:ring-2 focus:ring-momentum-orange/20 outline-none transition-all";

export default function ContactForm({ interests, email }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "We could not send your message");
      }
      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600 mb-6">
              Register your interest, ask about a league, or tell us what you need. We reply to
              every message.
            </p>
            <p className="text-gray-700">
              Prefer email?{" "}
              <a href={`mailto:${email}`} className="text-momentum-orange font-semibold">
                {email}
              </a>
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-gray-50 rounded-3xl p-8 border border-gray-200 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-semibold mb-2">Name *</span>
                <input name="name" required maxLength={120} className={inputClass} />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold mb-2">Email *</span>
                <input name="email" type="email" required maxLength={200} className={inputClass} />
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-semibold mb-2">Phone</span>
                <input name="phone" type="tel" maxLength={40} className={inputClass} />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold mb-2">I'm interested in</span>
                <select name="interest" className={inputClass} defaultValue={interests[0]}>
                  {interests.map((interest) => (
                    <option key={interest} value={interest}>
                      {interest}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="block text-sm font-semibold mb-2">Message *</span>
              <textarea name="message" required rows={4} maxLength={4000} className={inputClass} />
            </label>
            {/* Honeypot: hidden from people, filled by bots. */}
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
              className="w-full inline-flex items-center justify-center bg-momentum-orange text-white px-8 py-4 rounded-lg hover:bg-momentum-orange/90 hover:shadow-lg transition-all font-semibold text-lg disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send message"}
              <Send className="ml-2" size={20} />
            </button>

            {status === "success" && (
              <p className="flex items-center text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">
                <CheckCircle className="mr-2 flex-shrink-0" size={20} />
                Thanks, we have your message and will be in touch.
              </p>
            )}
            {status === "error" && (
              <p className="flex items-center text-red-700 bg-red-50 border border-red-200 rounded-lg p-4">
                <AlertCircle className="mr-2 flex-shrink-0" size={20} />
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
