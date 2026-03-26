"use client";

import AppShell from "@/components/Appshell";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { requireRole } from "@/lib/requireRole";

type EmployeeOption = {
  id: string;
  employee_id: string;
  name: string;
  department: string;
  current_position: string;
  target_role: string;
  readiness: string;
  progress: number;
};

export default function AddCandidatePage() {
  const router = useRouter();

  // 🔐 Role protection state
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [talentRank, setTalentRank] = useState("High Potential");
  const [readiness, setReadiness] = useState("Ready in 1–2 Years");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("In Development");
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadEmployees() {
      const { data, error } = await supabase
        .from("employees")
        .select("id, employee_id, name, department, current_position, target_role, readiness, progress")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error loading employees:", error.message);
      } else {
        setEmployees(data || []);
      }

      setLoadingEmployees(false);
    }

    loadEmployees();
  }, []);

  function handleEmployeeChange(employeeRowId: string) {
    setSelectedEmployeeId(employeeRowId);

    const selected = employees.find((emp) => emp.id === employeeRowId);
    if (!selected) return;

    setDepartment(selected.department ?? "");
    setCurrentPosition(selected.current_position ?? "");
    setTargetRole(selected.target_role ?? "");
    setReadiness(selected.readiness ?? "Ready in 1–2 Years");
    setProgress(selected.progress ?? 0);

    if (selected.readiness === "Ready Now") {
      setTalentRank("Ready Successor");
      setStatus("Active");
    } else if (selected.readiness === "Ready in 1–2 Years") {
      setTalentRank("High Potential");
      setStatus("In Development");
    } else {
      setTalentRank("Emerging Talent");
      setStatus("In Development");
    }
  }

  // 🔐 Check access on load
  useEffect(() => {
    async function checkAccess() {
      const result = await requireRole(["admin", "editor"]);

      if (!result.allowed) {
        setAllowed(false);
      } else {
        setAllowed(true);
      }
    }

    checkAccess();
  }, []);

  // 🔐 Loading state
  if (allowed === null) {
    return (
      <AppShell>
        <div className="p-6 text-black">Checking access...</div>
      </AppShell>
    );
  }

  // 🔐 Access denied
  if (!allowed) {
    return (
      <AppShell>
        <div className="p-6 text-center text-black">
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="text-sm text-slate-500">
            You do not have permission to access this page.
          </p>
        </div>
      </AppShell>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from("succession_pool").insert([
      {
        employee_id: selectedEmployeeId,
        target_role: targetRole,
        readiness,
        progress,
        talent_rank: talentRank,
        status,
      },
    ]);

    setSaving(false);

    if (error) {
      alert(`Failed to add candidate: ${error.message}`);
      return;
    }

    alert("Succession candidate added successfully.");
    router.push("/succession-pool");
  }

  return (
    <AppShell>
      <div className="max-w-xl space-y-6 text-black">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Add Succession Candidate
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Add an employee to the succession planning pool.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
        >
          <div>
            <label className="text-sm font-medium text-slate-700">
              Select Employee
            </label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => handleEmployeeChange(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2"
              required
              disabled={loadingEmployees}
            >
              <option value="">
                {loadingEmployees ? "Loading employees..." : "Choose an employee"}
              </option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.employee_id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Department
            </label>
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2"
              disabled
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Current Position
            </label>
            <input
              value={currentPosition}
              onChange={(e) => setCurrentPosition(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2"
              disabled
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Target Role
            </label>
            <input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Talent Rank
            </label>
            <select
              value={talentRank}
              onChange={(e) => setTalentRank(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2"
            >
              <option>High Potential</option>
              <option>Ready Successor</option>
              <option>Emerging Talent</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Readiness
            </label>
            <select
              value={readiness}
              onChange={(e) => setReadiness(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2"
            >
              <option>Ready Now</option>
              <option>Ready in 1–2 Years</option>
              <option>Ready in 3–5 Years</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Development Progress (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2"
            >
              <option>Active</option>
              <option>In Development</option>
              <option>On Hold</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-slate-800 py-2 text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Add Candidate"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}