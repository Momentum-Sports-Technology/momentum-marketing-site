"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  message: string;
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    experience: "beginner",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit registration");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", experience: "beginner", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <section id="register" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Join?</h2>
            <p className="text-xl text-gray-600">
              Sign up today and we'll get back to you with next steps
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-gray-50 to-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-200"
          >
            {status === "success" ? (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
                <h3 className="text-2xl font-bold mb-2">Thanks for registering!</h3>
                <p className="text-gray-600">
                  We'll be in touch soon with more information about joining the league.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-900">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-momentum-orange focus:ring-2 focus:ring-momentum-orange/20 outline-none transition-all"
                    placeholder="John Smith"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold mb-2 text-gray-900"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-momentum-orange focus:ring-2 focus:ring-momentum-orange/20 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold mb-2 text-gray-900"
                    >
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-momentum-orange focus:ring-2 focus:ring-momentum-orange/20 outline-none transition-all"
                      placeholder="07XXX XXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-semibold mb-2 text-gray-900"
                  >
                    Experience Level *
                  </label>
                  <select
                    id="experience"
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-momentum-orange focus:ring-2 focus:ring-momentum-orange/20 outline-none transition-all"
                  >
                    <option value="beginner">Beginner - New to netball</option>
                    <option value="intermediate">Intermediate - Played before</option>
                    <option value="advanced">Advanced - Regular player</option>
                    <option value="competitive">Competitive - League experience</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold mb-2 text-gray-900"
                  >
                    Additional Information
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-momentum-orange focus:ring-2 focus:ring-momentum-orange/20 outline-none transition-all resize-none"
                    placeholder="Tell us about yourself, preferred playing times, or any questions..."
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
                    <AlertCircle size={20} />
                    <span className="text-sm">{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-momentum-orange text-white px-8 py-4 rounded-lg hover:shadow-xl hover:bg-momentum-orange/90 transition-all font-semibold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Register Your Interest</span>
                      <Send size={20} />
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  By submitting, you agree to our Terms & Conditions and Privacy Policy
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

