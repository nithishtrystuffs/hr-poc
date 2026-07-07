"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../lib/useAuth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Executive Dashboard" },
  { href: "/directory", label: "Employee Directory" },
  { href: "/onboarding-tracker", label: "Onboarding Tracker" },
  { href: "/offboarding-tracker", label: "Offboarding Tracker" },
  { href: "/approvals", label: "Approval Dashboard" },
  { href: "/ai-decisions", label: "AI Decision Center" },
  { href: "/compliance", label: "Compliance Dashboard" },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, logout } = useAuth();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <nav style={{ width: 220, borderRight: "1px solid #eee", padding: 16, flexShrink: 0 }}>
        <div style={{ fontWeight: 600, marginBottom: 16 }}>Onboarding POC</div>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "block",
              padding: "8px 12px",
              marginBottom: 4,
              borderRadius: 6,
              textDecoration: "none",
              color: pathname === item.href ? "#fff" : "#333",
              background: pathname === item.href ? "#6366f1" : "transparent",
              fontSize: 14,
            }}
          >
            {item.label}
          </Link>
        ))}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #eee", fontSize: 13, color: "#666" }}>
          {role} <button onClick={logout} style={{ marginLeft: 8 }}>Log out</button>
        </div>
      </nav>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}