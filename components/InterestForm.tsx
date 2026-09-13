"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

interface InterestFormProps {
  /** Recorded against each sign-up so leads can be told apart, e.g. "basingstoke". */
  source: string;
  successMessage: string;
  smallprint?: string;
}

type Status = "idle" | "loading" | "success" | "error";

const fieldClass =
  "w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-momentum-orange focus:ring-2 focus:ring-momentum-orange/20 outline-none transition-all";

/** Email, name and mobile capture for a launch page. Posts to the sign-up endpoint. */
export default function InterestForm({ source, successMessage, smallprint }: InterestFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = { ...Object.fromEntries(new FormData(form).entries()), source };
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
      setMessage(successMessage);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  if (status === "success") {
    return (
      <p className="flex items-center justify-center gap-2 text-green-800 bg-green-50 border border-green-200 rounded-xl p-4">
        <CheckCircle size={20} />
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <label className="block">
        <span className="block text-sm font-semibold mb-2">Email *</span>
        <input name="email" type="email" required maxLength={200} className={fieldClass} />
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-sm font-semibold mb-2">Name</span>
          <input name="name" maxLength={120} className={fieldClass} />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-2">Mobile</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            placeholder="07XXX XXXXXX"
            className={fieldClass}
          />
        </label>
      </div>
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
        className="w-full bg-momentum-orange text-white px-8 py-4 rounded-lg hover:bg-momentum-orange/90 hover:shadow-lg transition-all font-semibold text-lg disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Keep me updated"}
      </button>

      {smallprint && <p className="text-sm text-gray-500 text-center">{smallprint}</p>}

      {status === "error" && (
        <p className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle size={20} />
          {message}
        </p>
      )}
    </form>
  );
}
