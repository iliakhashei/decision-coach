"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getUserId } from "@/lib/auth";
import { Decision } from "@/lib/types";

export default function DecisionsPage() {
  const router = useRouter();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      router.push("/login");
      return;
    }

    async function loadDecisions() {
      try {
        const data = await apiFetch<Decision[]>("/decisions");
        setDecisions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load decisions");
      } finally {
        setLoading(false);
      }
    }

    loadDecisions();
  }, [router]);

  if (loading) {
    return <main style={{ padding: 24 }}>Loading decisions...</main>;
  }

  if (error) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Decision History</h1>
        <p style={{ color: "red" }}>{error}</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1000, margin: "40px auto", padding: 24 }}>
      <h1>Decision History</h1>

      {decisions.length === 0 ? (
        <p>No decisions found.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {decisions.map((decision) => (
            <div
              key={decision.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 20,
                background: "#fff",
              }}
            >
              <h3 style={{ marginTop: 0 }}>{decision.title}</h3>
              <p><strong>Category:</strong> {decision.category || "N/A"}</p>
              <p><strong>Status:</strong> {decision.status}</p>
              <p><strong>Created:</strong> {new Date(decision.created_at).toLocaleString()}</p>
              <p>{decision.raw_input_text}</p>

              <div style={{ marginTop: 12 }}>
                <Link href={`/decisions/${decision.id}`}>View details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}