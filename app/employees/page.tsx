"use client";

import AppShell from "@/components/Appshell";
import { employees } from "@/data/employees";
import { useRouter } from "next/navigation";

export default function EmployeesPage() {
  const router = useRouter();

  return (
    <AppShell>
      <div>
        <h1 className="mb-6 text-3xl font-bold text-slate-800">Employees</h1>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm text-black">
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
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-t border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => router.push(`/employees/${employee.id}`)}
                >
                  <td className="px-6 py-4">{employee.employeeId}</td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800">
                      {employee.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">{employee.department}</td>
                  <td className="px-6 py-4">{employee.currentPosition}</td>
                  <td className="px-6 py-4">{employee.targetRole}</td>
                  <td className="px-6 py-4">{employee.readiness}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}