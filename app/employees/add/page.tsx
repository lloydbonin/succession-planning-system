"use client";

import AppShell from "@/components/Appshell";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddEmployeePage() {
  const router = useRouter();

  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [readiness, setReadiness] = useState("Ready in 1–2 Years");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    alert("Employee added (prototype).");

    router.push("/employees");
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

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-800 py-2 text-white"
          >
            Add Employee
          </button>
        </form>
      </div>
    </AppShell>
  );
}