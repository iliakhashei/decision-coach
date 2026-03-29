"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";

export default function HomePage() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const user = getUser();
    setUserName(user?.name || null);
  }, []);

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "60px auto",
        padding: 24,
        display: "grid",
        gap: 24,
      }}
    >
      <div>
        <h1 style={{ marginBottom: 12 }}>Decision Coach</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "#444" }}>
          AI-powered decision support with outcome tracking and pattern learning.
        </p>
        {userName && <p>Welcome back, {userName}.</p>}
      </div>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        <Link
          href="/decisions/new"
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 20,
            textDecoration: "none",
            color: "inherit",
            background: "#fff",
          }}
        >
          <h3 style={{ marginTop: 0 }}>New Decision</h3>
          <p style={{ marginBottom: 0 }}>
            Describe a decision you are facing and start the guided flow.
          </p>
        </Link>

        <Link
          href="/decisions"
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 20,
            textDecoration: "none",
            color: "inherit",
            background: "#fff",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Decision History</h3>
          <p style={{ marginBottom: 0 }}>
            Review previous decisions, answers, and recommendations.
          </p>
        </Link>

        <Link
          href="/patterns"
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 20,
            textDecoration: "none",
            color: "inherit",
            background: "#fff",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Patterns</h3>
          <p style={{ marginBottom: 0 }}>
            See recurring behavioral patterns inferred from your outcomes.
          </p>
        </Link>
      </div>
    </main>
  );
}