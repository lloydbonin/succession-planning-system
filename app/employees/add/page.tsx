"use client";

import AppShell from "@/components/Appshell";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { requireRole } from "@/lib/requireRole";

export default function AddEmployeePage() {
  const router = useRouter();

  // 🔐 Role protection state
  const [allowed, setAllowed] = useState<boolean | null>(null);

  // 🧾 Form state
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [readiness, setReadiness] = useState("Ready in 1–2 Years");
  const [trainingStatus, setTrainingStatus] = useState("Not Started");
  const [progress, setProgress] = useState(0);
  const [yearsOfService, setYearsOfService] = useState<number | "">("");
  const [email, setEmail] = useState("");
  const [developmentPlan, setDevelopmentPlan] = useState("");
  const [saving, setSaving] = useState(false);

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

  // ✅ Submit handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { data, error } = await supabase
      .from("employees")
      .insert([
        {
          employee_id: employeeId,
          name,
          department,
          current_position: currentPosition,
          target_role: targetRole,
          readiness,
          training_status: trainingStatus,
          progress,
          years_of_service:
            yearsOfService === "" ? null : Number(yearsOfService),
          email: email || null,
          development_plan: developmentPlan || null,
        },
      ])
      .select()
      .single();

    setSaving(false);

    if (error) {
      alert(`Failed to add employee: ${error.message}`);
      return;
    }

    alert("Employee added successfully.");
    router.push(`/employees/${data.id}`);
  }

  return (
    <AppShell>
      <div className="max-w-xl space-y-6 text-black">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Add Employee
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create a new employee succession profile.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
        >
          <div>
            <label className="text-sm font-medium text-slate-700">
              Employee ID
            </label>
            <input
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Department
            </label>
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2"
              required
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
              required
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
              Training Status
            </label>
            <select
              value={trainingStatus}
              onChange={(e) => setTrainingStatus(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2"
            >
              <option>Not Started</option>
              <option>Ongoing</option>
              <option>Completed</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Progress (%)
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
              Years of Service
            </label>
            <input
              type="number"
              min="0"
              value={yearsOfService}
              onChange={(e) =>
                setYearsOfService(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="mt-1 w-full rounded-xl border px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Development Plan
            </label>
            <textarea
              value={developmentPlan}
              onChange={(e) => setDevelopmentPlan(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2"
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-slate-800 py-2 text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Add Employee"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}