"use client";

import AppShell from "@/components/Appshell";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type EditEmployeePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditEmployeePage({ params }: EditEmployeePageProps) {
  const router = useRouter();

  const [id, setId] = useState("");
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadEmployee() {
      const resolvedParams = await params;
      const employeeIdFromRoute = resolvedParams.id;
      setId(employeeIdFromRoute);

      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("id", employeeIdFromRoute)
        .single();

      if (error || !data) {
        console.error("Error loading employee:", error?.message);
        setLoading(false);
        return;
      }

      setEmployeeId(data.employee_id ?? "");
      setName(data.name ?? "");
      setDepartment(data.department ?? "");
      setCurrentPosition(data.current_position ?? "");
      setTargetRole(data.target_role ?? "");
      setReadiness(data.readiness ?? "Ready in 1–2 Years");
      setTrainingStatus(data.training_status ?? "Not Started");
      setProgress(data.progress ?? 0);
      setYearsOfService(data.years_of_service ?? "");
      setEmail(data.email ?? "");
      setDevelopmentPlan(data.development_plan ?? "");
      setLoading(false);
    }

    loadEmployee();
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("employees")
      .update({
        employee_id: employeeId,
        name,
        department,
        current_position: currentPosition,
        target_role: targetRole,
        readiness,
        training_status: trainingStatus,
        progress,
        years_of_service: yearsOfService === "" ? null : Number(yearsOfService),
        email: email || null,
        development_plan: developmentPlan || null,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert(`Failed to update employee: ${error.message}`);
      return;
    }

    alert("Employee updated successfully.");
    router.push(`/employees/${id}`);
  }

  if (loading) {
    return (
      <AppShell>
        <div className="p-6 text-black">Loading employee...</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-xl space-y-6 text-black">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Edit Employee
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Update the employee succession profile.
            </p>
          </div>

          <Link
            href={`/employees/${id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Profile
          </Link>
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
                setYearsOfService(e.target.value === "" ? "" : Number(e.target.value))
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
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}