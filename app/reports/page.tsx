"use client";

import AppShell from "@/components/Appshell";
import SummaryCard from "@/components/SummaryCard";
import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useState } from "react";

type Employee = {
  id: string;
  department: string;
};

type SuccessionCandidate = {
  id: string;
  readiness: string;
  employees: {
    department: string;
  } | null;
};

type TrainingRecord = {
  id: string;
  status: string;
  employees: {
    department: string;
  } | null;
};

export default function ReportsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [candidates, setCandidates] = useState<SuccessionCandidate[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReportsData() {
      const [employeesRes, candidatesRes, trainingRes] = await Promise.all([
        supabase.from("employees").select("id, department"),
        supabase.from("succession_pool").select(`
          id,
          readiness,
          employees (
            department
          )
        `),
        supabase.from("training_records").select(`
          id,
          status,
          employees (
            department
          )
        `),
      ]);

      if (employeesRes.error) {
        console.error("Error fetching employees:", employeesRes.error.message);
      } else {
        setEmployees((employeesRes.data as Employee[]) || []);
      }

      if (candidatesRes.error) {
        console.error("Error fetching candidates:", candidatesRes.error.message);
      } else {
        setCandidates((candidatesRes.data as unknown as SuccessionCandidate[]) || []);
      }

      if (trainingRes.error) {
        console.error("Error fetching training records:", trainingRes.error.message);
      } else {
        setTrainingRecords((trainingRes.data as unknown as TrainingRecord[]) || []);
      }

      setLoading(false);
    }

    fetchReportsData();
  }, []);

  const totalEmployees = employees.length;
  const totalCandidates = candidates.length;

  const readyNowCount = candidates.filter(
    (candidate) => candidate.readiness === "Ready Now"
  ).length;

  const completedTrainingCount = trainingRecords.filter(
    (record) => record.status === "Completed"
  ).length;

  const readinessSummary = [
    {
      label: "Ready Now",
      count: candidates.filter((candidate) => candidate.readiness === "Ready Now")
        .length,
    },
    {
      label: "Ready in 1–2 Years",
      count: candidates.filter(
        (candidate) => candidate.readiness === "Ready in 1–2 Years"
      ).length,
    },
    {
      label: "Ready in 3–5 Years",
      count: candidates.filter(
        (candidate) => candidate.readiness === "Ready in 3–5 Years"
      ).length,
    },
  ];

  const trainingSummary = [
    {
      label: "Completed",
      count: trainingRecords.filter((record) => record.status === "Completed")
        .length,
    },
    {
      label: "Ongoing",
      count: trainingRecords.filter((record) => record.status === "Ongoing")
        .length,
    },
    {
      label: "Not Started",
      count: trainingRecords.filter(
        (record) => record.status === "Not Started"
      ).length,
    },
  ];

  const departments = useMemo(() => {
    return [...new Set(employees.map((employee) => employee.department))];
  }, [employees]);

  const departmentOverview = departments.map((department) => {
    const employeeCount = employees.filter(
      (employee) => employee.department === department
    ).length;

    const candidateCount = candidates.filter(
      (candidate) => candidate.employees?.department === department
    ).length;

    const readyNowDepartmentCount = candidates.filter(
      (candidate) =>
        candidate.employees?.department === department &&
        candidate.readiness === "Ready Now"
    ).length;

    const completedTrainingDepartmentCount = trainingRecords.filter(
      (record) =>
        record.employees?.department === department &&
        record.status === "Completed"
    ).length;

    return {
      department,
      employeeCount,
      candidateCount,
      readyNowDepartmentCount,
      completedTrainingDepartmentCount,
    };
  });

  return (
    <AppShell>
      <div className="space-y-6 text-black">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Reports</h1>
          <p className="mt-1 text-sm text-slate-500">
            View succession planning and training analytics across the organization.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Employees" value={totalEmployees} />
          <SummaryCard label="Total Candidates" value={totalCandidates} />
          <SummaryCard label="Ready Now" value={readyNowCount} />
          <SummaryCard
            label="Completed Training"
            value={completedTrainingCount}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Readiness Summary
            </h2>

            {loading ? (
              <p className="text-sm text-slate-500">Loading readiness summary...</p>
            ) : (
              <div className="space-y-4">
                {readinessSummary.map((item) => {
                  const percentage =
                    totalCandidates > 0
                      ? Math.round((item.count / totalCandidates) * 100)
                      : 0;

                  return (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          {item.label}
                        </span>
                        <span className="text-slate-500">{item.count}</span>
                      </div>

                      <div className="h-3 w-full rounded-full bg-slate-200">
                        <div
                          className="h-3 rounded-full bg-slate-800"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Training Status Summary
            </h2>

            {loading ? (
              <p className="text-sm text-slate-500">Loading training summary...</p>
            ) : (
              <div className="space-y-4">
                {trainingSummary.map((item) => {
                  const percentage =
                    trainingRecords.length > 0
                      ? Math.round((item.count / trainingRecords.length) * 100)
                      : 0;

                  return (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          {item.label}
                        </span>
                        <span className="text-slate-500">{item.count}</span>
                      </div>

                      <div className="h-3 w-full rounded-full bg-slate-200">
                        <div
                          className="h-3 rounded-full bg-slate-800"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            Department Overview
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Employees</th>
                  <th className="px-6 py-4">Candidates</th>
                  <th className="px-6 py-4">Ready Now</th>
                  <th className="px-6 py-4">Completed Training</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Loading department overview...
                    </td>
                  </tr>
                ) : departmentOverview.length > 0 ? (
                  departmentOverview.map((item) => (
                    <tr
                      key={item.department}
                      className="border-t border-slate-200"
                    >
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {item.department}
                      </td>
                      <td className="px-6 py-4">{item.employeeCount}</td>
                      <td className="px-6 py-4">{item.candidateCount}</td>
                      <td className="px-6 py-4">
                        {item.readyNowDepartmentCount}
                      </td>
                      <td className="px-6 py-4">
                        {item.completedTrainingDepartmentCount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No report data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}