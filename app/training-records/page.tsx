"use client";

import AppShell from "@/components/Appshell";
import { trainingRecords } from "@/data/trainingRecords";
import { useMemo, useState } from "react";
import Link from "next/link";
import SummaryCard from "@/components/SummaryCard";

function getStatusClasses(status: string) {
  if (status === "Completed") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "Ongoing") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-200 text-slate-700";
}

export default function TrainingRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const departments = useMemo(() => {
    return ["All", ...new Set(trainingRecords.map((record) => record.department))];
  }, []);

  const statusOptions = ["All", "Completed", "Ongoing", "Not Started"];

  const filteredRecords = useMemo(() => {
    return trainingRecords.filter((record) => {
      const matchesSearch =
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.trainingTitle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        departmentFilter === "All" || record.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchTerm, departmentFilter, statusFilter]);

  const totalRecords = trainingRecords.length;

  const completedCount = trainingRecords.filter(
    (record) => record.status === "Completed"
  ).length;

  const ongoingCount = trainingRecords.filter(
    (record) => record.status === "Ongoing"
  ).length;

  const notStartedCount = trainingRecords.filter(
    (record) => record.status === "Not Started"
  ).length;

  return (
    <AppShell>
      <div className="space-y-6 text-black">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Training Records</h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor employee development programs and training progress.
            </p>
          </div>

          <Link
            href="/training-records/add"
            className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            + Add Training
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Records" value={totalRecords} />
          <SummaryCard label="Completed" value={completedCount} />
          <SummaryCard label="Ongoing" value={ongoingCount} />
          <SummaryCard label="Not Started" value={notStartedCount} />
        </div>

        <div className="grid gap-4 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Search
            </label>
            <input
              type="text"
              placeholder="Employee or training title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Department
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-500"
            >
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Training Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Target Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Completion</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-slate-200 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/employees/${record.employeeId}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {record.employeeName}
                      </Link>
                    </td>

                    <td className="px-6 py-4">{record.department}</td>
                    <td className="px-6 py-4">{record.trainingTitle}</td>
                    <td className="px-6 py-4">{record.trainingCategory}</td>
                    <td className="px-6 py-4">{record.targetRole}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td className="w-40 px-6 py-4">
                      <div className="h-2 w-full rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-slate-800"
                          style={{ width: `${record.progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {record.progress}%
                      </p>
                    </td>

                    <td className="px-6 py-4">{record.completionDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    No training records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}