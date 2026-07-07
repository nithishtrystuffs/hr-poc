"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/useAuth";
import Sidebar from "../components/Sidebar";

function Widget({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, minWidth: 150 }}>
      <div style={{ fontSize: 13, color: "#666" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function timeAgo(timestamp: string) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  return `${Math.floor(mins / 60)} hr ago`;
}

export default function DashboardPage() {
  useAuth(); // guards the route
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    api.dashboardSummary().then(setSummary);
  }, []);

  return (
    <Sidebar>
      <main style={{ padding: 32, flex: 1 }}>
        <h1>Executive Dashboard</h1>

        {!summary ? (
          <p>Loading...</p>
        ) : (
          <>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
              <Widget label="Total Employees" value={summary.total_employees} />
              <Widget label="Onboarded Today" value={summary.onboarded_today} />
              <Widget label="Offboarded Today" value={summary.offboarded_today} />
              <Widget label="Pending Onboarding" value={summary.pending_onboarding} />
              <Widget label="Pending Offboarding" value={summary.pending_offboarding} />
              <Widget label="Approval Pending" value={summary.pending_approvals} />
            </div>

            <div style={{ display: "flex", gap: 32, marginTop: 32, flexWrap: "wrap" }}>
              <div style={{ width: 380, height: 240 }}>
                <h3>Onboarding Trend (7 days)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={summary.onboarding_trend}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ width: 380, height: 240 }}>
                <h3>Offboarding Trend (7 days)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={summary.offboarding_trend}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#f43f5e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ width: 380, height: 240 }}>
                <h3>Department-wise Employees</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.department_distribution}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ width: 380, height: 240 }}>
                <h3>Role-wise Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.role_distribution}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ marginTop: 32, maxWidth: 700 }}>
              <h3>Recent Activity</h3>
              <div style={{ border: "1px solid #eee", borderRadius: 8 }}>
                {summary.recent_activity.map((a: any, i: number) => (
                  <div key={i} style={{ padding: "10px 14px", borderBottom: i < summary.recent_activity.length - 1 ? "1px solid #f0f0f0" : "none", fontSize: 13 }}>
                    <strong>{a.agent}</strong> — {a.action} <span style={{ color: "#999" }}>({timeAgo(a.timestamp)})</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </Sidebar>
  );
}