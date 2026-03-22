"use client";

import AppShell from "@/components/Appshell";
import SummaryCard from "@/components/SummaryCard";
import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuthorizedUser } from "@/hooks/useAuthorizedUser";

type TrainingRecord = {
  id: string;
  employee_id: string;
  training_title: string;
  training_category: string;
  target_role: string;
  status: string;
  progress: number;
  completion_date: string | null;
  created_at: string;
  employees: {
    id: string;
    name: string;
    department: string;
    current_position: string;
  } | null;
};

export default function TrainingRecordsPage() {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuthorizedUser();

  useEffect(() => {
    async function fetchTrainingRecords() {
      const { data, error } = await supabase
        .from("training_records")
        .select(
          `
          *,
          employees (
            id,
            name,
            department,
            current_position
          )
        `
        )
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching training records:", error.message);
      } else {
        setRecords((data as TrainingRecord[]) || []);
      }

      setLoading(false);
    }

    fetchTrainingRecords();
  }, []);

  const statuses = ["All", "Not Started", "Ongoing", "Completed"];

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const employeeName = record.employees?.name ?? "";

      const matchesSearch = employeeName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, searchTerm, statusFilter]);

  const totalRecords = records.length;

  const completedCount = records.filter(
    (record) => record.status === "Completed"
  ).length;

  const ongoingCount = records.filter(
    (record) => record.status === "Ongoing"
  ).length;

  const notStartedCount = records.filter(
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

          {!authLoading && user && user.role !== "viewer" && (
            <Link
              href="/training-records/add"
              className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              + Add Training
            </Link>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Trainings" value={totalRecords} />
          <SummaryCard label="Completed" value={completedCount} />
          <SummaryCard label="Ongoing" value={ongoingCount} />
          <SummaryCard label="Not Started" value={notStartedCount} />
        </div>

        <div className="grid gap-4 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Search Employee
            </label>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
            >
              {statuses.map((status) => (
                <option key={status}>{status}</option>
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
                <th className="px-6 py-4">Training</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Target Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Progress</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    Loading training records...
                  </td>
                </tr>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-slate-200 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      {record.employees ? (
                        <Link
                          href={`/employees/${record.employee_id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {record.employees.name}
                        </Link>
                      ) : (
                        "Unknown"
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {record.employees?.department ?? "—"}
                    </td>

                    <td className="px-6 py-4">{record.training_title}</td>

                    <td className="px-6 py-4">{record.training_category}</td>

                    <td className="px-6 py-4">{record.target_role}</td>

                    <td className="px-6 py-4">{record.status}</td>

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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
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