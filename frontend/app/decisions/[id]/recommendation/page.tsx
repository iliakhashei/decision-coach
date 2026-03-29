"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { RecommendationResponse } from "@/lib/types";

export default function RecommendationPage() {
  const params = useParams();
  const router = useRouter();
  const decisionId = params.id as string;

  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecommendation() {
      try {
        const raw = sessionStorage.getItem(`answers-${decisionId}`);
        const answers: string[] = raw ? JSON.parse(raw) : [];

        const response = await apiFetch<RecommendationResponse>(
          `/decisions/${decisionId}/recommendation`,
          {
            method: "POST",
            body: JSON.stringify({ answers }),
          }
        );

        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load recommendation");
      } finally {
        setLoading(false);
      }
    }

    loadRecommendation();
  }, [decisionId]);

  if (loading) return <main style={{ padding: 24 }}>Generating recommendation...</main>;
  if (error) return <main style={{ padding: 24, color: "red" }}>{error}</main>;
  if (!data) return null;

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 24,
          background: "#fff",
          display: "grid",
          gap: 20,
        }}
      >
        <h1 style={{ marginTop: 0 }}>Recommendation</h1>

        <div>
          <h3>Summary</h3>
          <p>{data.summary}</p>
        </div>

        <div>
          <h3>Recommendation</h3>
          <p>{data.recommendation}</p>
        </div>

        <div>
          <h3>Confidence</h3>
          <p>{data.confidence}</p>
        </div>

        <div>
          <h3>Key Risks</h3>
          <ul>
            {data.key_risks.map((risk, index) => (
              <li key={index}>{risk}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Reasoning</h3>
          <ul>
            {data.reasoning.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => router.push(`/decisions/${decisionId}/outcome`)}
          style={{
            padding: 14,
            borderRadius: 8,
            border: "1px solid #222",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            width: "fit-content",
          }}
        >
          Log outcome
        </button>
      </div>
    </main>
  );
}