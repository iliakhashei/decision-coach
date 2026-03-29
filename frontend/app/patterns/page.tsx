"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getUserId } from "@/lib/auth";
import { PatternsResponse } from "@/lib/types";

export default function PatternsPage() {
  const router = useRouter();
  const [data, setData] = useState<PatternsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      router.push("/login");
      return;
    }

    async function loadPatterns() {
      try {
        const response = await apiFetch<PatternsResponse>("/patterns");
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load patterns");
      } finally {
        setLoading(false);
      }
    }

    loadPatterns();
  }, [router]);

  if (loading) return <main style={{ padding: 24 }}>Analyzing patterns...</main>;
  if (error) return <main style={{ padding: 24, color: "red" }}>{error}</main>;

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <h1>Your Patterns</h1>

      {!data?.patterns.length ? (
        <p>No patterns found yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {data.patterns.map((pattern, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 20,
                background: "#fff",
              }}
            >
              <h3 style={{ marginTop: 0 }}>{pattern.pattern_type}</h3>
              <p><strong>Confidence:</strong> {pattern.confidence}</p>
              <p>{pattern.description}</p>

              <div>
                <strong>Evidence</strong>
                <ul>
                  {pattern.evidence.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
} 