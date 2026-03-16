"use client";

import AppShell from "@/components/Appshell";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type EmployeeOption = {
  id: string;
  employee_id: string;
  name: string;
  department: string;
  target_role: string;
};

export default function AddTrainingRecordPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [trainingTitle, setTrainingTitle] = useState("");
  const [trainingCategory, setTrainingCategory] = useState("Leadership");
  const [targetRole, setTargetRole] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [progress, setProgress] = useState(0);
  const [completionDate, setCompletionDate] = useState("");
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadEmployees() {
      const { data, error } = await supabase
        .from("employees")
        .select("id, employee_id, name, department, target_role")
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
    setTargetRole(selected.target_role ?? "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from("training_records").insert([
      {
        employee_id: selectedEmployeeId,
        training_title: trainingTitle,
        training_category: trainingCategory,
        target_role: targetRole,
        status,
        progress,
        completion_date: completionDate || null,
      },
    ]);

    setSaving(false);

    if (error) {
      alert(`Failed to add training record: ${error.message}`);
      return;
    }

    alert("Training record added successfully.");
    router.push("/training-records");
  }

  return (
    <AppShell>
      <div className="max-w-xl space-y-6 text-black">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Add Training Record
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Assign a development or training record to an employee.
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
              Training Title
            </label>
            <input
              value={trainingTitle}
              onChange={(e) => setTrainingTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Training Category
            </label>
            <select
              value={trainingCategory}
              onChange={(e) => setTrainingCategory(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2"
            >
              <option>Leadership</option>
              <option>Management</option>
              <option>Technical</option>
              <option>Compliance</option>
            </select>
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
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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
              Completion Date
            </label>
            <input
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              placeholder="e.g. June 2026"
              className="mt-1 w-full rounded-xl border px-4 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-slate-800 py-2 text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Add Training Record"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}