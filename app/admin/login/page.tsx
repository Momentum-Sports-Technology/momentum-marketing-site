"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { signIn } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn(password);

      if (result.success) {
        router.push("/admin");
      } else {
        setError(result.error || "Invalid password");
      }
    } catch (error) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-momentum-dark via-momentum-purple to-momentum-pink flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-momentum rounded-2xl mb-4">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-gray-600">Enter your password to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-900">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-momentum-purple focus:ring-2 focus:ring-momentum-purple/20 outline-none transition-all"
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-momentum text-white px-6 py-4 rounded-lg hover:shadow-xl transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

