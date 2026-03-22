"use client";

import AppShell from "@/components/Appshell";
import SummaryCard from "@/components/SummaryCard";
import { supabase } from "@/lib/supabase";
import { getAuthorizedUserByEmail } from "@/lib/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

type UserInfo = {
  email: string;
  role: string;
};

type Employee = {
  id: string;
};

type SuccessionCandidate = {
  id: string;
  readiness: string;
};

type TrainingRecord = {
  id: string;
  status: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [candidates, setCandidates] = useState<SuccessionCandidate[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        window.location.href = "/login";
        return;
      }

      const authorizedUser = await getAuthorizedUserByEmail(user.email);

      if (!authorizedUser) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      setUser({
        email: user.email,
        role: authorizedUser.role,
      });

      const [employeesRes, candidatesRes, trainingRes] = await Promise.all([
        supabase.from("employees").select("id"),
        supabase.from("succession_pool").select("id, readiness"),
        supabase.from("training_records").select("id, status"),
      ]);

      if (!employeesRes.error) {
        setEmployees((employeesRes.data as Employee[]) || []);
      }

      if (!candidatesRes.error) {
        setCandidates((candidatesRes.data as SuccessionCandidate[]) || []);
      }

      if (!trainingRes.error) {
        setTrainingRecords((trainingRes.data as TrainingRecord[]) || []);
      }

      setLoading(false);
    }

    loadDashboard();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <AppShell>
        <div className="p-6 text-black">Loading dashboard...</div>
      </AppShell>
    );
  }

  if (accessDenied) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">Access Denied</h1>
          <p className="mt-3 text-sm text-slate-500">
            Your account is not authorized to access this system.
          </p>

          <button
            onClick={handleLogout}
            className="mt-6 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Sign Out
          </button>
        </div>
      </main>
    );
  }

  const totalEmployees = employees.length;
  const totalCandidates = candidates.length;
  const readyNow = candidates.filter(
    (candidate) => candidate.readiness === "Ready Now"
  ).length;
  const completedTraining = trainingRecords.filter(
    (record) => record.status === "Completed"
  ).length;

  return (
    <AppShell>
      <div className="space-y-6 text-black">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">
              Welcome, {user?.email} ({user?.role})
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Sign Out
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Employees" value={totalEmployees} />
          <SummaryCard label="Total Candidates" value={totalCandidates} />
          <SummaryCard label="Ready Now" value={readyNow} />
          <SummaryCard label="Completed Training" value={completedTraining} />
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">
            Authentication Status
          </h2>

          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>
              <span className="font-semibold">Signed in as:</span> {user?.email}
            </p>
            <p>
              <span className="font-semibold">Role:</span> {user?.role}
            </p>
            <p>
              Access is currently allowed because your email exists in the
              authorized users list.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">
            Next Security Step
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            After this, we will protect the other pages and hide editing buttons
            based on role.
          </p>
        </div>
      </div>
    </AppShell>
  );
}