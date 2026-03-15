"use client";

import AppShell from "@/components/Appshell";
import { employees } from "@/data/employees";
import { useMemo, useState } from "react";
import Link from "next/link";
import SummaryCard from "@/components/SummaryCard";

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [readinessFilter, setReadinessFilter] = useState("All");

  const departments = useMemo(() => {
    return ["All", ...new Set(employees.map((employee) => employee.department))];
  }, []);

  const readinessLevels = [
    "All",
    "Ready Now",
    "Ready in 1–2 Years",
    "Ready in 3–5 Years",
  ];

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = employee.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesDepartment =
        departmentFilter === "All" || employee.department === departmentFilter;

      const matchesReadiness =
        readinessFilter === "All" || employee.readiness === readinessFilter;

      return matchesSearch && matchesDepartment && matchesReadiness;
    });
  }, [searchTerm, departmentFilter, readinessFilter]);

  const totalEmployees = employees.length;

  const readyNowCount = employees.filter(
    (employee) => employee.readiness === "Ready Now"
  ).length;

  const inDevelopmentCount = employees.filter(
    (employee) => employee.readiness !== "Ready Now"
  ).length;

  const totalDepartments = new Set(
    employees.map((employee) => employee.department)
  ).size;

  return (
    <AppShell>
      <div className="space-y-6 text-black">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Employees</h1>
            <p className="mt-1 text-sm text-slate-500">
              View and manage employee succession profiles.
            </p>
          </div>

          <Link
            href="/employees/add"
            className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            + Add Employee
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Employees" value={totalEmployees} />
          <SummaryCard label="Ready Now" value={readyNowCount} />
          <SummaryCard label="In Development" value={inDevelopmentCount} />
          <SummaryCard label="Departments Covered" value={totalDepartments} />
        </div>

        <div className="grid gap-4 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Search Employee
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
                <th className="px-6 py-4">Employee ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Current Position</th>
                <th className="px-6 py-4">Target Role</th>
                <th className="px-6 py-4">Readiness</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-t border-slate-200 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">{employee.employeeId}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/employees/${employee.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {employee.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{employee.department}</td>
                    <td className="px-6 py-4">{employee.currentPosition}</td>
                    <td className="px-6 py-4">{employee.targetRole}</td>
                    <td className="px-6 py-4">{employee.readiness}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No employees found.
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