"use client";
import { useAuth } from "../../lib/useAuth";
import Sidebar from "../components/Sidebar";

export default function ApprovalsPage() {
  useAuth();
  return (
    <Sidebar>
      <main style={{ padding: 32 }}>
        <h1>Approval Dashboard</h1>
        <p>Coming next — approvals list + approve/reject buttons per employee.</p>
      </main>
    </Sidebar>
  );
}