"use client";

import AppShell from "@/components/Appshell";
import { successionPool } from "@/data/successionPool";
import { useMemo, useState } from "react";
import Link from "next/link";
import SummaryCard from "@/components/SummaryCard";

function getReadinessClasses(readiness: string) {
  if (readiness === "Ready Now") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (readiness === "Ready in 1–2 Years") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-sky-100 text-sky-700";
}

export default function SuccessionPoolPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [readinessFilter, setReadinessFilter] = useState("All");

  const departments = useMemo(() => {
    return ["All", ...new Set(successionPool.map((candidate) => candidate.department))];
  }, []);

  const readinessLevels = [
    "All",
    "Ready Now",
    "Ready in 1–2 Years",
    "Ready in 3–5 Years",
  ];

  const filteredCandidates = useMemo(() => {
    return successionPool.filter((candidate) => {
      const matchesSearch = candidate.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesDepartment =
        departmentFilter === "All" || candidate.department === departmentFilter;

      const matchesReadiness =
        readinessFilter === "All" || candidate.readiness === readinessFilter;

      return matchesSearch && matchesDepartment && matchesReadiness;
    });
  }, [searchTerm, departmentFilter, readinessFilter]);

  const totalCandidates = successionPool.length;

  const readyNowCount = successionPool.filter(
    (candidate) => candidate.readiness === "Ready Now"
  ).length;

  const highPotentialCount = successionPool.filter(
    (candidate) => candidate.talentRank === "High Potential"
  ).length;

  const inDevelopmentCount = successionPool.filter(
    (candidate) => candidate.status === "In Development"
  ).length;

  return (
    <AppShell>
      <div className="space-y-6 text-black">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Succession Pool</h1>
            <p className="mt-1 text-sm text-slate-500">
              Track succession candidates, readiness, and development progress.
            </p>
          </div>

          <Link
            href="/succession-pool/add"
            className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            + Add Candidate
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Candidates" value={totalCandidates} />
          <SummaryCard label="Ready Now" value={readyNowCount} />
          <SummaryCard label="High Potential" value={highPotentialCount} />
          <SummaryCard label="In Development" value={inDevelopmentCount} />
        </div>

        <div className="grid gap-4 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Search Candidate
            </label>
            <input
              type="text"
              placeholder="Search by name..."
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
              Readiness
            </label>
            <select
              value={readinessFilter}
              onChange={(e) => setReadinessFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-500"
            >
              {readinessLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Target Role</th>
                <th className="px-6 py-4">Talent Rank</th>
                <th className="px-6 py-4">Readiness</th>
                <th className="px-6 py-4">Progress</th>
              </tr>
            </thead>

            <tbody>
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="border-t border-slate-200 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/employees/${candidate.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {candidate.name}
                      </Link>
                    </td>

                    <td className="px-6 py-4">{candidate.department}</td>
                    <td className="px-6 py-4">{candidate.currentPosition}</td>
                    <td className="px-6 py-4">{candidate.targetRole}</td>
                    <td className="px-6 py-4">{candidate.talentRank}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${getReadinessClasses(
                          candidate.readiness
                        )}`}
                      >
                        {candidate.readiness}
                      </span>
                    </td>

                    <td className="w-40 px-6 py-4">
                      <div className="h-2 w-full rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-slate-800"
                          style={{ width: `${candidate.progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {candidate.progress}%
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No succession candidates found.
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