"use client";

import AppShell from "@/components/Appshell";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddTrainingRecordPage() {
  const router = useRouter();

  const [employeeName, setEmployeeName] = useState("");
  const [department, setDepartment] = useState("");
  const [trainingTitle, setTrainingTitle] = useState("");
  const [trainingCategory, setTrainingCategory] = useState("Leadership");
  const [targetRole, setTargetRole] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [progress, setProgress] = useState(0);
  const [completionDate, setCompletionDate] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    alert("Training record added (prototype).");

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
              Employee Name
            </label>
            <input
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
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
            className="w-full rounded-xl bg-slate-800 py-2 text-white hover:bg-slate-700"
          >
            Add Training Record
          </button>
        </form>
      </div>
    </AppShell>
  );
}