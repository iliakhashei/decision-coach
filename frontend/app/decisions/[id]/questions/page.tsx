"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { QuestionsResponse } from "@/lib/types";

export default function QuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const decisionId = params.id as string;

  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuestions() {
      try {
        const data = await apiFetch<QuestionsResponse>(`/decisions/${decisionId}/questions`, {
          method: "POST",
        });

        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(""));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load questions");
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [decisionId]);

  function updateAnswer(index: number, value: string) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      sessionStorage.setItem(`answers-${decisionId}`, JSON.stringify(answers));
      router.push(`/decisions/${decisionId}/recommendation`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to continue");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <main style={{ padding: 24 }}>Generating clarifying questions...</main>;
  }

  if (error) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Clarifying Questions</h1>
        <p style={{ color: "red" }}>{error}</p>
      </main>
    );
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
        <h1 style={{ marginTop: 0 }}>Clarifying Questions</h1>
        <p style={{ color: "#555", marginBottom: 24 }}>
          Answer these questions so the recommendation can be more specific.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
          {questions.map((question, index) => (
            <div key={index} style={{ display: "grid", gap: 8 }}>
              <label htmlFor={`question-${index}`}>{question}</label>
              <textarea
                id={`question-${index}`}
                rows={3}
                value={answers[index] || ""}
                onChange={(e) => updateAnswer(index, e.target.value)}
                style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: 14,
              borderRadius: 8,
              border: "1px solid #222",
              background: "#111",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {submitting ? "Thinking..." : "Get recommendation"}
          </button>
        </form>
      </div>
    </main>
  );
}