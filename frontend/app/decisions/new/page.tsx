"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getUserId } from "@/lib/auth";
import { Decision } from "@/lib/types";

export default function NewDecisionPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [rawInputText, setRawInputText] = useState("");
  const [category, setCategory] = useState("career");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      router.push("/login");
    }
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const decision = await apiFetch<Decision>("/decisions", {
        method: "POST",
        body: JSON.stringify({
          title,
          raw_input_text: rawInputText,
          category,
        }),
      });

      router.push(`/decisions/${decision.id}/questions`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 24,
          background: "#fff",
        }}
      >
        <h1 style={{ marginTop: 0 }}>New Decision</h1>
        <p style={{ color: "#555", marginBottom: 24 }}>
          Describe a real decision you are facing. The system will ask follow-up
          questions and generate a recommendation.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label>Decision title</label>
            <input
              placeholder="Should I accept the startup offer?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label>Category</label>
            <input
              placeholder="career"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label>Describe the decision</label>
            <textarea
              placeholder="I currently have a stable job, but I received an offer from a startup..."
              value={rawInputText}
              onChange={(e) => setRawInputText(e.target.value)}
              required
              rows={8}
              style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 14,
              borderRadius: 8,
              border: "1px solid #222",
              background: "#111",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {loading ? "Creating..." : "Start analysis"}
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: 16 }}>{error}</p>}
      </div>
    </main>
  );
}