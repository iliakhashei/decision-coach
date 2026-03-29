"use client";

import { useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function OutcomePage() {
  const params = useParams();
  const router = useRouter();
  const decisionId = params.id as string;

  const [actionTaken, setActionTaken] = useState("");
  const [resultRating, setResultRating] = useState(7);
  const [outcomeText, setOutcomeText] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [wouldRepeat, setWouldRepeat] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiFetch(`/decisions/${decisionId}/outcome`, {
        method: "POST",
        body: JSON.stringify({
          action_taken: actionTaken,
          result_rating: resultRating,
          outcome_text: outcomeText,
          lessons_learned: lessonsLearned,
          would_repeat: wouldRepeat,
        }),
      });

      router.push("/patterns");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save outcome");
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
        <h1 style={{ marginTop: 0 }}>Log Outcome</h1>
        <p style={{ color: "#555", marginBottom: 24 }}>
          Record what happened after the decision so the system can learn over time.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label>What action did you take?</label>
            <textarea
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              rows={3}
              required
              style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label>Result rating (1–10)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={resultRating}
              onChange={(e) => setResultRating(Number(e.target.value))}
              style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label>How did it go?</label>
            <textarea
              value={outcomeText}
              onChange={(e) => setOutcomeText(e.target.value)}
              rows={4}
              required
              style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label>What did you learn?</label>
            <textarea
              value={lessonsLearned}
              onChange={(e) => setLessonsLearned(e.target.value)}
              rows={4}
              required
              style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
            />
          </div>

          <label>
            <input
              type="checkbox"
              checked={wouldRepeat}
              onChange={(e) => setWouldRepeat(e.target.checked)}
            />{" "}
            I would repeat this decision
          </label>

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
            {loading ? "Saving..." : "Save outcome"}
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: 16 }}>{error}</p>}
      </div>
    </main>
  );
}