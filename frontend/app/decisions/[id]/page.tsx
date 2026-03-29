"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Decision } from "@/lib/types";

type ParsedRecommendation = {
  summary?: string;
  recommendation?: string;
  key_risks?: string[];
  confidence?: string;
  reasoning?: string[];
};

export default function DecisionDetailPage() {
  const params = useParams();
  const decisionId = params.id as string;

  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDecision() {
      try {
        const data = await apiFetch<Decision>(`/decisions/${decisionId}`);
        setDecision(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load decision");
      } finally {
        setLoading(false);
      }
    }

    loadDecision();
  }, [decisionId]);

  const parsedAnswers = useMemo(() => {
    if (!decision?.answers_json) return [];
    try {
      return JSON.parse(decision.answers_json) as string[];
    } catch {
      return [];
    }
  }, [decision?.answers_json]);

  const parsedRecommendation = useMemo(() => {
    if (!decision?.recommendation_json) return null;
    try {
      return JSON.parse(decision.recommendation_json) as ParsedRecommendation;
    } catch {
      return null;
    }
  }, [decision?.recommendation_json]);

  if (loading) {
    return <main style={{ padding: 20 }}>Loading decision...</main>;
  }

  if (error) {
    return (
      <main style={{ padding: 20 }}>
        <h1>Decision Details</h1>
        <p style={{ color: "red" }}>{error}</p>
      </main>
    );
  }

  if (!decision) {
    return (
      <main style={{ padding: 20 }}>
        <h1>Decision Details</h1>
        <p>Decision not found.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1>{decision.title}</h1>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 20,
          display: "grid",
          gap: 16,
        }}
      >
        <p><strong>Category:</strong> {decision.category || "N/A"}</p>
        <p><strong>Status:</strong> {decision.status}</p>
        <p><strong>Created:</strong> {new Date(decision.created_at).toLocaleString()}</p>

        <div>
          <h3>Original Decision</h3>
          <p>{decision.raw_input_text}</p>
        </div>

        <div>
          <h3>Answers</h3>
          {parsedAnswers.length === 0 ? (
            <p>No saved answers.</p>
          ) : (
            <ul>
              {parsedAnswers.map((answer, index) => (
                <li key={index}>{answer}</li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3>Recommendation</h3>
          {!parsedRecommendation ? (
            <p>No saved recommendation.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <strong>Summary:</strong>
                <p>{parsedRecommendation.summary || "N/A"}</p>
              </div>

              <div>
                <strong>Recommendation:</strong>
                <p>{parsedRecommendation.recommendation || "N/A"}</p>
              </div>

              <div>
                <strong>Confidence:</strong>
                <p>{parsedRecommendation.confidence || "N/A"}</p>
              </div>

              <div>
                <strong>Key Risks:</strong>
                {parsedRecommendation.key_risks?.length ? (
                  <ul>
                    {parsedRecommendation.key_risks.map((risk, index) => (
                      <li key={index}>{risk}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No risks saved.</p>
                )}
              </div>

              <div>
                <strong>Reasoning:</strong>
                {parsedRecommendation.reasoning?.length ? (
                  <ul>
                    {parsedRecommendation.reasoning.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No reasoning saved.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          <Link href="/decisions">Back to history</Link>
          <Link href={`/decisions/${decision.id}/questions`}>Open flow again</Link>
          <Link href={`/decisions/${decision.id}/outcome`}>Log outcome</Link>
        </div>
      </div>
    </main>
  );
}