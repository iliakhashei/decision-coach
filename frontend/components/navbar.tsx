"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, logout } from "../lib/auth";

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const user = getUser();
    setUserName(user?.name || null);
  }, []);

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  return (
    <nav
      style={{
        boxSizing: "border-box",
        width: "100%",
        padding: "14px 24px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: 18 }}>
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          Decision Coach
        </Link>
      </div>

      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          Home
        </Link>

        {userName ? (
          <>
            <span>Hello, {userName}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #222",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ textDecoration: "none", color: "inherit" }}>
              Login
            </Link>
            <Link href="/register" style={{ textDecoration: "none", color: "inherit" }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}